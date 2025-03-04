"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileWarning as Running, Download, ArrowLeft, Calendar, Dumbbell, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TrainingPlan {
  name: string;
  age: number;
  experienceLevel: string;
  primaryEvent: string;
  programLength: number;
  trainingDays: number;
  goals: string;
  plan: string;
  summary: string;
}

export default function PlanResults() {
  const router = useRouter();
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Get the plan data from localStorage
      const storedPlan = localStorage.getItem("trainingPlan");
      
      if (storedPlan) {
        const parsedPlan = JSON.parse(storedPlan);
        
        // Check if there's an error in the plan data
        if (parsedPlan.error) {
          setError(parsedPlan.error);
          setPlan(null);
        } else {
          setPlan(parsedPlan);
        }
      } else {
        // If no plan data is found, redirect to the create plan page
        router.push("/create-plan");
      }
    } catch (err) {
      setError("Failed to load training plan data");
      console.error("Error loading plan data:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const downloadPlan = () => {
    if (!plan) return;
    
    const planText = `# Training Plan for ${plan.name}
Age: ${plan.age}
Experience Level: ${plan.experienceLevel}
Primary Event: ${plan.primaryEvent}
Program Length: ${plan.programLength} weeks
Training Days: ${plan.trainingDays} days per week
Goals: ${plan.goals}

${plan.plan}
`;

    const blob = new Blob([planText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${plan.name.replace(/\s+/g, "_")}_training_plan.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading your training plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Running className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">TrackCoach AI</span>
            </Link>
            <ThemeToggle />
          </div>
        </header>
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl flex items-center justify-center">
          <div className="w-full">
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            <p className="text-lg mb-6 text-center">We encountered an error while generating your training plan.</p>
            
            <div className="flex justify-center">
              <Button asChild>
                <Link href="/create-plan">Try Again</Link>
              </Button>
            </div>
          </div>
        </main>
        
        <footer className="border-t py-6">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} TrackCoach AI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">No training plan found. Please create a new plan.</p>
          <Button asChild>
            <Link href="/create-plan">Create Training Plan</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Running className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">TrackCoach AI</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href="/create-plan">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Link>
            </Button>
            <Button onClick={downloadPlan} size="sm">
              <Download className="mr-2 h-4 w-4" /> Download Plan
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Athlete Profile</CardTitle>
                <CardDescription>Your training information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="font-medium">{plan.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Age</h3>
                  <p className="font-medium">{plan.age}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Experience Level</h3>
                  <p className="font-medium capitalize">{plan.experienceLevel}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Primary Event</h3>
                  <p className="font-medium">{plan.primaryEvent}</p>
                </div>
                <Separator />
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>{plan.programLength} weeks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Dumbbell className="h-5 w-5 text-muted-foreground" />
                  <span>{plan.trainingDays} days/week</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Goals</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.goals}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Plan Summary</CardTitle>
                <CardDescription>Key points of your training plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: plan.summary.replace(/\n/g, '<br>') }} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Training Plan</CardTitle>
                <CardDescription>
                  A {plan.programLength}-week personalized plan for {plan.primaryEvent}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{plan.programLength} Weeks</Badge>
                  <Badge variant="outline">{plan.trainingDays} Days/Week</Badge>
                  <Badge variant="outline">{plan.primaryEvent}</Badge>
                  <Badge variant="outline" className="capitalize">{plan.experienceLevel}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="plan">
                  <TabsList className="mb-4">
                    <TabsTrigger value="plan">Full Plan</TabsTrigger>
                  </TabsList>
                  <TabsContent value="plan">
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: plan.plan.replace(/\n/g, '<br>') }} />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} TrackCoach AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
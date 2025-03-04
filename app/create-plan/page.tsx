"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FileWarning as Running } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.coerce.number().min(8).max(100),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced", "elite"]),
  primaryEvent: z.string().min(1, {
    message: "Please select your primary event.",
  }),
  secondaryEvents: z.string().optional(),
  personalBests: z.string().optional(),
  programLength: z.coerce.number().min(4).max(52),
  trainingDays: z.coerce.number().min(3).max(7),
  goals: z.string().min(10, {
    message: "Please describe your goals in at least 10 characters.",
  }),
  injuries: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export default function CreatePlan() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 18,
      experienceLevel: "intermediate",
      primaryEvent: "",
      secondaryEvents: "",
      personalBests: "",
      programLength: 12,
      trainingDays: 5,
      goals: "",
      injuries: "",
      additionalInfo: "",
    },
  });

  useEffect(() => {
    console.log('form', form);
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate training plan");
      }
      
      // Store the plan data in localStorage to access it on the results page
      localStorage.setItem("trainingPlan", JSON.stringify(data));
      
      router.push("/plan-results");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to generate your training plan. Please try again.";
      setApiError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Create Your Training Plan</h1>
          <p className="text-muted-foreground">
            Fill out the form below to generate your personalized track and field training plan.
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 border border-destructive/50 bg-destructive/10 rounded-md text-destructive">
            <p className="font-medium">Error: {apiError}</p>
            <p className="text-sm mt-1">Please check if the OpenAI API key is properly configured.</p>
          </div>
        )}

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" min={8} max={100} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                        <SelectItem value="advanced">Advanced (5-10 years)</SelectItem>
                        <SelectItem value="elite">Elite (10+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How long have you been training in track and field?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primaryEvent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Event</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your main event" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="100m">100m</SelectItem>
                        <SelectItem value="200m">200m</SelectItem>
                        <SelectItem value="400m">400m</SelectItem>
                        <SelectItem value="800m">800m</SelectItem>
                        <SelectItem value="1500m">1500m</SelectItem>
                        <SelectItem value="5000m">5000m</SelectItem>
                        <SelectItem value="10000m">10000m</SelectItem>
                        <SelectItem value="100mH/110mH">100mH/110mH</SelectItem>
                        <SelectItem value="400mH">400mH</SelectItem>
                        <SelectItem value="3000mSC">3000m Steeplechase</SelectItem>
                        <SelectItem value="HJ">High Jump</SelectItem>
                        <SelectItem value="LJ">Long Jump</SelectItem>
                        <SelectItem value="TJ">Triple Jump</SelectItem>
                        <SelectItem value="PV">Pole Vault</SelectItem>
                        <SelectItem value="SP">Shot Put</SelectItem>
                        <SelectItem value="DT">Discus Throw</SelectItem>
                        <SelectItem value="HT">Hammer Throw</SelectItem>
                        <SelectItem value="JT">Javelin Throw</SelectItem>
                        <SelectItem value="Heptathlon">Heptathlon</SelectItem>
                        <SelectItem value="Decathlon">Decathlon</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The event you want to focus on the most in your training.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondaryEvents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Events (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 200m, Long Jump"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List any other events you compete in, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personalBests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Bests (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 100m: 11.2s, Long Jump: 6.5m"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List your personal best performances for each event.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="programLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Length (weeks): {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={4}
                          max={52}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        How many weeks do you want your training plan to cover?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trainingDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Days Per Week: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={3}
                          max={7}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        How many days per week can you train?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what you want to achieve with this training plan..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific about what you want to achieve (e.g., "Improve my 400m time by 2 seconds" or "Qualify for nationals").
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="injuries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current or Recent Injuries (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List any injuries or physical limitations..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This helps us create a plan that works around your limitations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any other information that might be relevant..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include details about your training environment, equipment access, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Generating Your Plan..." : "Generate Training Plan"}
              </Button>
            </form>
          </Form>
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
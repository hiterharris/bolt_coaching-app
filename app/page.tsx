import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { FileWarning as Running, Medal, Calendar, Dumbbell, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Running className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">TrackCoach AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button asChild>
              <Link href="/create-plan">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Your Personal Track & Field Coach
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                AI-powered training plans tailored to your events, goals, and experience level.
              </p>
              <div className="mt-10">
                <Button size="lg" asChild>
                  <Link href="/create-plan" className="px-8 py-6 text-lg">
                    Create Your Training Plan <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <Medal className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tell Us Your Goals</h3>
                <p className="text-muted-foreground">
                  Share your events, personal bests, and training goals so we can understand what you're aiming for.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Planning</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your information to create a personalized training plan optimized for your specific needs.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Follow Your Plan</h3>
                <p className="text-muted-foreground">
                  Get a detailed week-by-week training schedule with specific workouts designed to improve your performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 text-center">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Ready to Reach Your Full Potential?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Create your personalized training plan today and start working towards your track and field goals.
            </p>
            <Button size="lg" asChild>
              <Link href="/create-plan">Create Your Training Plan</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} TrackCoach AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
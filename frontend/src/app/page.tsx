import Link from "next/link";
import { ArrowRight, Dumbbell, Flame, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const modules = [
  {
    title: "Habits",
    description: "Track daily consistency, build streaks, and see what needs attention today.",
    icon: Flame,
  },
  {
    title: "Study",
    description: "Run focused sessions with a simple timer and keep your progress measurable.",
    icon: TimerReset,
  },
  {
    title: "Fitness",
    description: "Plan workouts, log execution, and keep training visible in the same flow.",
    icon: Dumbbell,
  },
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-full border border-white/70 bg-white/75 px-4 py-3 shadow-[var(--shadow)] backdrop-blur sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
                Coreflow
              </p>
              <p className="text-sm text-[var(--muted)]">
                Personal operating system for habits, study, and training.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-[var(--muted)] hover:text-foreground">
                Log in
              </Link>
              <Button asChild>
                <Link href="/signup">Start free</Link>
              </Button>
            </div>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:py-20">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)] shadow-sm">
              Unified self-improvement SaaS
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                One calm dashboard for the routines that move your life forward.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
                Coreflow brings habits, deep work, and workouts into one modular workspace so
                your personal growth system stays visible and sustainable.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">
                  Build your system
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/login">I already have an account</Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-none bg-[rgba(19,33,29,0.92)] text-white shadow-[0_24px_80px_rgba(19,33,29,0.18)]">
                <CardHeader className="pb-3">
                  <CardDescription className="text-white/70">Today</CardDescription>
                  <CardTitle className="text-3xl">3 systems</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-white/70">
                  Habits, study, and fitness stay in one decision-friendly dashboard.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Momentum</CardDescription>
                  <CardTitle className="text-3xl">Daily streaks</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-[var(--muted)]">
                  The MVP starts with habits and leaves room for study and workout analytics.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Scalable</CardDescription>
                  <CardTitle className="text-3xl">Feature modules</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-[var(--muted)]">
                  Clean feature folders, server actions, and Supabase-ready auth keep growth clean.
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-4">
            {modules.map(({ title, description, icon: Icon }) => (
              <Card
                key={title}
                className="relative overflow-hidden bg-white/80 shadow-[var(--shadow)] backdrop-blur"
              >
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </div>
                  <div className="rounded-2xl bg-[rgba(31,122,99,0.12)] p-3 text-[var(--accent)]">
                    <Icon className="size-5" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-start justify-center px-4 py-16 sm:px-6 lg:px-8">
      <Badge>Offline</Badge>
      <div className="mt-4 space-y-3">
        <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.045em] text-[var(--landing-text)] sm:text-[2.35rem]">
          Coreflow needs a connection to load fresh data.
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--landing-text-muted)] sm:text-base sm:leading-7">
          The install shell is available, but authenticated habits, focus sessions, and
          workouts are fetched live to avoid stale personal state.
        </p>
      </div>
      <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild className="w-full sm:w-auto" variant="secondary">
          <Link href="/login">Open login</Link>
        </Button>
      </div>
    </main>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { signInAction, signUpAction } from "@/features/auth/actions";

type AuthFormProps = {
  feedback?: {
    error?: string;
    message?: string;
  };
  mode: "login" | "signup";
};

export function AuthForm({ feedback, mode }: AuthFormProps) {
  const isSignup = mode === "signup";

  return (
    <Card className="w-full max-w-xl justify-self-end">
      <CardHeader>
        <CardTitle>{isSignup ? "Create your Coreflow account" : "Sign in to Coreflow"}</CardTitle>
        <CardDescription>
          {isSignup
            ? "Supabase email/password auth is wired up and ready for your project keys."
            : "Protected dashboard routes use server-side auth checks, not client-only guards."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {feedback?.error ? (
          <p className="rounded-2xl border border-[rgba(204,90,67,0.2)] bg-[rgba(204,90,67,0.08)] px-4 py-3 text-sm text-[var(--danger)]">
            {feedback.error}
          </p>
        ) : null}
        {feedback?.message ? (
          <p className="rounded-2xl border border-[rgba(31,122,99,0.18)] bg-[rgba(31,122,99,0.08)] px-4 py-3 text-sm text-[var(--accent)]">
            {feedback.message}
          </p>
        ) : null}

        <form action={isSignup ? signUpAction : signInAction} className="space-y-4">
          {isSignup ? (
            <label className="block space-y-2 text-sm font-medium">
              <span>Full name</span>
              <Input name="fullName" placeholder="Alex Johnson" required />
            </label>
          ) : null}

          <label className="block space-y-2 text-sm font-medium">
            <span>Email</span>
            <Input autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
          </label>

          <label className="block space-y-2 text-sm font-medium">
            <span>Password</span>
            <Input
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={6}
              name="password"
              placeholder="At least 6 characters"
              required
              type="password"
            />
          </label>

          <SubmitButton className="w-full" pendingLabel={isSignup ? "Creating account..." : "Signing in..."}>
            {isSignup ? "Create account" : "Sign in"}
          </SubmitButton>
        </form>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white/50 px-4 py-4 text-sm">
          <p className="text-[var(--muted)]">
            {isSignup ? "Already have an account?" : "New to Coreflow?"}
          </p>
          <Button asChild size="sm" variant="ghost">
            <Link href={isSignup ? "/login" : "/signup"}>
              {isSignup ? "Log in" : "Create account"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

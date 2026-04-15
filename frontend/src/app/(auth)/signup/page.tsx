import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/components/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { getQueryParam } from "@/lib/utils";

type SignupPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <Link
            href="/"
            className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--muted)]"
          >
            Coreflow
          </Link>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight">Build your growth system.</h1>
            <p className="max-w-xl text-base leading-7 text-[var(--muted)]">
              Create an account to start with habits now, then expand into study and workout
              tracking as the product grows.
            </p>
          </div>
        </div>

        <AuthForm
          mode="signup"
          feedback={{
            error: getQueryParam(params.error),
            message: getQueryParam(params.message),
          }}
        />
      </div>
    </main>
  );
}

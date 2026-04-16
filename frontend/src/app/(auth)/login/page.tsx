import { redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/components/auth-form";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { getCurrentUser } from "@/lib/auth";
import { getQueryParam } from "@/lib/utils";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <AuthShell
      description="Return to a single operating layer for habits, focus, and training momentum."
      eyebrow="Welcome back"
      title="Continue the system you are building."
    >
      <AuthForm
        mode="login"
        feedback={{
          error: getQueryParam(params.error),
          message: getQueryParam(params.message),
        }}
      />
    </AuthShell>
  );
}

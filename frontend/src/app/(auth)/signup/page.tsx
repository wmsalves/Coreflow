import { redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/components/auth-form";
import { AuthShell } from "@/features/auth/components/auth-shell";
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
    <AuthShell mode="signup">
      <AuthForm
        mode="signup"
        feedback={{
          error: getQueryParam(params.error),
          message: getQueryParam(params.message),
        }}
      />
    </AuthShell>
  );
}

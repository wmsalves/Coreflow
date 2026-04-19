import { LandingPage } from "@/features/landing/components/landing-page";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  return <LandingPage userEmail={user?.email ?? null} />;
}

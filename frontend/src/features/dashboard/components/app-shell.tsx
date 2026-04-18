import { DashboardExperience } from "@/features/dashboard/components/dashboard-experience";

type AppShellProps = {
  children: React.ReactNode;
  userEmail: string | null;
};

export function AppShell({ children, userEmail }: AppShellProps) {
  return (
    <DashboardExperience userEmail={userEmail}>
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pt-28">
        {children}
      </main>
    </DashboardExperience>
  );
}
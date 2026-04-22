import { DashboardExperience } from "@/features/dashboard/components/dashboard-experience";

type AppShellProps = {
  children: React.ReactNode;
  userEmail: string | null;
};

export function AppShell({ children, userEmail }: AppShellProps) {
  return (
    <DashboardExperience userEmail={userEmail}>
      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-7xl flex-col overscroll-y-contain px-4 pb-[calc(7.25rem+env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pt-28">
        {children}
      </main>
    </DashboardExperience>
  );
}

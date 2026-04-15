import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/auth/actions";
import { SidebarNav } from "@/features/dashboard/components/sidebar-nav";

type AppShellProps = {
  children: React.ReactNode;
  userEmail: string;
};

export function AppShell({ children, userEmail }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-5 px-4 py-4 sm:px-6 lg:flex-row lg:px-8">
        <aside className="flex shrink-0 flex-col justify-between rounded-[30px] border border-white/80 bg-[rgba(19,33,29,0.94)] p-6 text-white shadow-[0_28px_80px_rgba(19,33,29,0.24)] lg:min-h-[calc(100vh-2rem)] lg:w-[290px]">
          <div className="space-y-8">
            <div className="space-y-3">
              <Badge className="bg-white/10 text-white">Coreflow</Badge>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Growth dashboard
                </h1>
                <p className="text-sm leading-6 text-white/70">
                  Minimal app shell ready for modules, metrics, and
                  subscriptions.
                </p>
              </div>
            </div>

            <SidebarNav />

            <div className="rounded-[26px] border border-white/10 bg-white/6 p-4">
              <p className="text-sm font-medium">Signed in as</p>
              <p className="mt-1 truncate text-sm text-white/70">{userEmail}</p>
            </div>
          </div>

          <form action={signOutAction} className="mt-8">
            <Button className="w-full" variant="secondary">
              Sign out
            </Button>
          </form>
        </aside>

        <main className="min-w-0 flex-1 rounded-[32px] border border-white/75 bg-[rgba(255,255,255,0.74)] shadow-[var(--shadow)] backdrop-blur">
          {children}
        </main>
      </div>
    </div>
  );
}

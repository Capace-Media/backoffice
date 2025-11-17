import {
  Sidebar,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { FileText } from "lucide-react";
import { DashboardNav } from "@/components/dashboard-nav";
import { ModeToggle } from "@/components/mode-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Backoffice</span>
                <span className="text-xs text-muted-foreground">Dashboard</span>
              </div>
            </div>
          </SidebarHeader>
          <DashboardNav />
        </Sidebar>
        <main className="flex flex-1 flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <div className="flex-1" />
            <ModeToggle />
          </header>
          <div className="flex flex-1 flex-col overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}

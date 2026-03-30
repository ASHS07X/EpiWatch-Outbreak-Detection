import { Activity, LayoutDashboard, Upload, AlertTriangle, Info, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export type Section = "dashboard" | "upload" | "alerts" | "about";

interface SidebarProps {
  active: Section;
  onNavigate: (s: Section) => void;
  onExit: () => void;
}

const NAV_ITEMS: { id: Section; icon: React.ElementType; label: string }[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "upload", icon: Upload, label: "Data Upload" },
  { id: "alerts", icon: AlertTriangle, label: "Alerts" },
  { id: "about", icon: Info, label: "About" },
];

export default function Sidebar({ active, onNavigate, onExit }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50 max-md:w-16">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="max-md:hidden">
          <h2 className="font-display text-sm font-bold text-foreground tracking-wider">EpiWatch</h2>
          <p className="text-[10px] font-mono text-muted-foreground tracking-wider">v1.0</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-body text-sm",
              active === item.id
                ? "bg-sidebar-accent text-primary neon-border"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="max-md:hidden">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={onExit}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-sidebar-accent/50 transition-all font-body text-sm"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="max-md:hidden">Exit</span>
        </button>
      </div>
    </aside>
  );
}

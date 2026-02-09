import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, History, TrendingUp, Settings, FileText, HelpCircle } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/import", label: "Import Screenshots", icon: Upload },
  { to: "/history", label: "History", icon: History },
  { to: "/trends", label: "Trends", icon: TrendingUp },
  { to: "/how-to-use", label: "How to Use", icon: HelpCircle },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/disclaimer", label: "Disclaimer", icon: FileText },
];

interface AppSidebarProps {
  onNavigate?: () => void;
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--gradient-sidebar)" }}>
      <div className="p-5">
        <h1 className="text-base font-semibold tracking-tight text-foreground leading-none">RideLens</h1>
        <p className="mt-1.5 text-[10px] font-light tracking-wide text-muted-foreground">by ESF Designs Vision</p>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <p className="text-[10px] font-light text-muted-foreground text-center tracking-wide">
          RideLens · ESF Designs Vision
        </p>
      </div>
    </div>
  );
}

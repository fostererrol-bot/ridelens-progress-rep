import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, History, TrendingUp, Settings, Bike, FileText } from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/import", label: "Import Screenshots", icon: Upload },
  { to: "/history", label: "History", icon: History },
  { to: "/trends", label: "Trends", icon: TrendingUp },
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
      <div className="p-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <Bike className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-foreground">RideLens</h1>
          <p className="text-[10px] text-muted-foreground">Turning ride data into clear insight.</p>
        </div>
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

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
          Built to explore how Zwift screenshots can be turned into structured insight.
        </p>
        <p className="text-[10px] text-muted-foreground text-center">RideLens by ESF Designs Vision</p>
      </div>
    </div>
  );
}

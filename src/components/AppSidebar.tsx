import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, History, TrendingUp, Settings, FileText, HelpCircle, Download, MoreHorizontal, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ridelensLogo from "@/assets/ridelens-logo.png";

const primaryLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/import", label: "Import Screenshots", icon: Upload },
  { to: "/history", label: "History", icon: History },
  { to: "/trends", label: "Trends", icon: TrendingUp },
];

const secondaryLinks = [
  { to: "/how-to-use", label: "How to Use", icon: HelpCircle },
  { to: "/install", label: "Install App", icon: Download },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/disclaimer", label: "Disclaimer", icon: FileText },
];

interface AppSidebarProps {
  onNavigate?: () => void;
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const location = useLocation();
  const isSecondaryActive = secondaryLinks.some((l) => l.to === location.pathname);
  const [moreOpen, setMoreOpen] = useState(isSecondaryActive);

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-sidebar-accent text-primary"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    }`;

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--gradient-sidebar)" }}>
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 overflow-hidden shrink-0">
          <img src={ridelensLogo} alt="RideLens logo" className="w-full h-full object-cover object-[center_35%]" />
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight text-foreground leading-none">RideLens</h1>
          <p className="mt-1 text-[10px] font-light tracking-wide text-muted-foreground">by ESF Designs Vision</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {primaryLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={onNavigate} className={linkClass(location.pathname === to)}>
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}

        <Collapsible open={moreOpen} onOpenChange={setMoreOpen}>
          <CollapsibleTrigger className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full">
            <MoreHorizontal className="w-4 h-4" />
            <span className="flex-1 text-left">More</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-1 ml-2">
            {secondaryLinks.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={onNavigate} className={linkClass(location.pathname === to)}>
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <p className="text-[10px] font-light text-muted-foreground text-center tracking-wide">
          RideLens · ESF Designs Vision
        </p>
      </div>
    </div>
  );
}

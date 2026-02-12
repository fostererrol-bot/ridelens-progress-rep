import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Bike, Zap, Timer, Mountain, Flame, Heart, Award } from "lucide-react";
import type { RideMenuMetrics } from "@/types/zwift";

interface RideMenuDashboardProps {
  data: RideMenuMetrics;
}

function StatBlock({ label, value, unit }: { label: string; value: number | string | null; unit?: string }) {
  return (
    <div>
      <span className="metric-label">{label}</span>
      <p className="font-mono text-lg font-semibold mt-0.5">
        {value != null ? `${typeof value === "number" ? value.toLocaleString() : value}${unit || ""}` : "—"}
      </p>
    </div>
  );
}

function SectionCard({ title, icon, children, delay = 0 }: { title: string; icon: ReactNode; children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="rounded-xl border border-border bg-card p-5 card-glow"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-primary">{icon}</span>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

export function RideMenuDashboard({ data }: RideMenuDashboardProps) {
  const durationHrs = Math.floor(Number(data.ride_duration_minutes) / 60);
  const durationMins = Math.round(Number(data.ride_duration_minutes) % 60);
  const durationStr = durationHrs > 0 ? `${durationHrs}h ${durationMins}m` : `${durationMins}m`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* This Ride */}
      <SectionCard title="This Ride" icon={<Bike className="w-4 h-4" />} delay={0.05}>
        <div className="space-y-4">
          {data.rider_name && (
            <p className="text-sm font-medium text-foreground">{data.rider_name}</p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="metric-label">Distance</span>
              <p className="metric-value">{Number(data.ride_distance_km).toFixed(1)} km</p>
            </div>
            <div>
              <span className="metric-label">Duration</span>
              <p className="metric-value">{durationStr}</p>
            </div>
            <div>
              <span className="metric-label">Calories</span>
              <p className="font-mono text-lg font-semibold">{data.ride_calories?.toLocaleString()}</p>
            </div>
            <div>
              <span className="metric-label">Elevation</span>
              <p className="font-mono text-lg font-semibold">{data.ride_elevation_m?.toLocaleString()} m</p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Power Comparison */}
      <SectionCard title="Power" icon={<Zap className="w-4 h-4" />} delay={0.1}>
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2 text-center">
            <span className="text-[10px] text-muted-foreground font-semibold">5s</span>
            <span className="text-[10px] text-muted-foreground font-semibold">1m</span>
            <span className="text-[10px] text-muted-foreground font-semibold">5m</span>
            <span className="text-[10px] text-muted-foreground font-semibold">20m</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground">This Ride</span>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[data.power_5s_w, data.power_1m_w, data.power_5m_w, data.power_20m_w].map((v, i) => (
                <span key={i} className="font-mono text-sm font-semibold bg-primary/10 rounded px-1 py-0.5">{v}W</span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground">Your Best</span>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[data.best_5s_w, data.best_1m_w, data.best_5m_w, data.best_20m_w].map((v, i) => (
                <span key={i} className="font-mono text-sm font-semibold bg-accent/10 rounded px-1 py-0.5">{v}W</span>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Your Totals */}
      <SectionCard title="Your Totals" icon={<Mountain className="w-4 h-4" />} delay={0.15}>
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="Total Distance" value={Number(data.total_distance_km).toLocaleString()} unit=" km" />
          <StatBlock
            label="Total Time"
            value={`${Math.floor(Number(data.total_time_minutes) / 60)}h`}
          />
          <StatBlock label="Total Calories" value={data.total_calories?.toLocaleString()} />
          <StatBlock label="Total Elevation" value={data.total_elevation_m?.toLocaleString()} unit=" m" />
        </div>
      </SectionCard>

      {/* Rider Score & Distributions */}
      <SectionCard title="Rider Score & Averages" icon={<Award className="w-4 h-4" />} delay={0.2}>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="metric-label">Rider Score</span>
              <p className="metric-value">{data.rider_score?.toLocaleString()}</p>
            </div>
            <div>
              <span className="metric-label">Until Next Level</span>
              <p className="font-mono text-lg font-semibold text-primary">{data.until_next_level}</p>
            </div>
          </div>
          <div className="border-t border-border pt-3 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-primary" />
              <div>
                <span className="metric-label">Avg Power</span>
                <p className="font-mono text-sm font-semibold">{data.avg_power_w}W</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-destructive" />
              <div>
                <span className="metric-label">Avg HR</span>
                <p className="font-mono text-sm font-semibold">{data.avg_heart_rate_bpm} bpm</p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

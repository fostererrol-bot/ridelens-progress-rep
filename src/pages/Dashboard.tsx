import { useState } from "react";
import { Trophy, Zap, Activity, Brain } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { ProgressBar } from "@/components/ProgressBar";
import { FreshnessBadge } from "@/components/FreshnessBadge";
import { ChangesSinceLastReport } from "@/components/ChangesSinceLastReport";
import { RideMenuDashboard } from "@/components/RideMenuDashboard";
import { SnapshotSelector } from "@/components/SnapshotSelector";
import { SnapshotThumbnail } from "@/components/SnapshotThumbnail";
import { useAllSnapshots } from "@/hooks/useSnapshots";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data, isLoading } = useAllSnapshots();
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const snapshots = data || [];

  if (snapshots.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-2">No data yet</h2>
        <p className="text-muted-foreground">Import your first Zwift screenshot to get started.</p>
      </div>
    );
  }

  // Clamp index in case data changed
  const idx = Math.min(selectedIndex, snapshots.length - 1);
  const current = snapshots[idx];
  const prev = idx < snapshots.length - 1 ? snapshots[idx + 1] : null;

  const isRideMenu = current.snapshot.screen_type === "ride_menu";

  const p = current.progress;
  const perf = current.performance;
  const fit = current.fitness;
  const train = current.training;

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5">
        <h1 className="text-2xl font-bold mb-3">Dashboard</h1>
        <div className="flex items-start gap-4">
          <SnapshotThumbnail imageUrl={current.snapshot.image_url} />
          <div className="flex-1 min-w-0">
            <SnapshotSelector
              snapshots={snapshots}
              currentIndex={idx}
              onIndexChange={setSelectedIndex}
            />
          </div>
        </div>
      </motion.div>

      {/* Ride Menu layout */}
      {isRideMenu && current.rideMenu ? (
        <RideMenuDashboard data={current.rideMenu} />
      ) : (
        <>
          {/* Progress Report layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <MetricCard title="Career Progress" icon={<Trophy className="w-4 h-4" />} delay={0.05}>
              {p && (
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="metric-value text-primary">Lvl {p.level}</span>
                    <span className="text-xs text-muted-foreground">+{p.this_ride_xp} XP this ride</span>
                  </div>
                  <ProgressBar current={p.xp_current} target={p.xp_target} label="XP to Next Level" />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="metric-label">Achievements</span>
                      <p className="font-mono text-sm mt-0.5">{p.achievements_current} / {p.achievements_target}</p>
                    </div>
                    <div>
                      <span className="metric-label">Route Badges</span>
                      <p className="font-mono text-sm mt-0.5">{p.route_badges_current} / {p.route_badges_target}</p>
                    </div>
                  </div>
                  {p.challenge_name && (
                    <div className="border-t border-border pt-3">
                      <span className="metric-label">Challenge: {p.challenge_name}</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Stage {p.challenge_stage_current}/{p.challenge_stage_target}
                      </p>
                      <ProgressBar
                        current={Number(p.challenge_progress_km)}
                        target={Number(p.challenge_target_km)}
                        label="Distance"
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              )}
            </MetricCard>

            <MetricCard title="Performance" icon={<Zap className="w-4 h-4" />} delay={0.1}>
              {perf && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "5s Power", value: perf.best_5s_w },
                      { label: "1m Power", value: perf.best_1m_w },
                      { label: "5m Power", value: perf.best_5m_w },
                      { label: "20m Power", value: perf.best_20m_w },
                    ].map((m) => (
                      <div key={m.label}>
                        <span className="metric-label">{m.label}</span>
                        <p className="font-mono text-lg font-semibold mt-0.5">{m.value}W</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 grid grid-cols-2 gap-3">
                    <div>
                      <span className="metric-label">FTP</span>
                      <p className="metric-value">{perf.ftp_w}W</p>
                    </div>
                    <div>
                      <span className="metric-label">Racing Score</span>
                      <p className="metric-value">{perf.racing_score}</p>
                    </div>
                  </div>
                </div>
              )}
            </MetricCard>

            <MetricCard title="Fitness Trends" icon={<Activity className="w-4 h-4" />} delay={0.15}>
              {fit && (
                <div className="space-y-4">
                  <ProgressBar
                    current={Number(fit.weekly_progress_km)}
                    target={Number(fit.weekly_goal_km)}
                    label="Weekly Goal"
                  />
                  <p className="text-xs text-muted-foreground">
                    This ride: {Number(fit.weekly_this_ride_km).toFixed(1)} km
                  </p>
                  <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
                    <div>
                      <span className="metric-label">Streak</span>
                      <p className="font-mono text-lg font-semibold">{fit.streak_weeks} wks</p>
                    </div>
                    <div>
                      <span className="metric-label">Total Distance</span>
                      <p className="font-mono text-lg font-semibold">{Number(fit.total_distance_km).toLocaleString()} km</p>
                    </div>
                    <div>
                      <span className="metric-label">Elevation</span>
                      <p className="font-mono text-lg font-semibold">{Number(fit.total_elevation_m).toLocaleString()} m</p>
                    </div>
                    <div>
                      <span className="metric-label">Energy</span>
                      <p className="font-mono text-lg font-semibold">{Number(fit.total_energy_kj).toLocaleString()} kJ</p>
                    </div>
                  </div>
                </div>
              )}
            </MetricCard>

            <MetricCard title="Training Status" icon={<Brain className="w-4 h-4" />} delay={0.2}>
              {train && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="metric-label">Training Score</span>
                      <p className="metric-value">{Number(train.training_score).toFixed(1)}</p>
                    </div>
                    <div>
                      <span className="metric-label">Delta</span>
                      <p className={`font-mono text-lg font-semibold ${Number(train.training_score_delta) >= 0 ? "delta-up" : "delta-down"}`}>
                        {Number(train.training_score_delta) >= 0 ? "+" : ""}{Number(train.training_score_delta).toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <span className="metric-label">Freshness</span>
                      <div className="mt-1">
                        <FreshnessBadge state={train.freshness_state} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </MetricCard>
          </div>

          <ChangesSinceLastReport latest={current} previous={prev} />
        </>
      )}
    </div>
  );
}

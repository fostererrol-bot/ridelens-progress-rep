import { Trophy, Zap, Activity, Brain, Clock } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { ProgressBar } from "@/components/ProgressBar";
import { DeltaIndicator } from "@/components/DeltaIndicator";
import { FreshnessBadge } from "@/components/FreshnessBadge";
import { useLatestSnapshots } from "@/hooks/useSnapshots";
import { useSeedData } from "@/hooks/useSeedData";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Dashboard() {
  useSeedData();
  const { data, isLoading } = useLatestSnapshots(2);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const latest = data?.[0];
  const prev = data?.[1];

  if (!latest) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-2">No data yet</h2>
        <p className="text-muted-foreground">Import your first Zwift screenshot to get started.</p>
      </div>
    );
  }

  const p = latest.progress;
  const perf = latest.performance;
  const fit = latest.fitness;
  const train = latest.training;

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
          <Clock className="w-3.5 h-3.5" />
          Latest: {format(new Date(latest.snapshot.created_at), "PPp")}
          {latest.snapshot.source === "seed" && (
            <span className="text-xs bg-secondary px-2 py-0.5 rounded-full ml-2">Seed Data</span>
          )}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Career Progress */}
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

        {/* Performance */}
        <MetricCard title="Performance" icon={<Zap className="w-4 h-4" />} delay={0.1}>
          {perf && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "5s Power", value: perf.best_5s_w, prev: prev?.performance?.best_5s_w },
                  { label: "1m Power", value: perf.best_1m_w, prev: prev?.performance?.best_1m_w },
                  { label: "5m Power", value: perf.best_5m_w, prev: prev?.performance?.best_5m_w },
                  { label: "20m Power", value: perf.best_20m_w, prev: prev?.performance?.best_20m_w },
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

        {/* Fitness Trends */}
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

        {/* Training Status */}
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

      {/* Delta Strip */}
      {prev && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-4 card-glow"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Changes since previous snapshot
          </h3>
          <div className="flex flex-wrap gap-4">
            <DeltaIndicator label="FTP" current={latest.performance?.ftp_w ?? 0} previous={prev.performance?.ftp_w} unit="W" />
            <DeltaIndicator label="Training Score" current={Number(latest.training?.training_score ?? 0)} previous={Number(prev.training?.training_score)} />
            <DeltaIndicator label="Streak" current={latest.fitness?.streak_weeks ?? 0} previous={prev.fitness?.streak_weeks} unit=" wks" />
            <DeltaIndicator label="Total Distance" current={Number(latest.fitness?.total_distance_km ?? 0)} previous={Number(prev.fitness?.total_distance_km)} unit=" km" />
            <DeltaIndicator label="5s Power" current={latest.performance?.best_5s_w ?? 0} previous={prev.performance?.best_5s_w} unit="W" />
            <DeltaIndicator label="Racing Score" current={latest.performance?.racing_score ?? 0} previous={prev.performance?.racing_score} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

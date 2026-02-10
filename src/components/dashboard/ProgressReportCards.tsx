import { Trophy, Zap, Activity, Brain } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { ProgressBar } from "@/components/ProgressBar";
import { FreshnessBadge } from "@/components/FreshnessBadge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import type { FullSnapshot } from "@/types/zwift";

interface ProgressReportCardsProps {
  current: FullSnapshot;
}

export function ProgressReportCards({ current }: ProgressReportCardsProps) {
  const isMobile = useIsMobile();
  const p = current.progress;
  const perf = current.performance;
  const fit = current.fitness;
  const train = current.training;

  return (
    <div className={`grid gap-5 mb-6 ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
      {/* 1. Career Progress */}
      <MetricCard title="Career Progress" icon={<Trophy className="w-4 h-4" />} delay={0.05}>
        {p && (
          <div className="space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="metric-value text-primary">Lvl {p.level}</span>
              <span className="text-xs text-muted-foreground">+{p.this_ride_xp} XP this ride</span>
            </div>
            <ProgressBar current={p.xp_current} target={p.xp_target} label="XP to Next Level" />
            <div className="flex gap-6">
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
              isMobile ? (
                <Collapsible>
                  <CollapsibleTrigger className="text-xs text-primary font-medium w-full text-left border-t border-border pt-3">
                    Challenge: {p.challenge_name} ›
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <p className="text-xs text-muted-foreground">
                      Stage {p.challenge_stage_current}/{p.challenge_stage_target}
                    </p>
                    <ProgressBar
                      current={Number(p.challenge_progress_km)}
                      target={Number(p.challenge_target_km)}
                      label="Distance"
                      className="mt-2"
                    />
                  </CollapsibleContent>
                </Collapsible>
              ) : (
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
              )
            )}
          </div>
        )}
      </MetricCard>

      {/* 2. Performance */}
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
            <div className={`border-t border-border pt-3 ${isMobile ? "flex gap-6" : "grid grid-cols-2 gap-3"}`}>
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

      {/* 3. Training Status */}
      <MetricCard title="Training Status" icon={<Brain className="w-4 h-4" />} delay={0.15}>
        {train && (
          <div className="space-y-4">
            <div className={`flex items-center ${isMobile ? "gap-6" : "gap-4"}`}>
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

      {/* 4. Fitness Trends */}
      <MetricCard title="Fitness Trends" icon={<Activity className="w-4 h-4" />} delay={0.2}>
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
            <div className={`border-t border-border pt-3 ${isMobile ? "grid grid-cols-2 gap-y-3 gap-x-6" : "grid grid-cols-2 gap-3"}`}>
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
    </div>
  );
}

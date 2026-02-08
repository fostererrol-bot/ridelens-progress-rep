import { motion } from "framer-motion";
import { GitCompareArrows } from "lucide-react";
import { DeltaChip } from "@/components/DeltaChip";
import type { FullSnapshot } from "@/types/zwift";

interface ChangesSinceLastReportProps {
  latest: FullSnapshot;
  previous: FullSnapshot | null;
}

export function ChangesSinceLastReport({ latest, previous }: ChangesSinceLastReportProps) {
  if (!previous) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-border bg-card p-5 card-glow"
      >
        <div className="flex items-center gap-2 mb-3">
          <GitCompareArrows className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Change Since Last Report
          </h3>
        </div>
        <p className="text-sm text-muted-foreground text-center py-6">
          Upload another report to see changes between sessions.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border border-border bg-card p-5 card-glow"
    >
      <div className="flex items-center gap-2 mb-4">
        <GitCompareArrows className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Change Since Last Report
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        <DeltaChip
          label="FTP"
          current={latest.performance?.ftp_w}
          previous={previous.performance?.ftp_w}
          unit="W"
          showFromTo
        />
        <DeltaChip
          label="Training Score"
          current={latest.training?.training_score != null ? Number(latest.training.training_score) : null}
          previous={previous.training?.training_score != null ? Number(previous.training.training_score) : null}
          showFromTo
        />
        <DeltaChip
          label="Weekly Progress"
          current={latest.fitness?.weekly_progress_km != null ? Number(latest.fitness.weekly_progress_km) : null}
          previous={previous.fitness?.weekly_progress_km != null ? Number(previous.fitness.weekly_progress_km) : null}
          unit=" km"
          showFromTo
        />
        <DeltaChip
          label="Racing Score"
          current={latest.performance?.racing_score}
          previous={previous.performance?.racing_score}
          showFromTo
        />
        <DeltaChip
          label="5s Power"
          current={latest.performance?.best_5s_w}
          previous={previous.performance?.best_5s_w}
          unit="W"
          onlyIfIncreased
        />
        <DeltaChip
          label="1m Power"
          current={latest.performance?.best_1m_w}
          previous={previous.performance?.best_1m_w}
          unit="W"
          onlyIfIncreased
        />
        <DeltaChip
          label="5m Power"
          current={latest.performance?.best_5m_w}
          previous={previous.performance?.best_5m_w}
          unit="W"
          onlyIfIncreased
        />
        <DeltaChip
          label="20m Power"
          current={latest.performance?.best_20m_w}
          previous={previous.performance?.best_20m_w}
          unit="W"
          onlyIfIncreased
        />
        <DeltaChip
          label="Total Distance"
          current={latest.fitness?.total_distance_km != null ? Number(latest.fitness.total_distance_km) : null}
          previous={previous.fitness?.total_distance_km != null ? Number(previous.fitness.total_distance_km) : null}
          unit=" km"
        />
        <DeltaChip
          label="XP"
          current={latest.progress?.xp_current}
          previous={previous.progress?.xp_current}
        />
        <DeltaChip
          label="Streak"
          current={latest.fitness?.streak_weeks}
          previous={previous.fitness?.streak_weeks}
          unit=" wks"
        />
      </div>
    </motion.div>
  );
}

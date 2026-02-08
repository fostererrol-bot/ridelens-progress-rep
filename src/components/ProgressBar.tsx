import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  showValues?: boolean;
  className?: string;
}

export function ProgressBar({ current, target, label, showValues = true, className = "" }: ProgressBarProps) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  return (
    <div className={className}>
      {(label || showValues) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="metric-label">{label}</span>}
          {showValues && (
            <span className="text-xs font-mono text-muted-foreground">
              {current.toLocaleString()} / {target.toLocaleString()}
            </span>
          )}
        </div>
      )}
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className="progress-bar-fill h-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

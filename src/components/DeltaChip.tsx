import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface DeltaChipProps {
  label: string;
  current: number | null | undefined;
  previous: number | null | undefined;
  unit?: string;
  /** If true, only show when value increased */
  onlyIfIncreased?: boolean;
  /** Show current → new format with arrow */
  showFromTo?: boolean;
}

export function DeltaChip({
  label,
  current,
  previous,
  unit = "",
  onlyIfIncreased = false,
  showFromTo = false,
}: DeltaChipProps) {
  if (current == null || previous == null) return null;

  const curr = Number(current);
  const prev = Number(previous);
  const delta = curr - prev;

  if (delta === 0) {
    if (onlyIfIncreased) return null;
    return (
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-muted-foreground text-xs">
        <Minus className="w-3 h-3" />
        <span className="font-medium">{label}</span>
        <span className="font-mono">no change</span>
      </div>
    );
  }

  if (onlyIfIncreased && delta < 0) return null;

  const isUp = delta > 0;
  const colorClass = isUp ? "text-success" : "text-destructive";
  const bgClass = isUp ? "bg-success/10" : "bg-destructive/10";

  return (
    <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg ${bgClass} text-xs`}>
      {isUp ? (
        <ArrowUp className={`w-3 h-3 ${colorClass}`} />
      ) : (
        <ArrowDown className={`w-3 h-3 ${colorClass}`} />
      )}
      <span className="font-medium text-foreground">{label}:</span>
      {showFromTo ? (
        <span className="font-mono text-muted-foreground">
          {prev.toLocaleString()} → {curr.toLocaleString()}
          {unit}
        </span>
      ) : null}
      <span className={`font-mono font-semibold ${colorClass}`}>
        {isUp ? "+" : ""}
        {delta.toLocaleString()}
        {unit}
      </span>
    </div>
  );
}

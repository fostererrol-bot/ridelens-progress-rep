import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface DeltaIndicatorProps {
  current: number;
  previous: number | undefined;
  unit?: string;
  label: string;
}

export function DeltaIndicator({ current, previous, unit = "", label }: DeltaIndicatorProps) {
  if (previous === undefined) return null;
  const diff = current - previous;
  if (diff === 0) {
    return (
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
        <Minus className="w-3 h-3" />
        <span>{label}: no change</span>
      </div>
    );
  }

  const isUp = diff > 0;
  return (
    <div className={`flex items-center gap-1.5 text-xs ${isUp ? "delta-up" : "delta-down"}`}>
      {isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      <span>
        {label}: {isUp ? "+" : ""}
        {diff.toLocaleString()}
        {unit}
      </span>
    </div>
  );
}

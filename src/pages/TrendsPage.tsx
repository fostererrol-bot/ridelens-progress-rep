import { useAllSnapshots } from "@/hooks/useSnapshots";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

type Metric = "ftp" | "training_score" | "total_distance" | "elevation" | "power_5s" | "power_1m" | "power_5m" | "power_20m";

const metricConfig: Record<Metric, { label: string; unit: string; color: string }> = {
  ftp: { label: "FTP", unit: "W", color: "hsl(24, 100%, 50%)" },
  training_score: { label: "Training Score", unit: "", color: "hsl(142, 71%, 45%)" },
  total_distance: { label: "Total Distance", unit: "km", color: "hsl(199, 89%, 48%)" },
  elevation: { label: "Total Elevation", unit: "m", color: "hsl(38, 92%, 50%)" },
  power_5s: { label: "5s Power", unit: "W", color: "hsl(0, 72%, 51%)" },
  power_1m: { label: "1m Power", unit: "W", color: "hsl(280, 65%, 60%)" },
  power_5m: { label: "5m Power", unit: "W", color: "hsl(160, 60%, 45%)" },
  power_20m: { label: "20m Power", unit: "W", color: "hsl(50, 90%, 50%)" },
};

export default function TrendsPage() {
  const { data, isLoading } = useAllSnapshots();
  const [metric, setMetric] = useState<Metric>("ftp");

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const chartData = (data || [])
    .slice()
    .reverse()
    .map((item) => {
      const date = format(new Date(item.snapshot.created_at), "MMM d");
      return {
        date,
        ftp: item.performance?.ftp_w ?? 0,
        training_score: Number(item.training?.training_score ?? 0),
        total_distance: Number(item.fitness?.total_distance_km ?? 0),
        elevation: Number(item.fitness?.total_elevation_m ?? 0),
        power_5s: item.performance?.best_5s_w ?? 0,
        power_1m: item.performance?.best_1m_w ?? 0,
        power_5m: item.performance?.best_5m_w ?? 0,
        power_20m: item.performance?.best_20m_w ?? 0,
      };
    });

  const cfg = metricConfig[metric];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Trends</h1>
        <Select value={metric} onValueChange={(v) => setMetric(v as Metric)}>
          <SelectTrigger className="w-48 bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(metricConfig).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {chartData.length < 2 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>Import at least 2 snapshots to see trends.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 card-glow">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            {cfg.label} {cfg.unit && `(${cfg.unit})`}
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
              <XAxis dataKey="date" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 18%, 12%)",
                  border: "1px solid hsl(220, 15%, 20%)",
                  borderRadius: "8px",
                  color: "hsl(210, 20%, 92%)",
                }}
              />
              <Line
                type="monotone"
                dataKey={metric}
                stroke={cfg.color}
                strokeWidth={2}
                dot={{ fill: cfg.color, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

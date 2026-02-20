import { useAllSnapshots } from "@/hooks/useSnapshots";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell, Legend,
} from "recharts";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Metric = "ftp" | "training_score" | "total_distance" | "elevation" | "power_5s" | "power_1m" | "power_5m" | "power_20m" | "racing_score" | "energy" | "avg_power" | "avg_hr" | "rider_score" | "ride_distance";

const metricConfig: Record<Metric, { label: string; unit: string; color: string }> = {
  ftp: { label: "FTP", unit: "W", color: "hsl(24, 100%, 50%)" },
  training_score: { label: "Training Score", unit: "", color: "hsl(142, 71%, 45%)" },
  total_distance: { label: "Total Distance", unit: "km", color: "hsl(199, 89%, 48%)" },
  elevation: { label: "Total Elevation", unit: "m", color: "hsl(38, 92%, 50%)" },
  power_5s: { label: "5s Power", unit: "W", color: "hsl(0, 72%, 51%)" },
  power_1m: { label: "1m Power", unit: "W", color: "hsl(280, 65%, 60%)" },
  power_5m: { label: "5m Power", unit: "W", color: "hsl(160, 60%, 45%)" },
  power_20m: { label: "20m Power", unit: "W", color: "hsl(50, 90%, 50%)" },
  racing_score: { label: "Racing Score", unit: "", color: "hsl(300, 60%, 55%)" },
  energy: { label: "Total Energy", unit: "kJ", color: "hsl(20, 80%, 55%)" },
  avg_power: { label: "Avg Power (Ride)", unit: "W", color: "hsl(210, 70%, 55%)" },
  avg_hr: { label: "Avg HR (Ride)", unit: "bpm", color: "hsl(0, 65%, 55%)" },
  rider_score: { label: "Rider Score", unit: "", color: "hsl(30, 80%, 50%)" },
  ride_distance: { label: "Ride Distance", unit: "km", color: "hsl(180, 60%, 45%)" },
};

type ViewMode = "time_series" | "between_reports";

/** Linear regression over indexed (x=index, y=value) pairs. Returns slope & intercept. */
function linearRegression(points: { x: number; y: number }[]): { slope: number; intercept: number } | null {
  const n = points.length;
  if (n < 2) return null;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return null;
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export default function TrendsPage() {
  const { data, isLoading } = useAllSnapshots();
  const [metric, setMetric] = useState<Metric>("ftp");
  const [viewMode, setViewMode] = useState<ViewMode>("time_series");

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const sorted = (data || []).slice().reverse(); // oldest first

  const getMetricValue = (item: (typeof sorted)[0], m: Metric): number | null => {
    switch (m) {
      case "ftp": return item.performance?.ftp_w ?? null;
      case "training_score": return item.training?.training_score != null ? Number(item.training.training_score) : null;
      case "total_distance": return item.fitness?.total_distance_km != null ? Number(item.fitness.total_distance_km) : (item.rideMenu?.total_distance_km != null ? Number(item.rideMenu.total_distance_km) : null);
      case "elevation": return item.fitness?.total_elevation_m != null ? Number(item.fitness.total_elevation_m) : (item.rideMenu?.total_elevation_m != null ? Number(item.rideMenu.total_elevation_m) : null);
      case "power_5s": return item.performance?.best_5s_w ?? item.rideMenu?.best_5s_w ?? null;
      case "power_1m": return item.performance?.best_1m_w ?? item.rideMenu?.best_1m_w ?? null;
      case "power_5m": return item.performance?.best_5m_w ?? item.rideMenu?.best_5m_w ?? null;
      case "power_20m": return item.performance?.best_20m_w ?? item.rideMenu?.best_20m_w ?? null;
      case "racing_score": return item.performance?.racing_score ?? null;
      case "energy": return item.fitness?.total_energy_kj != null ? Number(item.fitness.total_energy_kj) : null;
      case "avg_power": return item.rideMenu?.avg_power_w ?? null;
      case "avg_hr": return item.rideMenu?.avg_heart_rate_bpm ?? null;
      case "rider_score": return item.rideMenu?.rider_score ?? null;
      case "ride_distance": return item.rideMenu?.ride_distance_km != null ? Number(item.rideMenu.ride_distance_km) : null;
    }
  };

  const cfg = metricConfig[metric];

  // Time series — all rides on x-axis; value is null where metric isn't available
  const timeSeriesData = sorted.map((item, i) => {
    const dateStr = item.snapshot.captured_at || item.snapshot.created_at;
    return { date: format(new Date(dateStr), "MMM d"), value: getMetricValue(item, metric), _idx: i };
  });

  // Compute linear regression from non-null points
  const validPoints = timeSeriesData
    .map((d, i) => (d.value !== null ? { x: i, y: d.value as number } : null))
    .filter((p): p is { x: number; y: number } => p !== null);

  const regression = linearRegression(validPoints);

  // Merge trend value into each data point
  const chartData = timeSeriesData.map((d, i) => ({
    ...d,
    trend: regression ? parseFloat((regression.slope * i + regression.intercept).toFixed(2)) : null,
  }));

  // Trend direction badge
  const trendSlope = regression?.slope ?? 0;
  const TrendIcon = trendSlope > 0.01 ? TrendingUp : trendSlope < -0.01 ? TrendingDown : Minus;
  const trendColor = trendSlope > 0.01 ? "text-green-500" : trendSlope < -0.01 ? "text-red-500" : "text-muted-foreground";
  const trendLabel = trendSlope > 0.01 ? "Improving" : trendSlope < -0.01 ? "Declining" : "Stable";

  // Between reports — all consecutive pairs where both have a value
  const betweenReportsData = sorted.slice(1).reduce<{ label: string; delta: number }[]>((acc, item, idx) => {
    const prev = sorted[idx];
    const currVal = getMetricValue(item, metric);
    const prevVal = getMetricValue(prev, metric);
    if (currVal === null || prevVal === null) return acc;
    const currDate = format(new Date(item.snapshot.captured_at || item.snapshot.created_at), "MMM d");
    const prevDate = format(new Date(prev.snapshot.captured_at || prev.snapshot.created_at), "MMM d");
    acc.push({ label: `${prevDate} → ${currDate}`, delta: currVal - prevVal });
    return acc;
  }, []);

  const hasEnoughData =
    viewMode === "time_series"
      ? validPoints.length >= 2
      : betweenReportsData.length >= 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Trends</h1>
        <div className="flex items-center gap-3">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList className="bg-secondary">
              <TabsTrigger value="time_series" className="text-xs">Time Series</TabsTrigger>
              <TabsTrigger value="between_reports" className="text-xs">Between Reports</TabsTrigger>
            </TabsList>
          </Tabs>
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
      </div>

      {!hasEnoughData ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>Not enough data for <strong>{cfg.label}</strong> — try a different metric or import more snapshots that include this value.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 card-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              {viewMode === "time_series"
                ? `${cfg.label}${cfg.unit ? ` (${cfg.unit})` : ""}`
                : `${cfg.label} Delta${cfg.unit ? ` (${cfg.unit})` : ""}`}
            </h3>
            {viewMode === "time_series" && regression && (
              <div className={`flex items-center gap-1.5 text-xs font-medium ${trendColor}`}>
                <TrendIcon className="w-4 h-4" />
                <span>{trendLabel}</span>
                <span className="text-muted-foreground font-normal">
                  ({trendSlope >= 0 ? "+" : ""}{trendSlope.toFixed(2)} {cfg.unit}/ride)
                </span>
              </div>
            )}
          </div>

          {viewMode === "time_series" ? (
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
                  formatter={(value: number, name: string) => {
                    if (name === "Trend") return [`${value.toLocaleString()} ${cfg.unit}`, "Trend"];
                    return [`${value.toLocaleString()} ${cfg.unit}`, cfg.label];
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "hsl(215, 15%, 65%)", fontSize: 12 }}>{value}</span>
                  )}
                />
                {/* Actual data line */}
                <Line
                  type="monotone"
                  dataKey="value"
                  name={cfg.label}
                  stroke={cfg.color}
                  strokeWidth={2}
                  dot={{ fill: cfg.color, r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls={true}
                />
                {/* Best-fit trend line */}
                <Line
                  type="linear"
                  dataKey="trend"
                  name="Trend"
                  stroke="hsl(215, 15%, 65%)"
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  dot={false}
                  activeDot={false}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={betweenReportsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
                <ReferenceLine y={0} stroke="hsl(220, 15%, 30%)" strokeWidth={1} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(220, 18%, 12%)",
                    border: "1px solid hsl(220, 15%, 20%)",
                    borderRadius: "8px",
                    color: "hsl(210, 20%, 92%)",
                  }}
                  formatter={(value: number) => [
                    `${value >= 0 ? "+" : ""}${value.toLocaleString()} ${cfg.unit}`,
                    "Delta",
                  ]}
                />
                <Bar dataKey="delta" name="Delta" radius={[4, 4, 0, 0]}>
                  {betweenReportsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.delta >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 72%, 51%)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </div>
  );
}

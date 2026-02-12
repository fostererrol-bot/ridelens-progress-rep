import { Check, AlertTriangle, Loader2, X, Copy, ChevronDown, ChevronUp, Bike, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MetadataSourceBadge } from "@/components/MetadataSourceBadge";
import type { BulkImportItem, BulkItemStatus } from "@/types/bulk-import";

interface BulkImportCardProps {
  item: BulkImportItem;
  onUpdateField: (id: string, section: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}

const statusConfig: Record<BulkItemStatus, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: "Pending", icon: null, color: "text-muted-foreground" },
  hashing: { label: "Hashing...", icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, color: "text-muted-foreground" },
  uploading: { label: "Uploading...", icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, color: "text-info" },
  extracting: { label: "Extracting...", icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, color: "text-primary" },
  ready: { label: "Ready to save", icon: <Check className="w-3.5 h-3.5" />, color: "text-success" },
  saving: { label: "Saving...", icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, color: "text-primary" },
  saved: { label: "Saved", icon: <Check className="w-3.5 h-3.5" />, color: "text-success" },
  duplicate: { label: "Duplicate", icon: <Copy className="w-3.5 h-3.5" />, color: "text-warning" },
  error: { label: "Error", icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "text-destructive" },
};

export function BulkImportCard({ item, onUpdateField, onRemove }: BulkImportCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[item.status];
  const isRideMenu = item.detectedScreenType === "ride_menu";

  const capturedLabel = item.metadata.captured_at
    ? new Date(item.metadata.captured_at).toLocaleString()
    : "Not available";

  const confidence = isRideMenu
    ? item.rideMenuExtraction?.confidence?.overall || 0
    : item.extraction.confidence.overall;

  const renderField = (section: string, field: string, label: string, type: "number" | "text" = "number") => {
    const source = isRideMenu ? item.rideMenuExtraction : item.extraction;
    const value = section === "root" ? (source as any)?.[field] : (source as any)?.[section]?.[field];
    return (
      <div key={`${section}-${field}`}>
        <Label className="text-[10px] text-muted-foreground">{label}</Label>
        <Input
          type={type}
          value={value ?? ""}
          onChange={(e) =>
            onUpdateField(item.id, section, field, type === "number" ? Number(e.target.value) : e.target.value)
          }
          className="mt-0.5 h-8 bg-secondary border-border font-mono text-xs"
          disabled={item.status === "saving" || item.status === "saved"}
        />
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden card-glow">
      {/* Compact header row */}
      <div className="flex items-center gap-3 p-3">
        <img
          src={item.preview}
          alt={item.file.name}
          className="w-14 h-14 rounded-lg border border-border object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{item.file.name}</p>
            {item.status === "ready" && (
              <Badge variant="secondary" className="text-[9px] gap-1 flex-shrink-0">
                {isRideMenu ? <Bike className="w-2.5 h-2.5" /> : <FileText className="w-2.5 h-2.5" />}
                {isRideMenu ? "Ride Menu" : "Progress"}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-muted-foreground">
              {(item.file.size / 1024).toFixed(0)} KB
            </span>
            <span className="text-[10px] text-muted-foreground">•</span>
            <span className="text-[10px] text-muted-foreground">{capturedLabel}</span>
            <MetadataSourceBadge source={item.metadata.metadata_source} />
          </div>
          {item.status === "ready" && confidence < 0.85 && (
            <div className="flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3 text-warning" />
              <span className="text-[10px] text-warning">
                Low confidence ({(confidence * 100).toFixed(0)}%) — review before saving
              </span>
            </div>
          )}
          {item.error && (
            <p className="text-[10px] text-destructive mt-1 truncate">{item.error}</p>
          )}
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color} flex-shrink-0`}>
          {cfg.icon}
          <span>{cfg.label}</span>
        </div>
        {item.status === "ready" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 flex-shrink-0"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        )}
        {(item.status === "pending" || item.status === "ready" || item.status === "duplicate" || item.status === "error") && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 flex-shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(item.id)}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Expandable edit section */}
      {expanded && item.status === "ready" && (
        <div className="border-t border-border p-3 space-y-3">
          {isRideMenu ? (
            <>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Rider</p>
                <div className="grid grid-cols-3 gap-2">
                  {renderField("rider", "name", "Name", "text")}
                  {renderField("rider", "height_cm", "Height (cm)")}
                  {renderField("rider", "weight_kg", "Weight (kg)")}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">This Ride</p>
                <div className="grid grid-cols-4 gap-2">
                  {renderField("this_ride", "distance_km", "Distance (km)")}
                  {renderField("this_ride", "duration_minutes", "Duration (min)")}
                  {renderField("this_ride", "calories", "Calories")}
                  {renderField("this_ride", "elevation_m", "Elevation (m)")}
                  {renderField("this_ride", "power_5s_w", "5s (W)")}
                  {renderField("this_ride", "power_1m_w", "1m (W)")}
                  {renderField("this_ride", "power_5m_w", "5m (W)")}
                  {renderField("this_ride", "power_20m_w", "20m (W)")}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Your Best</p>
                <div className="grid grid-cols-4 gap-2">
                  {renderField("your_best", "best_5s_w", "5s (W)")}
                  {renderField("your_best", "best_1m_w", "1m (W)")}
                  {renderField("your_best", "best_5m_w", "5m (W)")}
                  {renderField("your_best", "best_20m_w", "20m (W)")}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Totals</p>
                <div className="grid grid-cols-4 gap-2">
                  {renderField("totals", "total_distance_km", "Dist (km)")}
                  {renderField("totals", "total_time_minutes", "Time (min)")}
                  {renderField("totals", "total_calories", "Calories")}
                  {renderField("totals", "total_elevation_m", "Elev (m)")}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Score & Averages</p>
                <div className="grid grid-cols-4 gap-2">
                  {renderField("rider_score", "score", "Rider Score")}
                  {renderField("rider_score", "until_next_level", "Until Next Lv")}
                  {renderField("distributions", "avg_power_w", "Avg Power (W)")}
                  {renderField("distributions", "avg_heart_rate_bpm", "Avg HR (bpm)")}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Career</p>
                <div className="grid grid-cols-4 gap-2">
                  {renderField("root", "level", "Level")}
                  {renderField("career_progress", "this_ride_xp", "Ride XP")}
                  {renderField("career_progress", "xp_current", "XP Curr")}
                  {renderField("career_progress", "xp_target", "XP Target")}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Performance</p>
                <div className="grid grid-cols-3 gap-2">
                  {renderField("performance", "best_5s_w", "5s (W)")}
                  {renderField("performance", "best_1m_w", "1m (W)")}
                  {renderField("performance", "best_5m_w", "5m (W)")}
                  {renderField("performance", "best_20m_w", "20m (W)")}
                  {renderField("performance", "ftp_w", "FTP (W)")}
                  {renderField("performance", "racing_score", "Racing")}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Fitness</p>
                <div className="grid grid-cols-4 gap-2">
                  {renderField("fitness_trends", "weekly_this_ride_km", "Ride km")}
                  {renderField("fitness_trends", "weekly_progress_km", "Wk Prog")}
                  {renderField("fitness_trends", "weekly_goal_km", "Wk Goal")}
                  {renderField("fitness_trends", "streak_weeks", "Streak")}
                  {renderField("fitness_trends", "total_distance_km", "Dist km")}
                  {renderField("fitness_trends", "total_elevation_m", "Elev m")}
                  {renderField("fitness_trends", "total_energy_kj", "Energy kJ")}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Training</p>
                <div className="grid grid-cols-3 gap-2">
                  {renderField("training_status", "training_score", "Score")}
                  {renderField("training_status", "training_score_delta", "Delta")}
                  {renderField("training_status", "freshness_state", "Freshness", "text")}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

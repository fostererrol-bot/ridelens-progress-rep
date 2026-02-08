import { ChevronLeft, ChevronRight, Bike, Trophy, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetadataSourceBadge } from "@/components/MetadataSourceBadge";
import { format } from "date-fns";
import type { FullSnapshot } from "@/types/zwift";

interface SnapshotSelectorProps {
  snapshots: FullSnapshot[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export function SnapshotSelector({ snapshots, currentIndex, onIndexChange }: SnapshotSelectorProps) {
  if (snapshots.length <= 1) return null;

  const current = snapshots[currentIndex];
  const isRideMenu = current.snapshot.screen_type === "ride_menu";
  const displayDate = current.snapshot.captured_at || current.snapshot.created_at;
  const metadataJson = current.snapshot.metadata_json as any;
  const metadataSource: "exif" | "file" | "unknown" = metadataJson?.metadata_source || "unknown";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card/50 px-3 py-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0"
        disabled={currentIndex >= snapshots.length - 1}
        onClick={() => onIndexChange(currentIndex + 1)}
        aria-label="Previous snapshot"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex flex-1 items-center gap-2 min-w-0 flex-wrap justify-center">
        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
          {currentIndex + 1} / {snapshots.length}
        </span>
        <span className="text-xs text-muted-foreground">•</span>
        <span className="text-xs text-foreground whitespace-nowrap">
          {format(new Date(displayDate), "dd MMM yyyy, HH:mm")}
        </span>
        <Badge variant="secondary" className="text-[10px] gap-1 shrink-0">
          {isRideMenu ? <Bike className="w-3 h-3" /> : <Trophy className="w-3 h-3" />}
          {isRideMenu ? "Ride Menu" : "Progress Report"}
        </Badge>
        <MetadataSourceBadge source={metadataSource} />
        {current.snapshot.source === "seed" && (
          <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">Seed</span>
        )}
        {current.snapshot.image_url && (
          <a
            href={current.snapshot.image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            title="View original screenshot"
          >
            <Image className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0"
        disabled={currentIndex <= 0}
        onClick={() => onIndexChange(currentIndex - 1)}
        aria-label="Next snapshot"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

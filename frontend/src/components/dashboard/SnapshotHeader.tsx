import { SnapshotThumbnail } from "@/components/SnapshotThumbnail";
import { SnapshotSelector } from "@/components/SnapshotSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import type { FullSnapshot } from "@/types/zwift";

interface SnapshotHeaderProps {
  snapshots: FullSnapshot[];
  currentIndex: number;
  current: FullSnapshot;
  onIndexChange: (index: number) => void;
}

export function SnapshotHeader({ snapshots, currentIndex, current, onIndexChange }: SnapshotHeaderProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-3">
        <SnapshotThumbnail imageUrl={current.snapshot.image_url} fullWidth />
        <SnapshotSelector snapshots={snapshots} currentIndex={currentIndex} onIndexChange={onIndexChange} />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      <SnapshotThumbnail imageUrl={current.snapshot.image_url} />
      <div className="flex-1 min-w-0">
        <SnapshotSelector snapshots={snapshots} currentIndex={currentIndex} onIndexChange={onIndexChange} />
      </div>
    </div>
  );
}

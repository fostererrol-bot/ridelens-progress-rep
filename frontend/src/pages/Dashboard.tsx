import { useState } from "react";
import { Upload } from "lucide-react";
import { SnapshotHeader } from "@/components/dashboard/SnapshotHeader";
import { ProgressReportCards } from "@/components/dashboard/ProgressReportCards";
import { RideMenuDashboard } from "@/components/RideMenuDashboard";
import { ChangesSinceLastReport } from "@/components/ChangesSinceLastReport";
import { useAllSnapshots } from "@/hooks/useSnapshots";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data, isLoading } = useAllSnapshots();
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const snapshots = data || [];

  if (snapshots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <div className="rounded-full bg-primary/10 p-5 mb-5">
          <Upload className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No rides yet</h2>
        <p className="text-muted-foreground text-center max-w-sm mb-6">
          Import your ride screenshots to start tracking your progress, performance, and fitness trends.
        </p>
        <a
          href="/import"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Import Screenshots
        </a>
      </div>
    );
  }

  const idx = Math.min(selectedIndex, snapshots.length - 1);
  const current = snapshots[idx];

  const prev = snapshots.slice(idx + 1).find(
    (s) => s.snapshot.screen_type === current.snapshot.screen_type
  ) || null;

  const isRideMenu = current.snapshot.screen_type === "ride_menu";

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5">
        <h1 className="text-2xl font-bold mb-3">Dashboard</h1>
        <SnapshotHeader
          snapshots={snapshots}
          currentIndex={idx}
          current={current}
          onIndexChange={setSelectedIndex}
        />
      </motion.div>

      {isRideMenu && current.rideMenu ? (
        <RideMenuDashboard data={current.rideMenu} />
      ) : (
        <>
          <ProgressReportCards current={current} />
          <ChangesSinceLastReport latest={current} previous={prev} />
        </>
      )}
    </div>
  );
}

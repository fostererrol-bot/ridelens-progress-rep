import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FullSnapshot } from "@/types/zwift";

/** Sort key: prefer captured_at, fallback to created_at */
const sortColumn = "captured_at";

export function useLatestSnapshots(limit = 2) {
  return useQuery({
    queryKey: ["snapshots", "latest", limit],
    queryFn: async (): Promise<FullSnapshot[]> => {
      // Fetch ordering by captured_at with nulls last (fallback created_at)
      const { data: snapshots, error } = await supabase
        .from("snapshots")
        .select("*")
        .order(sortColumn, { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) throw error;
      if (!snapshots || snapshots.length === 0) return [];

      const ids = snapshots.map((s: any) => s.id);

      const [progressRes, perfRes, fitnessRes, trainingRes] = await Promise.all([
        supabase.from("progress_report_metrics").select("*").in("snapshot_id", ids),
        supabase.from("performance_metrics").select("*").in("snapshot_id", ids),
        supabase.from("fitness_trends").select("*").in("snapshot_id", ids),
        supabase.from("training_status").select("*").in("snapshot_id", ids),
      ]);

      return snapshots.map((s: any) => ({
        snapshot: s,
        progress: progressRes.data?.find((p: any) => p.snapshot_id === s.id) || null,
        performance: perfRes.data?.find((p: any) => p.snapshot_id === s.id) || null,
        fitness: fitnessRes.data?.find((f: any) => f.snapshot_id === s.id) || null,
        training: trainingRes.data?.find((t: any) => t.snapshot_id === s.id) || null,
      }));
    },
  });
}

export function useAllSnapshots() {
  return useQuery({
    queryKey: ["snapshots", "all"],
    queryFn: async (): Promise<FullSnapshot[]> => {
      const { data: snapshots, error } = await supabase
        .from("snapshots")
        .select("*")
        .order(sortColumn, { ascending: false, nullsFirst: false });

      if (error) throw error;
      if (!snapshots || snapshots.length === 0) return [];

      const ids = snapshots.map((s: any) => s.id);

      const [progressRes, perfRes, fitnessRes, trainingRes] = await Promise.all([
        supabase.from("progress_report_metrics").select("*").in("snapshot_id", ids),
        supabase.from("performance_metrics").select("*").in("snapshot_id", ids),
        supabase.from("fitness_trends").select("*").in("snapshot_id", ids),
        supabase.from("training_status").select("*").in("snapshot_id", ids),
      ]);

      return snapshots.map((s: any) => ({
        snapshot: s,
        progress: progressRes.data?.find((p: any) => p.snapshot_id === s.id) || null,
        performance: perfRes.data?.find((p: any) => p.snapshot_id === s.id) || null,
        fitness: fitnessRes.data?.find((f: any) => f.snapshot_id === s.id) || null,
        training: trainingRes.data?.find((t: any) => t.snapshot_id === s.id) || null,
      }));
    },
  });
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FullSnapshot } from "@/types/zwift";

/** Sort key: prefer captured_at, fallback to created_at */
const sortColumn = "captured_at";

/** Resolves a stored image_url to a usable URL.
 *  If it starts with "storage:<bucket>/<path>", generate a fresh signed URL.
 *  Otherwise, return as-is (legacy rows with full URLs still work temporarily).
 */
async function resolveImageUrl(imageUrl: string | null): Promise<string | null> {
  if (!imageUrl) return null;
  const STORAGE_PREFIX = "storage:";
  if (!imageUrl.startsWith(STORAGE_PREFIX)) return imageUrl; // legacy URL, return as-is

  const withoutPrefix = imageUrl.slice(STORAGE_PREFIX.length);
  const slashIdx = withoutPrefix.indexOf("/");
  if (slashIdx === -1) return null;

  const bucket = withoutPrefix.slice(0, slashIdx);
  const path = withoutPrefix.slice(slashIdx + 1);

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600); // 1-hour signed URL, fresh each fetch

  if (error || !data) return null;
  return data.signedUrl;
}

async function fetchFullSnapshots(limit?: number): Promise<FullSnapshot[]> {
  let query = supabase
    .from("snapshots")
    .select("*")
    .order(sortColumn, { ascending: false, nullsFirst: false });

  if (limit) query = query.limit(limit);

  const { data: snapshots, error } = await query;
  if (error) throw error;
  if (!snapshots || snapshots.length === 0) return [];

  const ids = snapshots.map((s: any) => s.id);

  const [progressRes, perfRes, fitnessRes, trainingRes, rideMenuRes, resolvedUrls] = await Promise.all([
    supabase.from("progress_report_metrics").select("*").in("snapshot_id", ids),
    supabase.from("performance_metrics").select("*").in("snapshot_id", ids),
    supabase.from("fitness_trends").select("*").in("snapshot_id", ids),
    supabase.from("training_status").select("*").in("snapshot_id", ids),
    supabase.from("ride_menu_metrics").select("*").in("snapshot_id", ids),
    Promise.all(snapshots.map((s: any) => resolveImageUrl(s.image_url))),
  ]);

  return snapshots.map((s: any, i: number) => ({
    snapshot: { ...s, image_url: resolvedUrls[i] },
    progress: progressRes.data?.find((p: any) => p.snapshot_id === s.id) || null,
    performance: perfRes.data?.find((p: any) => p.snapshot_id === s.id) || null,
    fitness: fitnessRes.data?.find((f: any) => f.snapshot_id === s.id) || null,
    training: trainingRes.data?.find((t: any) => t.snapshot_id === s.id) || null,
    rideMenu: rideMenuRes.data?.find((r: any) => r.snapshot_id === s.id) || null,
  }));
}

export function useLatestSnapshots(limit = 2) {
  return useQuery({
    queryKey: ["snapshots", "latest", limit],
    queryFn: () => fetchFullSnapshots(limit),
  });
}

export function useAllSnapshots() {
  return useQuery({
    queryKey: ["snapshots", "all"],
    queryFn: () => fetchFullSnapshots(),
  });
}

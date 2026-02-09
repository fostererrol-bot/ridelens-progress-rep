import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export function useSeedData() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function seed() {
      const { count } = await supabase
        .from("snapshots")
        .select("*", { count: "exact", head: true });

      if (count && count > 0) return;

      const { data: snap, error: snapErr } = await supabase
        .from("snapshots")
        .insert({
          user_id: user!.id,
          source: "seed" as string,
          screen_type: "progress_report",
          overall_confidence: 1.0,
          captured_at: new Date().toISOString(),
          metadata_json: {
            captured_at: null,
            timezone_offset_minutes: null,
            metadata_source: "unknown",
          } as any,
          parsed_data_json: ({
            screen_type: "progress_report",
            level: 61,
            career_progress: {
              this_ride_xp: 690, xp_current: 2234, xp_target: 8400,
              achievements_current: 27, achievements_target: 36,
              route_badges_current: 37, route_badges_target: 224,
              challenge_name: "Zwift Concept Z1",
              challenge_stage_current: 0, challenge_stage_target: 5,
              challenge_this_ride_km: 0, challenge_progress_km: 0, challenge_target_km: 550,
            },
            performance: {
              best_5s_w: 679, best_1m_w: 332, best_5m_w: 205, best_20m_w: 184,
              ftp_w: 210, racing_score: 130,
            },
            fitness_trends: {
              weekly_this_ride_km: 35, weekly_progress_km: 113, weekly_goal_km: 113,
              streak_weeks: 48, total_distance_km: 5400, total_elevation_m: 20125, total_energy_kj: 77230,
            },
            training_status: {
              training_score: 23.2, training_score_delta: 0.9, freshness_state: "FRESH",
            },
            image_metadata: {
              captured_at: null,
              timezone_offset_minutes: null,
              metadata_source: "unknown",
            },
            confidence: { overall: 1.0 },
          }) as any,
        })
        .select()
        .single();

      if (snapErr || !snap) return;

      await Promise.all([
        supabase.from("progress_report_metrics").insert({
          snapshot_id: snap.id, level: 61, this_ride_xp: 690, xp_current: 2234, xp_target: 8400,
          achievements_current: 27, achievements_target: 36,
          route_badges_current: 37, route_badges_target: 224,
          challenge_name: "Zwift Concept Z1", challenge_stage_current: 0, challenge_stage_target: 5,
          challenge_this_ride_km: 0, challenge_progress_km: 0, challenge_target_km: 550,
        }),
        supabase.from("performance_metrics").insert({
          snapshot_id: snap.id, best_5s_w: 679, best_1m_w: 332, best_5m_w: 205, best_20m_w: 184,
          ftp_w: 210, racing_score: 130,
        }),
        supabase.from("fitness_trends").insert({
          snapshot_id: snap.id, weekly_this_ride_km: 35, weekly_progress_km: 113, weekly_goal_km: 113,
          streak_weeks: 48, total_distance_km: 5400, total_elevation_m: 20125, total_energy_kj: 77230,
        }),
        supabase.from("training_status").insert({
          snapshot_id: snap.id, training_score: 23.2, training_score_delta: 0.9, freshness_state: "FRESH",
        }),
      ]);

      queryClient.invalidateQueries({ queryKey: ["snapshots"] });
    }
    seed();
  }, [queryClient, user]);
}

import type { ExtractionResult, ImageMetadata } from "@/types/zwift";

export type BulkItemStatus = "pending" | "hashing" | "uploading" | "extracting" | "ready" | "saving" | "saved" | "duplicate" | "error";

export interface BulkImportItem {
  id: string;
  file: File;
  preview: string;
  status: BulkItemStatus;
  error?: string;
  imageUrl?: string;
  imageHash?: string;
  metadata: ImageMetadata;
  extraction: ExtractionResult;
  rawJson?: any;
}

export const defaultMetadata: ImageMetadata = {
  captured_at: null,
  timezone_offset_minutes: null,
  metadata_source: "unknown",
};

export const defaultExtraction: ExtractionResult = {
  screen_type: "progress_report",
  level: 0,
  career_progress: {
    this_ride_xp: 0, xp_current: 0, xp_target: 0,
    achievements_current: 0, achievements_target: 0,
    route_badges_current: 0, route_badges_target: 0,
    challenge_name: "", challenge_stage_current: 0, challenge_stage_target: 0,
    challenge_this_ride_km: 0, challenge_progress_km: 0, challenge_target_km: 0,
  },
  performance: { best_5s_w: 0, best_1m_w: 0, best_5m_w: 0, best_20m_w: 0, ftp_w: 0, racing_score: 0 },
  fitness_trends: {
    weekly_this_ride_km: 0, weekly_progress_km: 0, weekly_goal_km: 0,
    streak_weeks: 0, total_distance_km: 0, total_elevation_m: 0, total_energy_kj: 0,
  },
  training_status: { training_score: 0, training_score_delta: 0, freshness_state: "" },
  image_metadata: defaultMetadata,
  confidence: { overall: 0 },
};

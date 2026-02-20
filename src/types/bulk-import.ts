import type { ExtractionResult, RideMenuExtractionResult, ImageMetadata } from "@/types/zwift";

export type BulkItemStatus = "pending" | "hashing" | "uploading" | "extracting" | "ready" | "saving" | "saved" | "duplicate" | "error";

export interface BulkImportItem {
  id: string;
  file: File;
  preview: string;
  status: BulkItemStatus;
  error?: string;
  imageUrl?: string;
  imageStoragePath?: string;
  imageHash?: string;
  metadata: ImageMetadata;
  extraction: ExtractionResult;
  rideMenuExtraction?: RideMenuExtractionResult;
  detectedScreenType?: string;
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

export const defaultRideMenuExtraction: RideMenuExtractionResult = {
  screen_type: "ride_menu",
  rider: { name: null, height_cm: null, weight_kg: null },
  this_ride: {
    distance_km: null, duration_minutes: null, calories: null, elevation_m: null,
    power_5s_w: null, power_1m_w: null, power_5m_w: null, power_20m_w: null,
  },
  your_best: { best_5s_w: null, best_1m_w: null, best_5m_w: null, best_20m_w: null },
  totals: { total_distance_km: null, total_time_minutes: null, total_calories: null, total_elevation_m: null },
  rider_score: { score: null, until_next_level: null },
  distributions: { avg_power_w: null, avg_heart_rate_bpm: null },
  image_metadata: defaultMetadata,
  confidence: { overall: 0 },
};

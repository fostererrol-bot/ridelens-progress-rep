export interface Snapshot {
  id: string;
  created_at: string;
  captured_at: string | null;
  timezone_offset_minutes: number | null;
  metadata_json: ImageMetadata | null;
  source: string;
  screen_type: string;
  image_url: string | null;
  image_hash: string | null;
  raw_extraction_json: any;
  parsed_data_json: any;
  overall_confidence: number;
}

export interface ImageMetadata {
  captured_at: string | null;
  timezone_offset_minutes: number | null;
  metadata_source: "exif" | "file" | "unknown";
  camera_make?: string;
  camera_model?: string;
}

export interface ProgressReportMetrics {
  id: string;
  snapshot_id: string;
  level: number;
  this_ride_xp: number;
  xp_current: number;
  xp_target: number;
  achievements_current: number;
  achievements_target: number;
  route_badges_current: number;
  route_badges_target: number;
  challenge_name: string;
  challenge_stage_current: number;
  challenge_stage_target: number;
  challenge_this_ride_km: number;
  challenge_progress_km: number;
  challenge_target_km: number;
}

export interface PerformanceMetrics {
  id: string;
  snapshot_id: string;
  best_5s_w: number;
  best_1m_w: number;
  best_5m_w: number;
  best_20m_w: number;
  ftp_w: number;
  racing_score: number;
}

export interface FitnessTrends {
  id: string;
  snapshot_id: string;
  weekly_this_ride_km: number;
  weekly_progress_km: number;
  weekly_goal_km: number;
  streak_weeks: number;
  total_distance_km: number;
  total_elevation_m: number;
  total_energy_kj: number;
}

export interface TrainingStatus {
  id: string;
  snapshot_id: string;
  training_score: number;
  training_score_delta: number;
  freshness_state: string;
}

export interface FullSnapshot {
  snapshot: Snapshot;
  progress: ProgressReportMetrics | null;
  performance: PerformanceMetrics | null;
  fitness: FitnessTrends | null;
  training: TrainingStatus | null;
}

export interface ExtractionResult {
  screen_type: string;
  level: number;
  career_progress: {
    this_ride_xp: number;
    xp_current: number;
    xp_target: number;
    achievements_current: number;
    achievements_target: number;
    route_badges_current: number;
    route_badges_target: number;
    challenge_name: string;
    challenge_stage_current: number;
    challenge_stage_target: number;
    challenge_this_ride_km: number;
    challenge_progress_km: number;
    challenge_target_km: number;
  };
  performance: {
    best_5s_w: number;
    best_1m_w: number;
    best_5m_w: number;
    best_20m_w: number;
    ftp_w: number;
    racing_score: number;
  };
  fitness_trends: {
    weekly_this_ride_km: number;
    weekly_progress_km: number;
    weekly_goal_km: number;
    streak_weeks: number;
    total_distance_km: number;
    total_elevation_m: number;
    total_energy_kj: number;
  };
  training_status: {
    training_score: number;
    training_score_delta: number;
    freshness_state: string;
  };
  image_metadata: ImageMetadata;
  confidence: {
    overall: number;
  };
}

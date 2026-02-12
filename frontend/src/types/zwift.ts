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

export interface RideMenuMetrics {
  id: string;
  snapshot_id: string;
  rider_name: string | null;
  rider_height_cm: number | null;
  rider_weight_kg: number | null;
  ride_distance_km: number;
  ride_duration_minutes: number;
  ride_calories: number;
  ride_elevation_m: number;
  total_distance_km: number;
  total_time_minutes: number;
  total_calories: number;
  total_elevation_m: number;
  power_5s_w: number;
  power_1m_w: number;
  power_5m_w: number;
  power_20m_w: number;
  best_5s_w: number;
  best_1m_w: number;
  best_5m_w: number;
  best_20m_w: number;
  rider_score: number;
  until_next_level: number;
  avg_power_w: number;
  avg_heart_rate_bpm: number;
}

export interface FullSnapshot {
  snapshot: Snapshot;
  progress: ProgressReportMetrics | null;
  performance: PerformanceMetrics | null;
  fitness: FitnessTrends | null;
  training: TrainingStatus | null;
  rideMenu: RideMenuMetrics | null;
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

export interface RideMenuExtractionResult {
  screen_type: "ride_menu";
  rider: {
    name: string | null;
    height_cm: number | null;
    weight_kg: number | null;
  };
  this_ride: {
    distance_km: number | null;
    duration_minutes: number | null;
    calories: number | null;
    elevation_m: number | null;
    power_5s_w: number | null;
    power_1m_w: number | null;
    power_5m_w: number | null;
    power_20m_w: number | null;
  };
  your_best: {
    best_5s_w: number | null;
    best_1m_w: number | null;
    best_5m_w: number | null;
    best_20m_w: number | null;
  };
  totals: {
    total_distance_km: number | null;
    total_time_minutes: number | null;
    total_calories: number | null;
    total_elevation_m: number | null;
  };
  rider_score: {
    score: number | null;
    until_next_level: number | null;
  };
  distributions: {
    avg_power_w: number | null;
    avg_heart_rate_bpm: number | null;
  };
  image_metadata: ImageMetadata;
  confidence: {
    overall: number;
  };
}

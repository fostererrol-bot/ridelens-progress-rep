
-- Create ride_menu_metrics table for Ride Menu / In-Ride Summary screen data
CREATE TABLE public.ride_menu_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  snapshot_id UUID NOT NULL UNIQUE,

  -- rider info
  rider_name TEXT,
  rider_height_cm INTEGER,
  rider_weight_kg INTEGER,

  -- this ride
  ride_distance_km NUMERIC DEFAULT 0,
  ride_duration_minutes NUMERIC DEFAULT 0,
  ride_calories INTEGER DEFAULT 0,
  ride_elevation_m INTEGER DEFAULT 0,

  -- totals
  total_distance_km NUMERIC DEFAULT 0,
  total_time_minutes NUMERIC DEFAULT 0,
  total_calories INTEGER DEFAULT 0,
  total_elevation_m INTEGER DEFAULT 0,

  -- power (this ride)
  power_5s_w INTEGER DEFAULT 0,
  power_1m_w INTEGER DEFAULT 0,
  power_5m_w INTEGER DEFAULT 0,
  power_20m_w INTEGER DEFAULT 0,

  -- power (best)
  best_5s_w INTEGER DEFAULT 0,
  best_1m_w INTEGER DEFAULT 0,
  best_5m_w INTEGER DEFAULT 0,
  best_20m_w INTEGER DEFAULT 0,

  -- rider score
  rider_score INTEGER DEFAULT 0,
  until_next_level INTEGER DEFAULT 0,

  -- distributions
  avg_power_w INTEGER DEFAULT 0,
  avg_heart_rate_bpm INTEGER DEFAULT 0,

  CONSTRAINT ride_menu_metrics_snapshot_id_fkey
    FOREIGN KEY (snapshot_id) REFERENCES public.snapshots(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.ride_menu_metrics ENABLE ROW LEVEL SECURITY;

-- RLS policies (matching existing pattern - public access)
CREATE POLICY "Anyone can read ride_menu_metrics"
  ON public.ride_menu_metrics FOR SELECT USING (true);

CREATE POLICY "Anyone can insert ride_menu_metrics"
  ON public.ride_menu_metrics FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update ride_menu_metrics"
  ON public.ride_menu_metrics FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete ride_menu_metrics"
  ON public.ride_menu_metrics FOR DELETE USING (true);

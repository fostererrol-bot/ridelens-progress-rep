
-- Storage bucket for screenshot uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots', 'screenshots', true);

-- Storage policies
CREATE POLICY "Anyone can upload screenshots" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'screenshots');
CREATE POLICY "Anyone can view screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'screenshots');
CREATE POLICY "Anyone can delete screenshots" ON storage.objects FOR DELETE USING (bucket_id = 'screenshots');

-- Snapshots table
CREATE TABLE public.snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'upload',
  screen_type TEXT NOT NULL DEFAULT 'progress_report',
  image_url TEXT,
  image_hash TEXT,
  raw_extraction_json JSONB,
  parsed_data_json JSONB,
  overall_confidence NUMERIC(3,2) DEFAULT 0
);

CREATE UNIQUE INDEX idx_snapshots_image_hash ON public.snapshots(image_hash) WHERE image_hash IS NOT NULL;
CREATE INDEX idx_snapshots_created_at ON public.snapshots(created_at);

ALTER TABLE public.snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read snapshots" ON public.snapshots FOR SELECT USING (true);
CREATE POLICY "Anyone can insert snapshots" ON public.snapshots FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update snapshots" ON public.snapshots FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete snapshots" ON public.snapshots FOR DELETE USING (true);

-- Progress report metrics
CREATE TABLE public.progress_report_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id UUID REFERENCES public.snapshots(id) ON DELETE CASCADE UNIQUE NOT NULL,
  level INT DEFAULT 0,
  this_ride_xp INT DEFAULT 0,
  xp_current INT DEFAULT 0,
  xp_target INT DEFAULT 0,
  achievements_current INT DEFAULT 0,
  achievements_target INT DEFAULT 0,
  route_badges_current INT DEFAULT 0,
  route_badges_target INT DEFAULT 0,
  challenge_name TEXT DEFAULT '',
  challenge_stage_current INT DEFAULT 0,
  challenge_stage_target INT DEFAULT 0,
  challenge_this_ride_km NUMERIC DEFAULT 0,
  challenge_progress_km NUMERIC DEFAULT 0,
  challenge_target_km NUMERIC DEFAULT 0
);

ALTER TABLE public.progress_report_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read progress_report_metrics" ON public.progress_report_metrics FOR SELECT USING (true);
CREATE POLICY "Anyone can insert progress_report_metrics" ON public.progress_report_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update progress_report_metrics" ON public.progress_report_metrics FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete progress_report_metrics" ON public.progress_report_metrics FOR DELETE USING (true);

-- Performance metrics
CREATE TABLE public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id UUID REFERENCES public.snapshots(id) ON DELETE CASCADE UNIQUE NOT NULL,
  best_5s_w INT DEFAULT 0,
  best_1m_w INT DEFAULT 0,
  best_5m_w INT DEFAULT 0,
  best_20m_w INT DEFAULT 0,
  ftp_w INT DEFAULT 0,
  racing_score INT DEFAULT 0
);

ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read performance_metrics" ON public.performance_metrics FOR SELECT USING (true);
CREATE POLICY "Anyone can insert performance_metrics" ON public.performance_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update performance_metrics" ON public.performance_metrics FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete performance_metrics" ON public.performance_metrics FOR DELETE USING (true);

-- Fitness trends
CREATE TABLE public.fitness_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id UUID REFERENCES public.snapshots(id) ON DELETE CASCADE UNIQUE NOT NULL,
  weekly_this_ride_km NUMERIC DEFAULT 0,
  weekly_progress_km NUMERIC DEFAULT 0,
  weekly_goal_km NUMERIC DEFAULT 0,
  streak_weeks INT DEFAULT 0,
  total_distance_km NUMERIC DEFAULT 0,
  total_elevation_m NUMERIC DEFAULT 0,
  total_energy_kj NUMERIC DEFAULT 0
);

ALTER TABLE public.fitness_trends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read fitness_trends" ON public.fitness_trends FOR SELECT USING (true);
CREATE POLICY "Anyone can insert fitness_trends" ON public.fitness_trends FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update fitness_trends" ON public.fitness_trends FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete fitness_trends" ON public.fitness_trends FOR DELETE USING (true);

-- Training status
CREATE TABLE public.training_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id UUID REFERENCES public.snapshots(id) ON DELETE CASCADE UNIQUE NOT NULL,
  training_score NUMERIC DEFAULT 0,
  training_score_delta NUMERIC DEFAULT 0,
  freshness_state TEXT DEFAULT ''
);

ALTER TABLE public.training_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read training_status" ON public.training_status FOR SELECT USING (true);
CREATE POLICY "Anyone can insert training_status" ON public.training_status FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update training_status" ON public.training_status FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete training_status" ON public.training_status FOR DELETE USING (true);

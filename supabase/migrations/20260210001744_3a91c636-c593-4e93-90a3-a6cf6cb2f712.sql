
-- Drop all existing restrictive policies on snapshots
DROP POLICY IF EXISTS "Users read own snapshots" ON public.snapshots;
DROP POLICY IF EXISTS "Users insert own snapshots" ON public.snapshots;
DROP POLICY IF EXISTS "Users update own snapshots" ON public.snapshots;
DROP POLICY IF EXISTS "Users delete own snapshots" ON public.snapshots;

-- Drop all existing restrictive policies on fitness_trends
DROP POLICY IF EXISTS "Users read own fitness_trends" ON public.fitness_trends;
DROP POLICY IF EXISTS "Users insert own fitness_trends" ON public.fitness_trends;
DROP POLICY IF EXISTS "Users update own fitness_trends" ON public.fitness_trends;
DROP POLICY IF EXISTS "Users delete own fitness_trends" ON public.fitness_trends;

-- Drop all existing restrictive policies on performance_metrics
DROP POLICY IF EXISTS "Users read own performance_metrics" ON public.performance_metrics;
DROP POLICY IF EXISTS "Users insert own performance_metrics" ON public.performance_metrics;
DROP POLICY IF EXISTS "Users update own performance_metrics" ON public.performance_metrics;
DROP POLICY IF EXISTS "Users delete own performance_metrics" ON public.performance_metrics;

-- Drop all existing restrictive policies on progress_report_metrics
DROP POLICY IF EXISTS "Users read own progress_report_metrics" ON public.progress_report_metrics;
DROP POLICY IF EXISTS "Users insert own progress_report_metrics" ON public.progress_report_metrics;
DROP POLICY IF EXISTS "Users update own progress_report_metrics" ON public.progress_report_metrics;
DROP POLICY IF EXISTS "Users delete own progress_report_metrics" ON public.progress_report_metrics;

-- Drop all existing restrictive policies on ride_menu_metrics
DROP POLICY IF EXISTS "Users read own ride_menu_metrics" ON public.ride_menu_metrics;
DROP POLICY IF EXISTS "Users insert own ride_menu_metrics" ON public.ride_menu_metrics;
DROP POLICY IF EXISTS "Users update own ride_menu_metrics" ON public.ride_menu_metrics;
DROP POLICY IF EXISTS "Users delete own ride_menu_metrics" ON public.ride_menu_metrics;

-- Drop all existing restrictive policies on training_status
DROP POLICY IF EXISTS "Users read own training_status" ON public.training_status;
DROP POLICY IF EXISTS "Users insert own training_status" ON public.training_status;
DROP POLICY IF EXISTS "Users update own training_status" ON public.training_status;
DROP POLICY IF EXISTS "Users delete own training_status" ON public.training_status;

-- Create permissive public access policies for all tables
CREATE POLICY "Public access" ON public.snapshots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.fitness_trends FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.performance_metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.progress_report_metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.ride_menu_metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.training_status FOR ALL USING (true) WITH CHECK (true);

-- Add public storage policy for uploads (anon can upload/delete)
CREATE POLICY "Public upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'screenshots');
CREATE POLICY "Public delete" ON storage.objects FOR DELETE USING (bucket_id = 'screenshots');

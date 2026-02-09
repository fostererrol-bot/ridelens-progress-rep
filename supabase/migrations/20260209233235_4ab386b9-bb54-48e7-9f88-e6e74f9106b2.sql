
-- 1. Add user_id to snapshots (parent table; child tables inherit ownership via snapshot_id FK)
ALTER TABLE public.snapshots ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Drop ALL existing permissive policies on all 6 tables
DROP POLICY IF EXISTS "Anyone can read snapshots" ON public.snapshots;
DROP POLICY IF EXISTS "Anyone can insert snapshots" ON public.snapshots;
DROP POLICY IF EXISTS "Anyone can update snapshots" ON public.snapshots;
DROP POLICY IF EXISTS "Anyone can delete snapshots" ON public.snapshots;

DROP POLICY IF EXISTS "Anyone can read fitness_trends" ON public.fitness_trends;
DROP POLICY IF EXISTS "Anyone can insert fitness_trends" ON public.fitness_trends;
DROP POLICY IF EXISTS "Anyone can update fitness_trends" ON public.fitness_trends;
DROP POLICY IF EXISTS "Anyone can delete fitness_trends" ON public.fitness_trends;

DROP POLICY IF EXISTS "Anyone can read performance_metrics" ON public.performance_metrics;
DROP POLICY IF EXISTS "Anyone can insert performance_metrics" ON public.performance_metrics;
DROP POLICY IF EXISTS "Anyone can update performance_metrics" ON public.performance_metrics;
DROP POLICY IF EXISTS "Anyone can delete performance_metrics" ON public.performance_metrics;

DROP POLICY IF EXISTS "Anyone can read progress_report_metrics" ON public.progress_report_metrics;
DROP POLICY IF EXISTS "Anyone can insert progress_report_metrics" ON public.progress_report_metrics;
DROP POLICY IF EXISTS "Anyone can update progress_report_metrics" ON public.progress_report_metrics;
DROP POLICY IF EXISTS "Anyone can delete progress_report_metrics" ON public.progress_report_metrics;

DROP POLICY IF EXISTS "Anyone can read ride_menu_metrics" ON public.ride_menu_metrics;
DROP POLICY IF EXISTS "Anyone can insert ride_menu_metrics" ON public.ride_menu_metrics;
DROP POLICY IF EXISTS "Anyone can update ride_menu_metrics" ON public.ride_menu_metrics;
DROP POLICY IF EXISTS "Anyone can delete ride_menu_metrics" ON public.ride_menu_metrics;

DROP POLICY IF EXISTS "Anyone can read training_status" ON public.training_status;
DROP POLICY IF EXISTS "Anyone can insert training_status" ON public.training_status;
DROP POLICY IF EXISTS "Anyone can update training_status" ON public.training_status;
DROP POLICY IF EXISTS "Anyone can delete training_status" ON public.training_status;

-- 3. Helper function: check if user owns a snapshot
CREATE OR REPLACE FUNCTION public.owns_snapshot(_snapshot_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.snapshots
    WHERE id = _snapshot_id AND user_id = auth.uid()
  );
$$;

-- 4. User-scoped RLS policies for snapshots
CREATE POLICY "Users read own snapshots" ON public.snapshots FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own snapshots" ON public.snapshots FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own snapshots" ON public.snapshots FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own snapshots" ON public.snapshots FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 5. User-scoped RLS for child tables (via snapshot ownership)
CREATE POLICY "Users read own fitness_trends" ON public.fitness_trends FOR SELECT TO authenticated USING (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users insert own fitness_trends" ON public.fitness_trends FOR INSERT TO authenticated WITH CHECK (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users update own fitness_trends" ON public.fitness_trends FOR UPDATE TO authenticated USING (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users delete own fitness_trends" ON public.fitness_trends FOR DELETE TO authenticated USING (public.owns_snapshot(snapshot_id));

CREATE POLICY "Users read own performance_metrics" ON public.performance_metrics FOR SELECT TO authenticated USING (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users insert own performance_metrics" ON public.performance_metrics FOR INSERT TO authenticated WITH CHECK (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users update own performance_metrics" ON public.performance_metrics FOR UPDATE TO authenticated USING (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users delete own performance_metrics" ON public.performance_metrics FOR DELETE TO authenticated USING (public.owns_snapshot(snapshot_id));

CREATE POLICY "Users read own progress_report_metrics" ON public.progress_report_metrics FOR SELECT TO authenticated USING (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users insert own progress_report_metrics" ON public.progress_report_metrics FOR INSERT TO authenticated WITH CHECK (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users update own progress_report_metrics" ON public.progress_report_metrics FOR UPDATE TO authenticated USING (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users delete own progress_report_metrics" ON public.progress_report_metrics FOR DELETE TO authenticated USING (public.owns_snapshot(snapshot_id));

CREATE POLICY "Users read own ride_menu_metrics" ON public.ride_menu_metrics FOR SELECT TO authenticated USING (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users insert own ride_menu_metrics" ON public.ride_menu_metrics FOR INSERT TO authenticated WITH CHECK (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users update own ride_menu_metrics" ON public.ride_menu_metrics FOR UPDATE TO authenticated USING (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users delete own ride_menu_metrics" ON public.ride_menu_metrics FOR DELETE TO authenticated USING (public.owns_snapshot(snapshot_id));

CREATE POLICY "Users read own training_status" ON public.training_status FOR SELECT TO authenticated USING (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users insert own training_status" ON public.training_status FOR INSERT TO authenticated WITH CHECK (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users update own training_status" ON public.training_status FOR UPDATE TO authenticated USING (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users delete own training_status" ON public.training_status FOR DELETE TO authenticated USING (public.owns_snapshot(snapshot_id));

-- 6. Secure storage bucket
UPDATE storage.buckets SET public = false WHERE id = 'screenshots';

-- Drop existing permissive storage policies
DROP POLICY IF EXISTS "Anyone can upload screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update screenshots" ON storage.objects;

-- User-scoped storage policies (files stored under user_id/ prefix)
CREATE POLICY "Users upload own screenshots" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users view own screenshots" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own screenshots" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own screenshots" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

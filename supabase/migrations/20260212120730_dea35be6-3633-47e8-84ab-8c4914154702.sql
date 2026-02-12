
-- 1. Fix snapshots: make user_id NOT NULL with default
ALTER TABLE public.snapshots ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.snapshots ALTER COLUMN user_id SET NOT NULL;

-- 2. Drop all permissive "Public access" policies
DROP POLICY IF EXISTS "Public access" ON public.snapshots;
DROP POLICY IF EXISTS "Public access" ON public.fitness_trends;
DROP POLICY IF EXISTS "Public access" ON public.performance_metrics;
DROP POLICY IF EXISTS "Public access" ON public.progress_report_metrics;
DROP POLICY IF EXISTS "Public access" ON public.ride_menu_metrics;
DROP POLICY IF EXISTS "Public access" ON public.training_status;

-- 3. Owner-scoped policies for snapshots
CREATE POLICY "Users read own snapshots" ON public.snapshots FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own snapshots" ON public.snapshots FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own snapshots" ON public.snapshots FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own snapshots" ON public.snapshots FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. Child table policies using owns_snapshot function
CREATE POLICY "Users read own fitness_trends" ON public.fitness_trends FOR SELECT TO authenticated USING (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users insert own fitness_trends" ON public.fitness_trends FOR INSERT TO authenticated WITH CHECK (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users update own fitness_trends" ON public.fitness_trends FOR UPDATE TO authenticated USING (public.owns_snapshot(snapshot_id)) WITH CHECK (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users delete own fitness_trends" ON public.fitness_trends FOR DELETE TO authenticated USING (public.owns_snapshot(snapshot_id));

CREATE POLICY "Users read own performance_metrics" ON public.performance_metrics FOR SELECT TO authenticated USING (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users insert own performance_metrics" ON public.performance_metrics FOR INSERT TO authenticated WITH CHECK (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users update own performance_metrics" ON public.performance_metrics FOR UPDATE TO authenticated USING (public.owns_snapshot(snapshot_id)) WITH CHECK (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users delete own performance_metrics" ON public.performance_metrics FOR DELETE TO authenticated USING (public.owns_snapshot(snapshot_id));

CREATE POLICY "Users read own progress_report_metrics" ON public.progress_report_metrics FOR SELECT TO authenticated USING (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users insert own progress_report_metrics" ON public.progress_report_metrics FOR INSERT TO authenticated WITH CHECK (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users update own progress_report_metrics" ON public.progress_report_metrics FOR UPDATE TO authenticated USING (public.owns_snapshot(snapshot_id)) WITH CHECK (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users delete own progress_report_metrics" ON public.progress_report_metrics FOR DELETE TO authenticated USING (public.owns_snapshot(snapshot_id));

CREATE POLICY "Users read own ride_menu_metrics" ON public.ride_menu_metrics FOR SELECT TO authenticated USING (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users insert own ride_menu_metrics" ON public.ride_menu_metrics FOR INSERT TO authenticated WITH CHECK (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users update own ride_menu_metrics" ON public.ride_menu_metrics FOR UPDATE TO authenticated USING (public.owns_snapshot(snapshot_id)) WITH CHECK (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users delete own ride_menu_metrics" ON public.ride_menu_metrics FOR DELETE TO authenticated USING (public.owns_snapshot(snapshot_id));

CREATE POLICY "Users read own training_status" ON public.training_status FOR SELECT TO authenticated USING (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users insert own training_status" ON public.training_status FOR INSERT TO authenticated WITH CHECK (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users update own training_status" ON public.training_status FOR UPDATE TO authenticated USING (public.owns_snapshot(snapshot_id)) WITH CHECK (public.owns_snapshot(snapshot_id));
CREATE POLICY "Users delete own training_status" ON public.training_status FOR DELETE TO authenticated USING (public.owns_snapshot(snapshot_id));

-- 5. Secure storage bucket
UPDATE storage.buckets SET public = false WHERE id = 'screenshots';

DROP POLICY IF EXISTS "Anyone can upload screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Public update screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Public read screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Public upload" ON storage.objects;
DROP POLICY IF EXISTS "Public delete" ON storage.objects;

CREATE POLICY "Users upload to own folder" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'screenshots' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users read own screenshots" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'screenshots' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own screenshots" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'screenshots' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own screenshots" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'screenshots' AND (storage.foldername(name))[1] = auth.uid()::text);

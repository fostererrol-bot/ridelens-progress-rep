
-- Drop old user-scoped storage policies
DROP POLICY IF EXISTS "Users upload own screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users view own screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users update own screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own screenshots" ON storage.objects;

-- Add public SELECT policy so uploaded images are accessible
CREATE POLICY "Public read screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'screenshots');

-- Add public UPDATE policy
CREATE POLICY "Public update screenshots" ON storage.objects FOR UPDATE USING (bucket_id = 'screenshots');

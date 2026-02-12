CREATE POLICY "Anyone can update screenshots"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'screenshots')
WITH CHECK (bucket_id = 'screenshots');

-- Add metadata columns to snapshots table
ALTER TABLE public.snapshots 
  ADD COLUMN captured_at TIMESTAMP WITH TIME ZONE NULL,
  ADD COLUMN timezone_offset_minutes INTEGER NULL,
  ADD COLUMN metadata_json JSONB NULL;

-- Create index on captured_at for sorting
CREATE INDEX idx_snapshots_captured_at ON public.snapshots (captured_at DESC NULLS LAST);

-- Backfill existing rows: set captured_at = created_at for existing snapshots
UPDATE public.snapshots SET captured_at = created_at WHERE captured_at IS NULL;

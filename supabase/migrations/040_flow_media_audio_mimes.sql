-- ============================================================
-- 040_flow_media_audio_mimes.sql
--
-- Updates the `flow-media` Supabase Storage bucket's `allowed_mime_types`
-- to include audio formats (audio/mpeg, audio/ogg, audio/aac, audio/mp4,
-- audio/amr, audio/wav, audio/webm).
--
-- Fixes issue where uploading an MP3 or audio file in the Flow Builder's
-- `send_media` node failed with "mime type audio/mpeg is not supported".
--
-- Idempotent — safe to re-run.
-- ============================================================

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  -- Images
  'image/png', 'image/jpeg', 'image/webp',
  -- Videos
  'video/mp4', 'video/3gpp',
  -- Documents
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  -- Audio formats
  'audio/mpeg',
  'audio/ogg',
  'audio/aac',
  'audio/mp4',
  'audio/amr',
  'audio/wav',
  'audio/x-wav',
  'audio/webm'
]
WHERE id = 'flow-media';

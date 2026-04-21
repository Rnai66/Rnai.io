-- API Keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
  id           UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID         REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name         TEXT         NOT NULL,
  key_hash     TEXT         NOT NULL UNIQUE,
  key_prefix   TEXT         NOT NULL,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  is_active    BOOLEAN      DEFAULT TRUE
);

-- Row Level Security
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select own keys"
  ON public.api_keys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "insert own keys"
  ON public.api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update own keys"
  ON public.api_keys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "delete own keys"
  ON public.api_keys FOR DELETE
  USING (auth.uid() = user_id);

import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function validateApiKey(key: string): Promise<string | null> {
  if (!key || !key.startsWith("rnai_sk_")) return null;

  const keyHash = createHash("sha256").update(key).digest("hex");
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("api_keys")
    .select("id")
    .eq("key_hash", keyHash)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;

  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return data.id as string;
}

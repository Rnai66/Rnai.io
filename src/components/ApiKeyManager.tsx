"use client";
import { useEffect, useState } from "react";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
}

export default function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    const res = await fetch("/api/keys");
    const data = await res.json();
    setKeys(data.keys ?? []);
  };

  const createKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setLoading(true);

    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName.trim() }),
    });
    const data = await res.json();

    if (res.ok) {
      setCreatedKey(data.key);
      setNewKeyName("");
      fetchKeys();
    }
    setLoading(false);
  };

  const revokeKey = async (id: string) => {
    if (!confirm("Revoke this key? It cannot be undone.")) return;
    await fetch(`/api/keys/${id}`, { method: "DELETE" });
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const copyKey = () => {
    if (!createdKey) return;
    navigator.clipboard.writeText(createdKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* New key created banner */}
      {createdKey && (
        <div className="p-4 rounded-xl bg-green-900/20 border border-green-800/40">
          <p className="text-sm text-green-400 font-medium mb-2">
            ✓ API key created — copy it now. It will not be shown again.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono bg-[#141210] px-3 py-2 rounded-lg text-green-300 overflow-x-auto">
              {createdKey}
            </code>
            <button
              onClick={copyKey}
              className="px-3 py-2 text-xs bg-green-800/40 hover:bg-green-800/60 text-green-300 rounded-lg transition-colors whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <button
            onClick={() => setCreatedKey(null)}
            className="mt-2 text-xs text-green-700 hover:text-green-500 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Create key form */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Create API Key</h2>
        <form onSubmit={createKey} className="flex gap-3">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g. Muse Style Studio 3)"
            className="flex-1 px-4 py-2.5 bg-[#1e1b18] border border-[#2a2520] rounded-lg text-[#f5f0eb] text-sm focus:outline-none focus:border-[#D77757]/60 placeholder-[#4a3a2a]"
          />
          <button
            type="submit"
            disabled={loading || !newKeyName.trim()}
            className="px-5 py-2.5 bg-[#D77757] text-white rounded-lg font-medium text-sm hover:bg-[#c0664a] disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {loading ? "Creating..." : "Create Key"}
          </button>
        </form>
      </div>

      {/* Keys list */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Your API Keys
          <span className="ml-2 text-sm font-normal text-[#6a5a4a]">({keys.length})</span>
        </h2>

        {keys.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-[#2a2520] text-[#4a3a2a] text-sm">
            No keys yet. Create your first key above.
          </div>
        ) : (
          <div className="space-y-3">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between p-4 rounded-xl bg-[#1e1b18] border border-[#2a2520]"
              >
                <div>
                  <p className="font-medium text-sm text-[#f5f0eb]">{key.name}</p>
                  <code className="text-xs text-[#6a5a4a] font-mono">{key.key_prefix}</code>
                  <p className="text-xs text-[#4a3a2a] mt-1">
                    Created {new Date(key.created_at).toLocaleDateString()}
                    {key.last_used_at && (
                      <> · Last used {new Date(key.last_used_at).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => revokeKey(key.id)}
                  className="text-xs text-[#6a5a4a] hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-900/20"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

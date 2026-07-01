"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase/client";

interface ApiKey {
  id: string;
  name: string;
  createdAt: unknown;
  lastUsedAt: unknown;
  isActive: boolean;
}

// Firestore Timestamps serialize to { _seconds } / { seconds }; also handle ISO/number.
function fmtDate(v: unknown): string {
  if (!v) return "—";
  let d: Date;
  if (typeof v === "object" && v !== null) {
    const secs = (v as any)._seconds ?? (v as any).seconds;
    d = secs != null ? new Date(secs * 1000) : new Date(NaN);
  } else {
    d = new Date(v as string | number);
  }
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

export default function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/keys");
      const data = await res.json();
      if (res.ok) {
        setKeys(data.keys);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });
      const data = await res.json();
      if (res.ok) {
        setCreatedKey(data.key);
        setNewKeyName("");
        fetchKeys();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key? This cannot be undone.")) return;
    try {
      await fetch(`/api/keys/${id}`, { method: "DELETE" });
      fetchKeys();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-outfit font-bold text-white mb-2">API Keys</h2>
        <p className="text-sm text-gray-400">Generate API keys to authenticate your API requests.</p>
      </div>

      {createdKey && (
        <div className="mb-8 p-6 bg-[#D77757]/10 border border-[#D77757]/30 rounded-2xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#D77757]"></div>
          <h3 className="text-[#D77757] font-bold mb-2">Save your new API key!</h3>
          <p className="text-sm text-gray-300 mb-4">Please copy this key and save it somewhere safe. You won't be able to see it again.</p>
          <div className="flex gap-2">
            <code className="flex-1 bg-black/50 border border-white/10 p-3 rounded-lg text-sm text-green-400 break-all">
              {createdKey}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(createdKey);
                alert("Copied to clipboard!");
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Copy
            </button>
          </div>
          <button 
            onClick={() => setCreatedKey(null)}
            className="mt-4 text-xs text-gray-400 hover:text-white"
          >
            I have saved it
          </button>
        </div>
      )}

      <form onSubmit={createKey} className="flex gap-3 mb-8">
        <input
          type="text"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="e.g. Production Server"
          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 focus:border-[#D77757]/50 transition-all text-sm"
        />
        <button
          type="submit"
          disabled={!newKeyName.trim()}
          className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
        >
          Create Key
        </button>
      </form>

      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="w-5 h-5 border-2 border-[#D77757] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : keys.length === 0 ? (
        <div className="text-center py-12 bg-black/20 rounded-2xl border border-white/5 border-dashed">
          <p className="text-sm text-gray-400">You don't have any API keys yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/30">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Name / ID</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Created</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Last Used</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {keys.map((key) => (
                <tr key={key.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white mb-1">{key.name}</div>
                    <div className="text-xs font-mono text-gray-500">{key.id.substring(0, 12)}...</div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 hidden sm:table-cell">
                    {fmtDate(key.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-gray-400 hidden md:table-cell">
                    {key.lastUsedAt ? fmtDate(key.lastUsedAt) : "Never"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteKey(key.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import ApiKeyManager from "@/components/ApiKeyManager";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-[#6a5a4a] mt-1">{user.email}</p>
        </div>

        {/* Usage summary */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Plan", value: "Free" },
            { label: "Requests / mo", value: "1,000" },
            { label: "Models", value: "3" },
          ].map((s) => (
            <div
              key={s.label}
              className="p-4 rounded-xl bg-[#1e1b18] border border-[#2a2520] text-center"
            >
              <p className="text-xl font-bold text-[#D77757]">{s.value}</p>
              <p className="text-xs text-[#6a5a4a] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <ApiKeyManager />
      </main>
    </div>
  );
}

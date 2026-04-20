import { getAllLktiTeams } from "@/app/actions/admin-actions";
import { LktiClientTable } from "./lkti-client-table";

export default async function LktiAdminPage() {
  const result = await getAllLktiTeams();
  const data = result.success ? result.data : [];

  return (
    <div className="p-8 space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-purple-400/60 font-mono text-xs uppercase tracking-widest font-bold">
           <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></div>
           Research Competition Management
        </div>
        <h1 className="text-4xl font-headline font-black text-white tracking-tight">
          Tim LKTI
        </h1>
        <p className="text-[#cbead1] opacity-60 max-w-2xl font-['Space_Grotesk'] text-sm">
          Review abstrak, verifikasi pembayaran, dan pantau pengumpulan Full Paper untuk tim LKTI DCF 2026.
        </p>
      </header>

      <LktiClientTable initialData={data || []} />
    </div>
  );
}

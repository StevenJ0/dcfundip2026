import { getAllOlimpiadeParticipants } from "@/app/actions/admin-actions";
import { OlimpiadeClientTable } from "./olimpiade-client-table";

export default async function OlimpiadeAdminPage() {
  const result = await getAllOlimpiadeParticipants();
  const data = result.success ? result.data : [];

  return (
    <div className="p-8 space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-yellow-400/60 font-mono text-xs uppercase tracking-widest font-bold">
           <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div>
           Database Management
        </div>
        <h1 className="text-4xl font-headline font-black text-white tracking-tight">
          Peserta Olimpiade
        </h1>
        <p className="text-[#cbead1] opacity-60 max-w-2xl font-['Space_Grotesk'] text-sm">
          Verifikasi pembayaran dan dokumen persyaratan untuk peserta Olimpiade Kimia DCF 2026.
        </p>
      </header>

      <OlimpiadeClientTable initialData={data || []} />
    </div>
  );
}

import { getAllUsers } from "@/app/actions/admin-actions";
import { createClient } from "@/utils/supabase/server";
import { UserClientTable } from "./user-client-table";

export default async function UserManagementPage() {
  const result = await getAllUsers();
  const data = result.success ? result.data : [];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="p-8 space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-blue-400/60 font-mono text-xs uppercase tracking-widest font-bold">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
           System Access Control
        </div>
        <h1 className="text-4xl font-headline font-black text-white tracking-tight">
          User Management
        </h1>
        <p className="text-[#cbead1] opacity-60 max-w-2xl font-['Space_Grotesk'] text-sm">
          Administrasi hak akses pengguna. Anda dapat memberikan atau mencabut akses admin untuk pengguna yang terdaftar.
        </p>
      </header>

      <UserClientTable initialData={data || []} currentUser={user} />
    </div>
  );
}

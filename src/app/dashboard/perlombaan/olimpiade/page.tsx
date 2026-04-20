import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { OlimpiadeFormView } from "@/components/views/dashboard/olimpiade-form-view";
import { OlimpiadeDetailView } from "@/components/views/dashboard/olimpiade-detail-view";

export default async function OlimpiadePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: record } = await supabase
    .from("olympiad_participants")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="w-full px-8 py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-headline font-bold text-primary tracking-tight mb-2">
          {record ? "Detail Pendaftaran Olimpiade" : "Pendaftaran Olimpiade"}
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          {record 
            ? "Berikut adalah detail pendaftaran Anda untuk Olimpiade Kimia DCF 2026." 
            : "Lengkapi form pendaftaran berikut untuk mengikuti Olimpiade Kimia DCF 2026."}
        </p>
      </header>
      
      {record ? (
        <OlimpiadeDetailView user={user} data={record} />
      ) : (
        <OlimpiadeFormView user={user} />
      )}
    </div>
  );
}

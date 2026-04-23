import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LktiFormView } from "@/components/views/dashboard/lkti-form-view";
import { LktiDetailView } from "@/components/views/dashboard/lkti-detail-view";

export default async function LktiPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: record } = await supabase
    .from("lkti_teams")
    .select("*, lkti_team_members(*)")
    .eq("user_id", user.id)
    .maybeSingle();


  return (
    <div className="w-full px-8 py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-headline font-bold text-primary tracking-tight mb-2">
          {record ? "Detail Pendaftaran LKTI" : "Pendaftaran LKTI"}
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          {record 
            ? "Berikut adalah detail pendaftaran Anda untuk Lomba Karya Tulis Ilmiah Nasional DCF 2026." 
            : "Lengkapi form pendaftaran berikut untuk mengikuti LKTI DCF 2026."}
        </p>
      </header>
      
      {record ? (
        <LktiDetailView user={user} data={record} />
      ) : (
        <LktiFormView user={user} />
      )}
    </div>
  );
}

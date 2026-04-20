import { createClient } from "@/utils/supabase/server";
import { PerlombaanView } from "@/components/views/dashboard/perlombaan-view";
import { redirect } from "next/navigation";

export default async function PerlombaanPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [olimpiadeRes, lktiRes] = await Promise.all([
    supabase.from('olympiad_participants').select('status').eq('user_id', user.id).maybeSingle(),
    supabase.from('lkti_teams').select('status').eq('user_id', user.id).maybeSingle()
  ]);

  return <PerlombaanView 
           isRegisteredOlimpiade={!!olimpiadeRes.data} 
           isRegisteredLKTI={!!lktiRes.data} 
         />;
}

import { createClient } from "@/utils/supabase/server";
import { MainView } from "@/components/views/dashboard/main-view";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
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

  return (
    <MainView 
      user={user} 
      hasOlimpiade={!!olimpiadeRes.data}
      hasLKTI={!!lktiRes.data}
      olimpiadeStatus={olimpiadeRes.data?.status}
      lktiStatus={lktiRes.data?.status}
    />
  );
}

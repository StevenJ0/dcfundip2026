import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Sidebar } from "@/components/views/dashboard/sidebar";
import { MobileNav } from "@/components/views/dashboard/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userProfile?.role === "admin") {
    redirect("/admin/dashboard"); 
  }


  return (
    <div className="bg-[#001809] text-on-background font-body h-screen w-full flex overflow-hidden">
      {/* Sidebar for Desktop */}
      <Sidebar user={user} />

      {/* Main Content Canvas */}
      <main className="flex-1 h-full relative overflow-y-auto bg-surface flex flex-col">
        {children}
      </main>

      {/* Mobile Navigation for Small screens */}
      <MobileNav />
    </div>
  );
}
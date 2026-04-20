import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Cek Autentikasi
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Cek Otorisasi Role Admin
  const { data: userProfile, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || userProfile?.role !== "admin") {
    redirect("/dashboard"); 
  }

  return (
    <div className="bg-[#001809] text-[#cbead1] font-body h-screen w-full flex overflow-hidden selection:bg-[#d5e629] selection:text-[#001809]">
      {/* Sidebar for Desktop */}
      <AdminSidebar user={user} />

      {/* Main Content Area */}
      <main className="flex-1 h-full relative overflow-y-auto bg-gradient-to-br from-[#001809] via-[#041d0e] to-[#001809] flex flex-col">
        {/* Subtle mesh/grain background for premium feel */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <div className="relative z-10 w-full min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
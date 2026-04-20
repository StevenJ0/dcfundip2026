"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Trophy, 
  FileText, 
  Users, 
  LogOut,
  ShieldCheck
} from "lucide-react";

interface AdminUser {
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

export function AdminSidebar({ user }: { user: AdminUser }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/signout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navLinks = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Olimpiade", href: "/admin/olimpiade", icon: Trophy },
    { name: "LKTI", href: "/admin/lkti", icon: FileText },
    { name: "User Management", href: "/admin/users", icon: Users },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen sticky top-0 bg-[#001809] border-r border-[#345118] w-72 z-50 overflow-y-auto">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#d5e629] rounded-lg flex items-center justify-center text-[#001809]">
           <ShieldCheck size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-[#d5e629] font-headline tracking-tighter leading-none">DCF 2026</span>
          <span className="text-[10px] text-[#cbead1] opacity-60 uppercase tracking-[0.2em] font-bold">Admin Portal</span>
        </div>
      </div>

      <div className="px-6 mb-10">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0a2510] border border-[#345118]/30 shadow-inner">
          <div className="w-12 h-12 rounded-xl bg-[#345118] flex items-center justify-center text-[#d5e629] border border-[#d5e629]/20 shadow-lg">
             <span className="text-lg font-bold">{(user.user_metadata?.full_name?.[0] || user.email?.[0] || "A").toUpperCase()}</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-headline font-bold text-white truncate">
              {user.user_metadata?.full_name || "Administrator"}
            </p>
            <p className="text-[10px] text-[#cbead1] opacity-70 truncate font-mono">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <div className="px-4 mb-4">
          <span className="text-[10px] font-bold text-[#cbead1] opacity-40 uppercase tracking-[0.3em]">Menu Utama</span>
        </div>
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 px-4 py-3.5 transition-all duration-300 group rounded-xl ${
                isActive
                  ? "bg-[#d5e629] text-[#001809] shadow-[0_0_20px_rgba(213,230,41,0.2)]"
                  : "text-[#cbead1] opacity-70 hover:opacity-100 hover:bg-[#345118]/40 hover:translate-x-1"
              }`}
            >
              <Icon 
                size={20} 
                className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="font-['Space_Grotesk'] font-semibold tracking-tight text-sm">{link.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#001809]"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-[#345118]/30">
        <button
          onClick={handleLogout}
          className="w-full bg-[#345118]/20 border border-[#345118] text-[#cbead1] py-4 rounded-xl font-headline font-bold text-xs flex items-center justify-center gap-3 hover:bg-[#ff4d4d]/10 hover:text-[#ff4d4d] hover:border-[#ff4d4d]/30 transition-all duration-300 group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          LOG OUT SYSTEM
        </button>
      </div>
    </aside>
  );
}

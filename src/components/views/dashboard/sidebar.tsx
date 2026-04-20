"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface User {
  user_metadata: {
    full_name?: string;
    school_name?: string;
    [key: string]: any;
  };
}

export function Sidebar({ user }: { user: User }) {
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
    { name: "Overview", href: "/dashboard", icon: "dashboard" },
    { name: "Registration", href: "/dashboard/perlombaan", icon: "app_registration", fill: true },
    { name: "Seminar", href: "/dashboard/seminar", icon: "mic" },
    { name: "Profile", href: "/dashboard/profile", icon: "person" },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen sticky top-0 bg-[#001809] border-r border-[#345118] w-64 z-50">
      <div className="p-8">
        <span className="text-lg font-black text-[#d5e629] font-headline tracking-tighter">DCF 2026</span>
      </div>
      <div className="px-4 mb-8">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container-low">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-[#d5e629]">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
          <div>
            <p className="text-sm font-headline font-bold text-white line-clamp-1">
              {user.user_metadata?.full_name || "Applicant Portal"}
            </p>
            <p className="text-[10px] text-[#cbead1] opacity-70 uppercase tracking-widest line-clamp-1">
              {user.user_metadata?.school_name || "DCF 2026 Dashboard"}
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-2 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 font-['Space_Grotesk'] font-medium ${
                isActive
                  ? "bg-[#345118] text-[#d5e629] rounded-r-full"
                  : "text-[#cbead1] opacity-70 hover:bg-[#345118]/50"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={link.fill && isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {link.icon}
              </span>
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full bg-[#d5e629] text-[#001809] py-4 rounded-xl font-headline font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Log Out
        </button>
      </div>
    </aside>
  );
}

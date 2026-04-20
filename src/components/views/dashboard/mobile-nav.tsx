"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: "dashboard" },
    { name: "Registration", href: "/dashboard/perlombaan", icon: "app_registration", fill: true },
    { name: "Seminar", href: "/dashboard/seminar", icon: "mic" },
    { name: "Profile", href: "/dashboard/profile", icon: "person" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface/80 backdrop-blur-xl border-t border-outline-variant/20 flex justify-around items-center py-4 px-6 z-50">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex flex-col items-center gap-1 ${
              isActive ? "text-[#d5e629]" : "text-[#cbead1] opacity-70"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={link.fill && isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {link.icon}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

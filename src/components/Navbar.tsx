import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { label: 'Beranda',    href: '#beranda'    },
  { label: 'Tentang',    href: '#tentang'    },
  { label: 'Jadwal',     href: '#jadwal'     },
  { label: 'Hadiah',     href: '#hadiah'     },
  { label: 'Cara Daftar',href: '#cara-daftar'},
  { label: 'Contact',    href: '#contact'    },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#001809]/40 backdrop-blur-md border-b border-white/10 transition-all duration-300 flex justify-between items-center py-4 px-6 md:px-12 max-w-full font-['Space_Grotesk'] tracking-tight">
      
      {/* ── Logo & Brand ──────────────────────────────────────────────── */}
      <Link href="#beranda" className="flex items-center gap-3 group">
        <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-lg">
          <Image 
            src="/icon.png" 
            alt="Logo DCF 2026" 
            fill
            sizes="(max-width: 768px) 32px, 40px"
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            priority // Menghindari lazy load karena logo ini di area paling atas (Above the fold)
          />
        </div>
        <span className="text-xl md:text-2xl font-bold tracking-tighter text-[#d5e629]">
          DCF 2026
        </span>
      </Link>

      {/* ── Navigasi Desktop ──────────────────────────────────────────── */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          // Menggunakan tag <a> agar smooth scroll (#id) berfungsi sempurna
          <a
            key={link.href}
            href={link.href}
            className="text-white/80 hover:text-[#d5e629] transition-colors duration-300 text-sm font-medium"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* ── Tombol CTA ────────────────────────────────────────────────── */}
      <Link
        href="/register"
        className="bg-primary-container text-on-primary-container px-6 py-2 rounded-xl font-bold text-sm hover:bg-primary transition-all duration-200 active:scale-95"
      >
        Register Now
      </Link>
      
    </nav>
  );
}
import Link from 'next/link';
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="w-full py-16 px-8 flex flex-col items-center gap-6 bg-[#001809] font-['Inter'] text-sm tracking-wide rounded-t-3xl"
    >
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

        {/* ── Brand Column ──────────────────────────────────────────────── */}
        <div>
          <div className="text-2xl font-bold text-white mb-4">Diponegoro Chemistry Fair</div>
          <p className="text-[#cbead1]/70 max-w-xs mb-8 leading-relaxed text-sm">
            Advancing sustainable energy through chemical innovation and academic excellence.
          </p>
          <div className="flex gap-3">
            
            {/* 1. Ikon Instagram dari Lucide React */}
            <a
              href="https://instagram.com/dcfundip" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-white hover:text-[#d5e629] transition-colors"
            >
              <FaInstagram size={18} strokeWidth={2} />
            </a>

            {/* 2. Ikon TikTok (Custom SVG bergaya persis seperti Lucide) */}
            <a
              href="https://www.tiktok.com/@dcf.undip?_r=1&_t=ZS-95isSueQciN" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-white hover:text-[#d5e629] transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
              </svg>
            </a>

          </div>
        </div>

        {/* ── Navigasi ──────────────────────────────────────────────────── */}
        <div>
          <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Navigasi</h5>
          <ul className="space-y-3">
            {[
              { label: 'Beranda',     href: '#beranda'     },
              { label: 'Tentang',     href: '#tentang'     },
              { label: 'Jadwal',      href: '#jadwal'      },
              { label: 'Hadiah',      href: '#hadiah'      },
              { label: 'Cara Daftar', href: '#cara-daftar' },
            ].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-[#cbead1]/70 hover:text-[#d5e629] transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Dokumen ───────────────────────────────────────────────────── */}
        <div>
          <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Dokumen</h5>
          <ul className="space-y-3">
            {[
              { label: 'Guidebook LKTI',     href: 'https://drive.google.com/file/d/1swRR6K7iU_Z7Abo1DFNyZ_DYL8JPtZ3a/view?usp=sharing' },
              { label: 'Guidebook Olimpiade',   href: 'https://drive.google.com/file/d/1irLUd55rOlYB0ZUsj2AsbZaOjYMo4u_L/view?usp=sharing' },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[#cbead1]/70 hover:text-[#d5e629] transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">description</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Kontak ────────────────────────────────────────────────────── */}
        <div>
          <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Kontak</h5>
          <ul className="space-y-4">
            <li>
              <a
                href="mailto:dcfundip2026@gmail.com"
                className="flex items-start gap-3 text-[#cbead1]/70 hover:text-[#d5e629] transition-colors"
              >
                <span className="material-symbols-outlined text-base mt-0.5">mail</span>
                <span className="break-all">dcfundip2026@gmail.com</span>
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/6285876037289"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-[#cbead1]/70 hover:text-[#d5e629] transition-colors"
              >
                <span className="material-symbols-outlined text-base mt-0.5">phone</span>
                <span>
                  <span className="block text-[#cbead1]/50 text-xs mb-0.5">WA Olimpiade</span>
                  +6285876037289 – Putri
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/6281328624821"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-[#cbead1]/70 hover:text-[#d5e629] transition-colors"
              >
                <span className="material-symbols-outlined text-base mt-0.5">phone</span>
                <span>
                  <span className="block text-[#cbead1]/50 text-xs mb-0.5">WA LKTI</span>
                  +6281328624821 – Puput
                </span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* ── Bottom Bar ────────────────────────────────────────────────────── */}
      <div className="w-full pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#cbead1]/50 text-xs text-center">
          © 2026 Diponegoro Chemistry Fair. Advancing Sustainable Energy.
        </p>
        <p className="text-[#cbead1]/30 text-xs">
          Himpunan Mahasiswa Kimia — Universitas Diponegoro
        </p>
      </div>
    </footer>
  );
}
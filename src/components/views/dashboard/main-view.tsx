import React from "react";
import { getLktiStatusLabel, getLktiStatusBadgeClasses, getLktiStatusDescription } from "@/utils/status-mapper";

interface User {
  user_metadata: {
    full_name?: string;
    school_name?: string;
    [key: string]: any;
  };
}

export function MainView({ 
  user,
  hasOlimpiade,
  hasLKTI,
  olimpiadeStatus,
  lktiStatus
}: { 
  user: User,
  hasOlimpiade?: boolean,
  hasLKTI?: boolean,
  olimpiadeStatus?: string,
  lktiStatus?: string
}) {
  const fullName = user.user_metadata?.full_name || "Applicant";
  const getStatusBadgeClasses = (status?: string, isLkti?: boolean) => {
    if (isLkti) return getLktiStatusBadgeClasses(status);
    if (status === "VERIFIED") return "bg-green-400/10 text-green-400 border-green-400/20";
    if (status === "REJECTED") return "bg-red-400/10 text-red-400 border-red-400/20";
    return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20";
  };

  const getStatusDescription = (status?: string, isLkti?: boolean) => {
    if (isLkti) return getLktiStatusDescription(status);
    if (status === "PENDING" || !status) {
      return "Dokumen pendaftaran Anda telah diterima dan sedang dalam antrean verifikasi panitia. Mohon cek halaman ini secara berkala.";
    }
    return "Status pendaftaran Anda telah diperbarui. Silakan klik 'Lihat Detail Pendaftaran' untuk informasi lebih lanjut.";
  };

  return (
    <div className="w-full">
      {/* Header / Top Context */}
      <header className="w-full px-8 py-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tight mb-2">
            Overview
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Selamat datang, {fullName}! Pantau status pendaftaran dan pengumuman DCF 2026 di sini.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-4 border-l-4 border-primary-container">
            <div>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mb-1">
                Current Phase
              </p>
              <p className="text-white font-headline font-medium">Early Bird Registration</p>
            </div>
          </div>
        </div>
      </header>

      {/* Bento Layout for Stats & Progress */}
      <div className="px-8 grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface-container-low p-6 rounded-3xl flex flex-col justify-between group md:col-span-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(213,230,41,0.1)]">
          <span className="material-symbols-outlined text-[#d5e629] text-3xl mb-4 group-hover:scale-110 transition-transform">
            check_circle
          </span>
          <div>
            <h3 className="text-on-surface-variant text-xs uppercase font-bold tracking-widest mb-1">
              Status Akun
            </h3>
            <p className="text-2xl font-headline font-bold text-white">Terdaftar</p>
          </div>
        </div>
        
        <div className="bg-surface-container-low p-6 rounded-3xl flex flex-col justify-between md:col-span-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(213,230,41,0.1)]">
          <div className="flex justify-between items-start">
            <span className={`material-symbols-outlined text-3xl ${(hasOlimpiade || hasLKTI) ? 'text-[#dcfca8]' : 'text-on-surface-variant opacity-50'}`}>
              {(hasOlimpiade) ? 'science' : (hasLKTI) ? 'emoji_events' : 'do_not_disturb_off'}
            </span>
          </div>
          <div>
            {!hasOlimpiade && !hasLKTI && (
              <div className="mt-4">
                <h3 className="text-white font-headline font-bold text-xl">Belum Ada Lomba</h3>
                <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">
                  Anda belum terdaftar di lomba apapun. Silakan ke menu Registration.
                </p>
              </div>
            )}
            
            {hasOlimpiade && (
              <div className="mt-4">
                <h3 className="text-white font-headline font-bold text-2xl mb-3">Olimpiade Kimia</h3>
                <span className={`inline-flex border px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${getStatusBadgeClasses(olimpiadeStatus)}`}>
                  {olimpiadeStatus || "PENDING"}
                </span>
                <p className="text-on-surface-variant text-sm mt-4 leading-relaxed max-w-md">
                  {getStatusDescription(olimpiadeStatus)}
                </p>
                <a href="/dashboard/perlombaan/olimpiade" className="text-primary-container hover:underline text-sm font-bold inline-flex items-center gap-1 mt-4">
                  Lihat Detail Pendaftaran <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            )}
            
            {hasLKTI && (
              <div className="mt-4">
                <h3 className="text-white font-headline font-bold text-2xl mb-3">LKTI Nasional</h3>
                <span className={`inline-flex border px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${getStatusBadgeClasses(lktiStatus, true)}`}>
                  {getLktiStatusLabel(lktiStatus)}
                </span>
                <p className="text-on-surface-variant text-sm mt-4 leading-relaxed max-w-md">
                  {getStatusDescription(lktiStatus, true)}
                </p>
                <a href="/dashboard/perlombaan/lkti" className="text-primary-container hover:underline text-sm font-bold inline-flex items-center gap-1 mt-4">
                  Lihat Detail Pendaftaran <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-surface-container-low p-6 rounded-3xl flex flex-col justify-between md:col-span-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(213,230,41,0.1)]">
          <span className="material-symbols-outlined text-[#d5e629] text-3xl mb-4">campaign</span>
          <div>
            <h3 className="text-white font-headline font-bold text-xl mb-3">Pengumuman Terbaru</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Selamat! Pendaftaran awal Anda berhasil. Saat ini belum ada pengumuman lanjutan. Pastikan nomor WhatsApp yang Anda daftarkan selalu aktif.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

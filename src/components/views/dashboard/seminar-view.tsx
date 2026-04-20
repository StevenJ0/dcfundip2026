"use client";

import React from "react";

interface User {
  id: string;
  email?: string;
  user_metadata: {
    full_name?: string;
    [key: string]: any;
  };
}

export function SeminarView({ user }: { user: User }) {
  return (
    <div className="w-full px-8 py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-headline font-bold text-primary tracking-tight mb-2">
          Seminar Nasional DCF 2026
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Pusat informasi dan pendaftaran Seminar Nasional Diponegoro Chemistry Fair 2026.
        </p>
      </header>

      <div className="bg-surface-container p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="relative z-10 space-y-12 block">

          {/* Hero Section */}
          <div className="bg-surface-container-highest/30 border border-primary-container/20 rounded-3xl p-10 md:p-14 text-center shadow-[0_0_40px_rgba(213,230,41,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[50%] bg-gradient-to-b from-primary-container/10 to-transparent blur-3xl"></div>
            <h2 className="text-sm font-medium text-primary-container mb-4 uppercase tracking-[0.2em] relative z-10">Tema Seminar Utama</h2>
            <h3 className="text-3xl md:text-5xl font-headline font-extrabold text-white leading-snug md:leading-tight relative z-10">
              Advanced Chemical Technologies for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d5e629] to-[#80c841]">Renewable Energy Transition</span> and Net-Zero Future
            </h3>
          </div>

          {/* Information Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-surface-container-highest/20 p-8 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center group hover:bg-surface-container-highest/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(213,230,41,0.1)]">
                 <div className="w-16 h-16 bg-surface-container-highest rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                     <span className="material-symbols-outlined text-3xl text-primary-container">calendar_month</span>
                 </div>
                 <h4 className="text-white font-bold text-lg mb-2">Tanggal Pelaksanaan</h4>
                 <p className="text-on-surface-variant font-medium">(TBA)</p>
             </div>
             
             <div className="bg-surface-container-highest/20 p-8 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center group hover:bg-surface-container-highest/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(213,230,41,0.1)]">
                 <div className="w-16 h-16 bg-surface-container-highest rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                     <span className="material-symbols-outlined text-3xl text-primary-container">location_on</span>
                 </div>
                 <h4 className="text-white font-bold text-lg mb-2">Lokasi</h4>
                 <p className="text-on-surface-variant font-medium">(TBA / Online)</p>
             </div>

             <div className="bg-surface-container-highest/20 p-8 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center group hover:bg-surface-container-highest/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(213,230,41,0.1)]">
                 <div className="w-16 h-16 bg-surface-container-highest rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                     <span className="material-symbols-outlined text-3xl text-primary-container">mic</span>
                 </div>
                 <h4 className="text-white font-bold text-lg mb-2">Pembicara</h4>
                 <p className="text-on-surface-variant font-medium">Akan Segera Diumumkan</p>
             </div>
          </div>

          {/* Call to Action Section */}
          <div className="pt-6 border-t border-outline-variant/20 flex flex-col items-center text-center">
             <a
               href="#"
               target="_blank"
               rel="noopener noreferrer"
               className="w-full md:w-auto bg-[#d5e629] text-[#001809] px-12 py-5 rounded-2xl font-headline font-extrabold text-lg transition-all hover:shadow-[0_0_30px_rgba(213,230,41,0.4)] hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-3 relative z-10"
             >
               Daftar Seminar Sekarang (Google Form)
               <span className="material-symbols-outlined">launch</span>
             </a>
             <p className="text-sm text-on-surface-variant/70 italic mt-4 font-medium relative z-10">
               Anda akan diarahkan ke formulir pendaftaran eksternal.
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}

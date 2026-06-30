import Link from "next/link";

// ============================================================
// COMPETITION REGISTRATION TOGGLE
// Set to `true` to re-open Gelombang 2 registration.
// ============================================================
const IS_COMPETITION_OPEN = false;

export function PerlombaanView({
  isRegisteredOlimpiade,
  isRegisteredLKTI
}: {
  isRegisteredOlimpiade?: boolean;
  isRegisteredLKTI?: boolean;
}) {
  return (
    <div className="w-full px-8 py-10">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-headline font-bold text-primary tracking-tight mb-2">
          Pilih Kategori
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Pilih ajang kompetisi atau seminar yang ingin Anda ikuti di DCF 2026.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
        {/* Card 1: Olimpiade Kimia */}
        {IS_COMPETITION_OPEN ? (
          <div className={`bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20 flex flex-col justify-between group ${isRegisteredLKTI ? 'opacity-50' : 'hover:border-primary-container hover:-translate-y-1 transition-all'}`}>
            <div>
              <div className="w-14 h-14 bg-surface-container-highest rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-container/10 transition-colors">
                <span className="material-symbols-outlined text-[#d5e629] text-3xl">
                  science
                </span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-white mb-3">
                Olimpiade Kimia
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                Uji pengetahuan dan kemampuan kimiamu di tingkat nasional tingkat SMA/SMK sederajat.
              </p>
            </div>
            {isRegisteredLKTI ? (
              <button disabled className="text-outline-variant font-bold inline-flex items-center gap-2 cursor-not-allowed">
                Tidak Tersedia (Telah memilih LKTI)
              </button>
            ) : isRegisteredOlimpiade ? (
              <Link
                href="/dashboard"
                className="text-primary-container font-bold inline-flex items-center gap-2 transition-transform"
              >
                Lihat Status Pendaftaran
              </Link>
            ) : (
              <Link
                href="/dashboard/perlombaan/olimpiade"
                className="text-primary-container font-bold inline-flex items-center gap-2 group-hover:translate-x-2 transition-transform"
              >
                Daftar Sekarang
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            )}
          </div>
        ) : (
          /* Olimpiade — Closed State */
          <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20 flex flex-col justify-between opacity-70">
            <div>
              <div className="w-14 h-14 bg-surface-container-highest rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#d5e629] text-3xl">
                  science
                </span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-white mb-3">
                Olimpiade Kimia
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                Uji pengetahuan dan kemampuan kimiamu di tingkat nasional tingkat SMA/SMK sederajat.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-outline-variant font-bold text-sm cursor-not-allowed">
              <span className="material-symbols-outlined text-base">lock</span>
              Pendaftaran Ditutup
            </span>
          </div>
        )}

        {/* Card 2: LKTI */}
        {IS_COMPETITION_OPEN ? (
          <div className={`bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20 flex flex-col justify-between group ${isRegisteredOlimpiade ? 'opacity-50' : 'hover:border-primary-container hover:-translate-y-1 transition-all'}`}>
            <div>
              <div className="w-14 h-14 bg-surface-container-highest rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-container/10 transition-colors">
                <span className="material-symbols-outlined text-[#d5e629] text-3xl">
                  article
                </span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-white mb-3">
                LKTI Nasional
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                Tunjukkan karya tulis ilmiah inovatif timmu untuk masa depan berkelanjutan.
              </p>
            </div>
            {isRegisteredOlimpiade ? (
              <button disabled className="text-outline-variant font-bold inline-flex items-center gap-2 cursor-not-allowed">
                Tidak Tersedia (Telah memilih Olimpiade)
              </button>
            ) : isRegisteredLKTI ? (
              <Link
                href="/dashboard"
                className="text-primary-container font-bold inline-flex items-center gap-2 transition-transform"
              >
                Lihat Status Pendaftaran
              </Link>
            ) : (
              <Link
                href="/dashboard/perlombaan/lkti"
                className="text-primary-container font-bold inline-flex items-center gap-2 group-hover:translate-x-2 transition-transform"
              >
                Daftar Sekarang
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            )}
          </div>
        ) : (
          /* LKTI — Closed State */
          <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20 flex flex-col justify-between opacity-70">
            <div>
              <div className="w-14 h-14 bg-surface-container-highest rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#d5e629] text-3xl">
                  article
                </span>
              </div>
              <h3 className="text-2xl font-headline font-bold text-white mb-3">
                LKTI Nasional
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
                Tunjukkan karya tulis ilmiah inovatif timmu untuk masa depan berkelanjutan.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-outline-variant font-bold text-sm cursor-not-allowed">
              <span className="material-symbols-outlined text-base">lock</span>
              Pendaftaran Ditutup
            </span>
          </div>
        )}

        {/* Card 3: Seminar — always open, unaffected by IS_COMPETITION_OPEN */}
        <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20 hover:border-primary-container hover:-translate-y-1 transition-all flex flex-col justify-between group">
          <div>
            <div className="w-14 h-14 bg-surface-container-highest rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-container/10 transition-colors">
              <span className="material-symbols-outlined text-[#d5e629] text-3xl">
                mic
              </span>
            </div>
            <h3 className="text-2xl font-headline font-bold text-white mb-3">
              Seminar Nasional
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
              Ikuti seminar nasional bersama para pakar energi terbarukan.
            </p>
          </div>
          <Link
            href="/dashboard/perlombaan/seminar"
            className="text-primary-container font-bold inline-flex items-center gap-2 group-hover:translate-x-2 transition-transform"
          >
            Daftar Sekarang
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Closed Registration Banner — shown below cards when competition is closed */}
      {!IS_COMPETITION_OPEN && (
        <div className="mt-10 rounded-3xl border border-outline-variant/30 bg-surface-container-low p-8 md:p-10 flex flex-col items-start gap-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl" role="img" aria-label="lock">🔒</span>
            <h2 className="text-2xl font-headline font-bold text-white leading-tight">
              Pendaftaran Gelombang 1 Ditutup
            </h2>
          </div>
          <p className="text-on-surface-variant text-base leading-relaxed">
            Pendaftaran lomba Gelombang 1 DCF 2026 telah berakhir. Kami akan membuka kembali
            pendaftaran Gelombang 2 pada tanggal <span className="text-white font-semibold">6 Juli 2026</span>.
            Silakan persiapkan berkas tim Anda!
          </p>
        </div>
      )}
    </div>
  );
}

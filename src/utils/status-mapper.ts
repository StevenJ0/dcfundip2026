// ============================================================
// LKTI Status Mapper
// Maps raw Supabase enum values to user-friendly Indonesian text.
// ============================================================

export type LktiStatus =
  | "ABSTRAK_PENDING"
  | "ABSTRAK_REJECTED"
  | "ABSTRAK_PASSED"
  | "FULLPAPER_PENDING"
  | "FULLPAPER_REJECTED"
  | "FINAL_VERIFIED";

export function getLktiStatusLabel(status?: string): string {
  switch (status) {
    case "ABSTRAK_PENDING":
      return "Menunggu Verifikasi Abstrak";
    case "ABSTRAK_REJECTED":
      return "Abstrak Tidak Lolos";
    case "ABSTRAK_PASSED":
      return "Lolos Abstrak (Harap Upload Berkas)";
    case "FULLPAPER_PENDING":
      return "Menunggu Verifikasi Pembayaran & Paper";
    case "FULLPAPER_REJECTED":
      return "Berkas/Pembayaran Ditolak";
    case "FINAL_VERIFIED":
      return "Terverifikasi (Finalis)";
    default:
      return status ? status.replace(/_/g, " ") : "PENDING";
  }
}

export function getLktiStatusBadgeClasses(status?: string): string {
  switch (status) {
    case "ABSTRAK_PASSED":
    case "FINAL_VERIFIED":
      return "bg-green-400/10 text-green-400 border-green-400/20";
    case "ABSTRAK_REJECTED":
    case "FULLPAPER_REJECTED":
      return "bg-red-400/10 text-red-400 border-red-400/20";
    case "FULLPAPER_PENDING":
    case "ABSTRAK_PENDING":
    default:
      return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20";
  }
}

export function getLktiStatusDescription(status?: string): string {
  switch (status) {
    case "ABSTRAK_PENDING":
      return "Abstrak Anda sedang dalam antrian seleksi panitia. Mohon tunggu pengumuman selanjutnya.";
    case "ABSTRAK_REJECTED":
      return "Abstrak Anda tidak memenuhi kriteria seleksi. Silakan perbaiki dan kirim ulang.";
    case "ABSTRAK_PASSED":
      return "Selamat! Abstrak Anda lolos seleksi. Silakan login dan upload Bukti Pembayaran & Full Paper sekarang.";
    case "FULLPAPER_PENDING":
      return "Bukti Pembayaran dan Full Paper Anda sedang diverifikasi panitia. Mohon tunggu.";
    case "FULLPAPER_REJECTED":
      return "Berkas atau Bukti Pembayaran Anda ditolak. Silakan periksa detail dan unggah ulang.";
    case "FINAL_VERIFIED":
      return "Selamat! Pendaftaran Anda telah terverifikasi penuh. Anda resmi menjadi Finalis DCF 2026.";
    default:
      return "Dokumen pendaftaran Anda telah diterima dan sedang dalam proses verifikasi panitia.";
  }
}

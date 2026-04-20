# ⚛️ Diponegoro Chemistry Fair (DCF) 2026

Platform web resmi untuk pendaftaran dan manajemen peserta Diponegoro Chemistry Fair 2026. Aplikasi ini menangani autentikasi pengguna, pengumpulan dokumen pendaftaran lomba (Olimpiade & LKTI), serta menyediakan *dashboard* khusus untuk panitia guna memverifikasi data dan mengirimkan notifikasi email otomatis.

## 🚀 Tech Stack

Aplikasi ini dibangun menggunakan arsitektur modern web *full-stack*:

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Dark "Molecular Alchemist" Theme)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Storage, SSR Auth)
- **Mailing:** [Nodemailer](https://nodemailer.com/) (Automated Verification/Rejection Emails)
- **Icons:** [Lucide React](https://lucide.dev/) & Material Symbols
- **Animation:** [Framer Motion](https://www.framer.com/motion/)

## ✨ Fitur Utama

- **Sistem Autentikasi Kuat:** Login dan Registrasi berbasis JWT dengan validasi *password real-time* (Server-Side Rendering Auth).
- **Portal Peserta:** Pengguna dapat mendaftar lomba (LKTI Nasional & Olimpiade), mengunggah dokumen persyaratan (Bukti Bayar, Twibbon, Full Paper), dan memantau status pendaftaran.
- **Sistem Revisi Dinamis:** Jika pendaftaran ditolak oleh panitia, *form upload* akan terbuka kembali di *dashboard* peserta untuk proses *resubmit*.
- **Admin Dashboard:** Antarmuka terpusat bagi panitia untuk meninjau detail pendaftar, melihat dokumen, dan memberikan keputusan (VERIFIED / REJECTED).
- **Email Otomatis:** Sistem akan secara otomatis mengirimkan email pemberitahuan ke *inbox* peserta segera setelah panitia mengubah status pendaftaran mereka.

## 🛠️ Persyaratan Sistem (Local Development)

Pastikan Anda telah menginstal aplikasi berikut sebelum menjalankan proyek:
- Node.js (v18 atau lebih baru)
- npm / yarn / pnpm


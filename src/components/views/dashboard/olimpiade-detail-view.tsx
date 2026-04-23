"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { resubmitOlimpiadeRegistration } from "@/app/actions/resubmit-olimpiade";
import { updateUserProfile } from "@/app/actions/update-profile";
import { ModalNotify } from "@/components/ui/modal-notify";
import { IdCard } from "lucide-react";

interface User {
  id: string;
  email?: string;
  user_metadata: {
    full_name?: string;
    school_name?: string;
    phone_number?: string;
    [key: string]: any;
  };
}

interface OlimpiadeRecord {
  status: string;
  payment_proof_url: string;
  twibbon_url: string;
  student_card_url: string;
  ig_proof_url: string;
  created_at: string;
}

export function OlimpiadeDetailView({ user, data }: { user: User; data: OlimpiadeRecord }) {
  const router = useRouter();

  const [pembayaranFile, setPembayaranFile] = useState<File | null>(null);
  const [twibbonFile, setTwibbonFile] = useState<File | null>(null);
  const [studentCardFile, setStudentCardFile] = useState<File | null>(null);
  const [instagramFile, setInstagramFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error" | "info">("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user.user_metadata?.full_name || "",
    schoolName: user.user_metadata?.school_name || "",
    phoneNumber: user.user_metadata?.phone_number || "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const showModal = (title: string, message: string, type: "success" | "error" | "info") => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!profileForm.fullName || !profileForm.schoolName || !profileForm.phoneNumber) {
      showModal("Gagal", "Semua kolom profil harus diisi.", "error");
      return;
    }
    setIsSavingProfile(true);
    const res = await updateUserProfile(profileForm.fullName, profileForm.schoolName, profileForm.phoneNumber);
    setIsSavingProfile(false);
    if (res.success) {
      showModal("Berhasil", "Profil berhasil diperbarui.", "success");
      setIsEditingProfile(false);
      router.refresh();
    } else {
      showModal("Gagal", res.error || "Gagal memperbarui profil.", "error");
    }
  };

  const isRevisionFormValid = pembayaranFile !== null && twibbonFile !== null && studentCardFile !== null && instagramFile !== null;

  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRevisionFormValid) {
      showModal("Gagal", "Harap unggah semua dokumen yang diwajibkan untuk revisi.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      
      const uploadFile = async (file: File, folder: string) => {
        const filePath = `olimpiade/${user.id}/${folder}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("dcf_files")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Gagal mengunggah ${folder}: ${uploadError.message}`);
        }

        const { data } = supabase.storage.from("dcf_files").getPublicUrl(filePath);
        return data.publicUrl;
      };

      const twibbonUrl = await uploadFile(twibbonFile, "twibbon");
      const studentCardUrl = await uploadFile(studentCardFile, "kartu-pelajar");
      const igUrl = await uploadFile(instagramFile, "instagram");
      const paymentUrl = await uploadFile(pembayaranFile, "bukti-bayar");

      const submitResult = await resubmitOlimpiadeRegistration(
        user.id,
        twibbonUrl,
        studentCardUrl,
        igUrl,
        paymentUrl
      );

      if (!submitResult.success) {
        throw new Error(submitResult.error || "Gagal menyimpan revisi.");
      }

      setIsSubmitting(false);
      showModal("Berhasil", "Revisi berhasil diunggah! Pendaftaran Anda akan ditinjau kembali.", "success");

      setTimeout(() => {
        setIsModalOpen(false);
        router.refresh();
      }, 2000);
      
    } catch (err: any) {
      console.error(err);
      showModal("Gagal", err.message || "Terjadi kesalahan saat mengunggah revisi.", "error");
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="bg-surface-container p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

      <div className="relative z-10 space-y-10">
        
        {/* Status Section */}
        <div className="flex flex-col gap-4 border-b border-outline-variant/30 pb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-headline font-bold text-white">Status Pendaftaran: </h2>
            {data.status === 'PENDING' ? (
              <span className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div>
                Menunggu Verifikasi
              </span>
            ) : data.status === 'VERIFIED' ? (
              <span className="inline-flex items-center gap-2 bg-green-400/10 text-green-400 border border-green-400/20 px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                Terverifikasi
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 bg-red-400/10 text-red-400 border border-red-400/20 px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                Ditolak
              </span>
            )}
          </div>

          {data.status === 'REJECTED' && (
            <div className="mt-2 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
              <span className="material-symbols-outlined text-red-400 mt-0.5">error</span>
              <div>
                 <h4 className="text-red-400 font-bold mb-1">Pendaftaran Anda Ditolak</h4>
                 <p className="text-red-300 text-sm opacity-90">
                   Silakan perbaiki dan unggah ulang dokumen Anda di bawah ini.
                 </p>
              </div>
            </div>
          )}
        </div>

        {data.status !== 'REJECTED' ? (
          <>
            {/* Section 1: User Info (Editable) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-headline font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-container rounded-full"></span>
                  Informasi Peserta
                </h3>
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="text-xs font-bold bg-surface-container-highest px-4 py-2 rounded-lg text-primary-container hover:bg-surface-container-highest/60 transition-colors"
                  >
                    Edit Profil
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="text-xs font-bold bg-surface-container-highest px-4 py-2 rounded-lg text-white hover:bg-surface-container-highest/60 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="text-xs font-bold bg-primary-container px-4 py-2 rounded-lg text-on-primary-container hover:shadow-[0_0_15px_rgba(213,230,41,0.3)] transition-all disabled:opacity-50"
                    >
                      {isSavingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-highest/20 p-6 rounded-2xl border border-outline-variant/30">
                <div>
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-1">Nama Lengkap</p>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="w-full bg-surface-container-high border border-outline-variant/50 text-on-surface rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/70 focus:border-primary-container transition-all"
                    />
                  ) : (
                    <p className="text-white font-medium">{user.user_metadata?.full_name}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-1">Email</p>
                  <p className="text-white font-medium opacity-70">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-1">Asal Sekolah</p>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={profileForm.schoolName}
                      onChange={(e) => setProfileForm({ ...profileForm, schoolName: e.target.value })}
                      className="w-full bg-surface-container-high border border-outline-variant/50 text-on-surface rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/70 focus:border-primary-container transition-all"
                    />
                  ) : (
                    <p className="text-white font-medium">{user.user_metadata?.school_name}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-1">Nomor WhatsApp/HP</p>
                  {isEditingProfile ? (
                    <input
                      type="tel"
                      value={profileForm.phoneNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                      className="w-full bg-surface-container-high border border-outline-variant/50 text-on-surface rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/70 focus:border-primary-container transition-all"
                    />
                  ) : (
                    <p className="text-white font-medium">{user.user_metadata?.phone_number || "-"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Berkas Identitas */}
            <div className="space-y-4">
              <h3 className="text-lg font-headline font-bold text-white flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-primary-container rounded-full"></span>
                 Berkas Identitas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-highest/30 p-6 rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
                  <div className="flex items-center gap-3 mb-4">
                    <IdCard className="text-[#d5e629]" size={28} />
                    <div>
                      <p className="text-xs text-[#d5e629] font-bold uppercase tracking-wider">Peserta</p>
                      <p className="text-white font-medium truncate">{user.user_metadata?.full_name}</p>
                    </div>
                  </div>
                  <div>
                    {data.student_card_url ? (
                      <div className="flex items-center justify-between gap-2 mt-4">
                         <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-1 rounded-md font-semibold">Tersedia</span>
                         <a href={data.student_card_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-surface-container bg-primary-container hover:bg-primary-container/80 transition-colors px-3 py-1.5 rounded-lg">
                           Lihat Berkas <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                         </a>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-md font-semibold">Belum Diunggah</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Uploaded Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-headline font-bold text-white flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-primary-container rounded-full"></span>
                 Dokumen Terunggah
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-surface-container-highest/30 p-6 rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
                  <span className="material-symbols-outlined text-3xl text-[#d5e629] mb-4">payments</span>
                  <div>
                    <p className="text-sm font-bold text-white mb-3">Bukti Pembayaran</p>
                    <a href={data.payment_proof_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-surface-container bg-primary-container hover:bg-primary-container/80 transition-colors px-4 py-2 rounded-lg">
                      Buka Dokumen <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>

                <div className="bg-surface-container-highest/30 p-6 rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
                  <span className="material-symbols-outlined text-3xl text-[#d5e629] mb-4">frame_person</span>
                  <div>
                    <p className="text-sm font-bold text-white mb-3">Bukti Twibbon</p>
                    <a href={data.twibbon_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-surface-container bg-primary-container hover:bg-primary-container/80 transition-colors px-4 py-2 rounded-lg">
                      Buka Dokumen <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>


                <div className="bg-surface-container-highest/30 p-6 rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
                  <span className="material-symbols-outlined text-3xl text-[#d5e629] mb-4">photo_camera</span>
                  <div>
                    <p className="text-sm font-bold text-white mb-3">Bukti Follow IG</p>
                    <a href={data.ig_proof_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-surface-container bg-primary-container hover:bg-primary-container/80 transition-colors px-4 py-2 rounded-lg">
                      Buka Dokumen <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmitRevision} className="space-y-10">
            <h2 className="text-2xl font-headline font-bold text-white mb-8 flex items-center gap-3 pt-4">
              <span className="w-2 h-2 bg-primary-container rounded-full"></span>
              Revisi Dokumen
            </h2>

            <div className="grid grid-cols-1 gap-8">
              {/* Upload Pembayaran */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant ml-1">
                  Bukti Pembayaran <span className="text-error">*</span> <br/>
                  <span className="text-xs opacity-70">Olimpiade Gel 1: Rp 90.000 / Gel 2: Rp 100.000</span>
                </label>
                <label className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors group cursor-pointer block text-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">
                    payments
                  </span>
                  <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-on-surface-variant text-xs">PDF, JPG or PNG (max. 5MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => setPembayaranFile(e.target.files?.[0] || null)}
                  />
                  {pembayaranFile && (
                    <p className="text-primary-container mt-4 text-sm font-bold bg-primary-container/10 px-4 py-2 rounded-lg">
                      {pembayaranFile.name}
                    </p>
                  )}
                </label>
              </div>

              {/* Upload Twibbon */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant ml-1">
                  Bukti Upload Twibbon <span className="text-error">*</span>
                </label>
                <label className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors group cursor-pointer block text-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">
                    frame_person
                  </span>
                  <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-on-surface-variant text-xs">JPG or PNG (max. 5MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setTwibbonFile(e.target.files?.[0] || null)}
                  />
                  {twibbonFile && (
                    <p className="text-primary-container mt-4 text-sm font-bold bg-primary-container/10 px-4 py-2 rounded-lg">
                      {twibbonFile.name}
                    </p>
                  )}
                </label>
              </div>

              {/* Upload Kartu Pelajar */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant ml-1">
                  Upload Kartu Pelajar / Surat Keterangan Aktif <span className="text-error">*</span>
                </label>
                <label className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors group cursor-pointer block text-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">
                    badge
                  </span>
                  <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-on-surface-variant text-xs">PDF, JPG or PNG (max. 5MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => setStudentCardFile(e.target.files?.[0] || null)}
                  />
                  {studentCardFile && (
                    <p className="text-primary-container mt-4 text-sm font-bold bg-primary-container/10 px-4 py-2 rounded-lg">
                      {studentCardFile.name}
                    </p>
                  )}
                </label>
              </div>

              {/* Upload IG */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant ml-1">
                  Bukti Follow Instagram @dcfundip <span className="text-error">*</span>
                </label>
                <label className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors group cursor-pointer block text-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">
                    photo_camera
                  </span>
                  <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-on-surface-variant text-xs">JPG or PNG (max. 5MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setInstagramFile(e.target.files?.[0] || null)}
                  />
                  {instagramFile && (
                    <p className="text-primary-container mt-4 text-sm font-bold bg-primary-container/10 px-4 py-2 rounded-lg">
                      {instagramFile.name}
                    </p>
                  )}
                </label>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 pt-8 border-t border-outline-variant/30">
              <button
                disabled={isSubmitting || !isRevisionFormValid}
                type="submit"
                className={`w-full px-10 py-4 rounded-xl font-headline font-extrabold text-base transition-all flex justify-center items-center gap-2 ${
                  isSubmitting || !isRevisionFormValid
                    ? "opacity-50 cursor-not-allowed bg-surface-container-highest/50 text-white/40"
                    : "bg-[#d5e629] text-[#001809] hover:shadow-[0_0_20px_rgba(213,230,41,0.3)] hover:-translate-y-0.5 active:scale-95"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin" style={{ fontVariationSettings: "'wght' 700" }}>progress_activity</span>
                    <span>Menyimpan Revisi...</span>
                  </>
                ) : (
                  "Submit Revisi Pendaftaran"
                )}
              </button>
            </div>
          </form>
        )}

        <div className="pt-6 border-t border-outline-variant/30 flex justify-end">
           <Link href="/dashboard" className="bg-surface-container-highest text-white border border-outline-variant/40 px-6 py-3 rounded-xl font-headline font-bold text-sm hover:bg-surface-container-highest/60 transition-colors">
              Kembali ke Dashboard
           </Link>
        </div>

      </div>

      <ModalNotify 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
}

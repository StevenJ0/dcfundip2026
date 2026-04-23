"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { submitFullPaper } from "@/app/actions/upload-full-paper";
import { resubmitLKTIRegistration } from "@/app/actions/resubmit-lkti";
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

interface LktiRecord {
  id: string;
  status: string;
  payment_proof_url: string;
  twibbon_url: string;
  ig_proof_url: string;
  abstract_url?: string;
  paper_url?: string;
  team_name?: string;
  paper_title?: string;
  student_card_url: string;
  created_at: string;
  lkti_team_members: {
    member_name: string;
    role: string;
    student_card_url: string;
  }[];
}

export function LktiDetailView({ user, data }: { user: User; data: LktiRecord }) {
  const router = useRouter();
  const [fullPaperFile, setFullPaperFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [teamName, setTeamName] = useState(data.team_name || "");
  const [paperTitle, setPaperTitle] = useState(data.paper_title || "");
  const [member1Name, setMember1Name] = useState("");
  const [member2Name, setMember2Name] = useState("");

  const [abstractFile, setAbstractFile] = useState<File | null>(null);
  const [twibbonFile, setTwibbonFile] = useState<File | null>(null);
  const [instagramFile, setInstagramFile] = useState<File | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  
  const [leaderCardFile, setLeaderCardFile] = useState<File | null>(null);
  const [member1CardFile, setMember1CardFile] = useState<File | null>(null);
  const [member2CardFile, setMember2CardFile] = useState<File | null>(null);

  const [isResubmitting, setIsResubmitting] = useState(false);

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

  console.log(data)


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

  const isRevisionFormValid =
    teamName.trim() !== "" &&
    paperTitle.trim() !== "" &&
    member1Name.trim() !== "" &&
    abstractFile !== null &&
    twibbonFile !== null &&
    instagramFile !== null &&
    paymentFile !== null &&
    leaderCardFile !== null &&
    member1CardFile !== null &&
    (member2Name.trim() === "" || member2CardFile !== null);

  const isRejected = data.status === "REJECTED";
  const isReadOnly = data.status === "PENDING" || data.status === "VERIFIED";

  const handleUploadFullPaper = async () => {
    if (!fullPaperFile) {
      showModal("Gagal", "Pilih file Full Paper terlebih dahulu.", "error");
      return;
    }

    setIsUploading(true);

    try {
      const supabase = createClient();
      const filePath = `lkti/${user.id}/full-paper/${Date.now()}_${fullPaperFile.name}`;
      const { error: fileUploadError } = await supabase.storage.from("dcf_files").upload(filePath, fullPaperFile);

      if (fileUploadError) {
        throw new Error(`Gagal mengunggah file: ${fileUploadError.message}`);
      }

      const { data: uploadData } = supabase.storage.from("dcf_files").getPublicUrl(filePath);
      const submitResult = await submitFullPaper(user.id, uploadData.publicUrl);

      if (!submitResult.success) {
        throw new Error(submitResult.error);
      }

      showModal("Berhasil", "Full Paper berhasil dikumpulkan!", "success");
      setFullPaperFile(null);
      setTimeout(() => {
        setIsModalOpen(false);
        router.refresh();
      }, 2000);
    } catch (err: any) {
      console.error(err);
      showModal("Gagal", err.message || "Terjadi kesalahan saat mengunggah Full Paper.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRevisionFormValid) {
      showModal("Gagal", "Harap lengkapi semua field dan unggah ulang dokumen wajib.", "error");
      return;
    }

    setIsResubmitting(true);

    try {
      const supabase = createClient();

      const uploadFile = async (file: File, folder: string) => {
        const filePath = `lkti/${user.id}/revision/${folder}/${Date.now()}_${file.name}`;
        const { error: fileUploadError } = await supabase.storage.from("dcf_files").upload(filePath, file);
        if (fileUploadError) {
          throw new Error(`Gagal mengunggah ${folder}: ${fileUploadError.message}`);
        }

        const { data: fileData } = supabase.storage.from("dcf_files").getPublicUrl(filePath);
        return fileData.publicUrl;
      };

      const abstractUrl = await uploadFile(abstractFile, "abstrak");
      const twibbonUrl = await uploadFile(twibbonFile, "twibbon");
      const igUrl = await uploadFile(instagramFile, "instagram");
      const paymentUrl = await uploadFile(paymentFile, "bukti-bayar");
      
      const leaderCardUrl = await uploadFile(leaderCardFile, "kartu-pelajar-ketua");
      const member1CardUrl = await uploadFile(member1CardFile, "kartu-pelajar-anggota-1");
      let member2CardUrl = "";
      if (member2Name.trim() !== "" && member2CardFile) {
        member2CardUrl = await uploadFile(member2CardFile, "kartu-pelajar-anggota-2");
      }

      const submitResult = await resubmitLKTIRegistration(
        data.id,
        teamName,
        paperTitle,
        member1Name,
        member2Name,
        abstractUrl,
        twibbonUrl,
        igUrl,
        paymentUrl,
        leaderCardUrl,
        member1CardUrl,
        member2CardUrl
      );

      if (!submitResult.success) {
        throw new Error(submitResult.error);
      }

      showModal("Berhasil", "Revisi pendaftaran berhasil dikirim. Status dikembalikan ke proses verifikasi.", "success");
      setTimeout(() => {
        setIsModalOpen(false);
        router.refresh();
      }, 2000);
    } catch (err: any) {
      console.error(err);
      showModal("Gagal", err.message || "Terjadi kesalahan saat mengirim revisi.", "error");
    } finally {
      setIsResubmitting(false);
    }
  };

  return (
    <div className="bg-surface-container p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

      <div className="relative z-10 space-y-10">
        <div className="flex items-center gap-4 border-b border-outline-variant/30 pb-6">
          <h2 className="text-xl font-headline font-bold text-white">Status Pendaftaran: </h2>
          {data.status === "PENDING" ? (
            <span className="inline-flex bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase">
              Menunggu Verifikasi
            </span>
          ) : data.status === "VERIFIED" ? (
            <span className="inline-flex bg-green-500/20 text-green-300 border border-green-500/30 px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase">
              Terverifikasi
            </span>
          ) : (
            <span className="inline-flex bg-red-500/20 text-red-300 border border-red-500/30 px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase">
              Ditolak
            </span>
          )}
        </div>

        {isRejected && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-5 rounded-2xl font-semibold">
            Pendaftaran Anda Ditolak. Silakan perbaiki data Anda di bawah ini.
          </div>
        )}

        {isReadOnly && (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-headline font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary-container rounded-full"></span>
                  Informasi Tim
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
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-1">Ketua Tim</p>
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
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-1">Asal Instansi</p>
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
                <div className="md:col-span-2">
                  <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-1">Nomor WhatsApp/HP Ketua</p>
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
                {data.team_name && (
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-1">Nama Tim</p>
                    <p className="text-white font-medium">{data.team_name}</p>
                  </div>
                )}
                {data.paper_title && (
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-1">Judul Karya Tulis</p>
                    <p className="text-white font-medium">{data.paper_title}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-headline font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-container rounded-full"></span>
                Informasi Anggota & Identitas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                

                {/* Member Cards */}
                {data.lkti_team_members?.map((member, idx) => (
                  <div key={idx} className="bg-surface-container-highest/30 p-6 rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-4">
                      <IdCard className="text-[#d5e629]" size={28} />
                      <div>
                        <p className="text-xs text-[#d5e629] font-bold uppercase tracking-wider">{member.role}</p>
                        <p className="text-white font-medium truncate">{member.member_name}</p>
                      </div>
                    </div>
                    <div>
                      {member.student_card_url ? (
                        <div className="flex items-center justify-between gap-2 mt-4">
                           <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-1 rounded-md font-semibold">Tersedia</span>
                           <a href={member.student_card_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-surface-container bg-primary-container hover:bg-primary-container/80 transition-colors px-3 py-1.5 rounded-lg">
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
                ))}
              </div>
            </div>

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

                {data.abstract_url && (
                  <div className="bg-surface-container-highest/30 p-6 rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
                    <span className="material-symbols-outlined text-3xl text-[#d5e629] mb-4">description</span>
                    <div>
                      <p className="text-sm font-bold text-white mb-3">Abstrak Karya</p>
                      <a href={data.abstract_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-surface-container bg-primary-container hover:bg-primary-container/80 transition-colors px-4 py-2 rounded-lg">
                        Buka Dokumen <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-headline font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary-container rounded-full"></span>
                Pengumpulan Full Paper
              </h3>

              {data.paper_url ? (
                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">Full Paper Telah Dikumpulkan</h4>
                      <p className="text-sm text-on-surface-variant">Dokumen Full Paper tim Anda telah berhasil diunggah.</p>
                    </div>
                  </div>
                  <a href={data.paper_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap gap-2 text-sm font-bold text-surface-container bg-primary-container hover:bg-primary-container/80 transition-colors px-6 py-3 rounded-xl">
                    Buka Dokumen <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                </div>
              ) : (
                <div className="bg-surface-container-highest/20 p-6 rounded-2xl border border-outline-variant/30">
                  {uploadError && (
                    <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl font-medium text-sm">
                      {uploadError}
                    </div>
                  )}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-on-surface-variant ml-1">
                        Upload Dokumen Full Paper <span className="text-error">*</span>
                      </label>
                      <label className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors group cursor-pointer block text-center min-h-[220px]">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">upload_file</span>
                        <p className="text-white font-medium mb-1">Click to upload Full Paper</p>
                        <p className="text-on-surface-variant text-xs">Hanya jika Anda lolos ke tahap Full Paper. (PDF max. 10MB)</p>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf"
                          onChange={(e) => setFullPaperFile(e.target.files?.[0] || null)}
                        />
                        {fullPaperFile && (
                          <p className="text-primary-container mt-4 text-sm font-bold bg-primary-container/10 px-4 py-2 rounded-lg">
                            {fullPaperFile.name}
                          </p>
                        )}
                      </label>
                    </div>

                    <div className="flex justify-start">
                      <button
                        onClick={handleUploadFullPaper}
                        disabled={isUploading || !fullPaperFile}
                        className="bg-[#d5e629] text-[#001809] px-8 py-3 rounded-xl font-headline font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(213,230,41,0.3)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isUploading ? (
                          <>
                            <span className="material-symbols-outlined animate-spin" style={{ fontVariationSettings: "'wght' 700" }}>progress_activity</span>
                            <span>Mengunggah...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined">cloud_upload</span>
                            <span>Upload Full Paper</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {isRejected && (
          <div className="space-y-6">
            <form onSubmit={handleResubmit} className="space-y-10">
              <div>
                <h3 className="text-xl font-headline font-semibold text-white mb-6 flex items-center gap-2">
                  Form Revisi Pendaftaran LKTI
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface-container-highest/20 p-6 rounded-2xl border border-outline-variant/30">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant">Nama Tim <span className="text-error">*</span></label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                      className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-white text-base focus:ring-2 focus:ring-primary-container transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant">Judul Karya Tulis <span className="text-error">*</span></label>
                    <input
                      type="text"
                      value={paperTitle}
                      onChange={(e) => setPaperTitle(e.target.value)}
                      required
                      className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-white text-base focus:ring-2 focus:ring-primary-container transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant">Nama Anggota 1 <span className="text-error">*</span></label>
                    <input
                      type="text"
                      value={member1Name}
                      onChange={(e) => setMember1Name(e.target.value)}
                      required
                      placeholder="Nama Lengkap Anggota 1"
                      className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-white text-base focus:ring-2 focus:ring-primary-container transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant">Nama Anggota 2 (Opsional)</label>
                    <input
                      type="text"
                      value={member2Name}
                      onChange={(e) => setMember2Name(e.target.value)}
                      placeholder="Nama Lengkap Anggota 2"
                      className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-white text-base focus:ring-2 focus:ring-primary-container transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-headline font-semibold text-white mb-6 flex items-center gap-2">
                  Unggah Ulang Dokumen
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant ml-1">
                      Upload Abstrak (.pdf) <span className="text-error">*</span>
                    </label>
                    <label className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors group cursor-pointer block text-center min-h-[220px]">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">description</span>
                      <p className="text-white font-medium mb-1">Click to upload Abstrak</p>
                      <p className="text-on-surface-variant text-xs">PDF (max. 10MB)</p>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => setAbstractFile(e.target.files?.[0] || null)}
                        required
                      />
                      {abstractFile && (
                        <p className="text-primary-container mt-4 text-sm font-bold bg-primary-container/10 px-4 py-2 rounded-lg">
                          {abstractFile.name}
                        </p>
                      )}
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant ml-1">
                      Bukti Upload Twibbon <span className="text-error">*</span>
                    </label>
                    <label className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors group cursor-pointer block text-center min-h-[220px]">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">frame_person</span>
                      <p className="text-white font-medium mb-1">Click to upload Twibbon</p>
                      <p className="text-on-surface-variant text-xs">PDF, JPG or PNG (max. 10MB)</p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => setTwibbonFile(e.target.files?.[0] || null)}
                        required
                      />
                      {twibbonFile && (
                        <p className="text-primary-container mt-4 text-sm font-bold bg-primary-container/10 px-4 py-2 rounded-lg">
                          {twibbonFile.name}
                        </p>
                      )}
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant ml-1">
                      Bukti Follow Instagram @dcfundip <span className="text-error">*</span>
                    </label>
                    <label className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors group cursor-pointer block text-center min-h-[220px]">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">photo_camera</span>
                      <p className="text-white font-medium mb-1">Click to upload Bukti Follow</p>
                      <p className="text-on-surface-variant text-xs">PDF, JPG or PNG (max. 10MB)</p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => setInstagramFile(e.target.files?.[0] || null)}
                        required
                      />
                      {instagramFile && (
                        <p className="text-primary-container mt-4 text-sm font-bold bg-primary-container/10 px-4 py-2 rounded-lg">
                          {instagramFile.name}
                        </p>
                      )}
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant ml-1">
                      Bukti Pembayaran <span className="text-error">*</span>
                    </label>
                    <label className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors group cursor-pointer block text-center min-h-[220px]">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">payments</span>
                      <p className="text-white font-medium mb-1">Click to upload Bukti Bayar</p>
                      <p className="text-on-surface-variant text-xs">PDF, JPG or PNG (max. 5MB)</p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => setPaymentFile(e.target.files?.[0] || null)}
                        required
                      />
                      {paymentFile && (
                        <p className="text-primary-container mt-4 text-sm font-bold bg-primary-container/10 px-4 py-2 rounded-lg">
                          {paymentFile.name}
                        </p>
                      )}
                    </label>
                  </div>

                  {/* Upload Kartu Pelajar Ketua */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant ml-1">
                      Upload Kartu Pelajar Ketua <span className="text-error">*</span>
                    </label>
                    <label className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors group cursor-pointer block text-center min-h-[220px]">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">badge</span>
                      <p className="text-white font-medium mb-1">Click to upload</p>
                      <p className="text-on-surface-variant text-xs">PDF, JPG or PNG (max. 5MB)</p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => setLeaderCardFile(e.target.files?.[0] || null)}
                      />
                      {leaderCardFile && (
                        <p className="text-primary-container mt-4 text-sm font-bold bg-primary-container/10 px-4 py-2 rounded-lg">
                          {leaderCardFile.name}
                        </p>
                      )}
                    </label>
                  </div>

                  {/* Upload Kartu Pelajar Anggota 1 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant ml-1">
                      Upload Kartu Pelajar Anggota 1 <span className="text-error">*</span>
                    </label>
                    <label className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors group cursor-pointer block text-center min-h-[220px]">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">badge</span>
                      <p className="text-white font-medium mb-1">Click to upload</p>
                      <p className="text-on-surface-variant text-xs">PDF, JPG or PNG (max. 5MB)</p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => setMember1CardFile(e.target.files?.[0] || null)}
                      />
                      {member1CardFile && (
                        <p className="text-primary-container mt-4 text-sm font-bold bg-primary-container/10 px-4 py-2 rounded-lg">
                          {member1CardFile.name}
                        </p>
                      )}
                    </label>
                  </div>

                  {/* Upload Kartu Pelajar Anggota 2 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-on-surface-variant ml-1">
                      Upload Kartu Pelajar Anggota 2 {member2Name.trim() !== "" ? <span className="text-error">*</span> : "(Opsional)"}
                    </label>
                    <label className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors group cursor-pointer block text-center min-h-[220px]">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">badge</span>
                      <p className="text-white font-medium mb-1">Click to upload</p>
                      <p className="text-on-surface-variant text-xs">PDF, JPG or PNG (max. 5MB)</p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => setMember2CardFile(e.target.files?.[0] || null)}
                      />
                      {member2CardFile && (
                        <p className="text-primary-container mt-4 text-sm font-bold bg-primary-container/10 px-4 py-2 rounded-lg">
                          {member2CardFile.name}
                        </p>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  type="submit"
                  disabled={isResubmitting || !isRevisionFormValid}
                  className={`px-8 py-3 rounded-xl font-headline font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isResubmitting || !isRevisionFormValid
                      ? "opacity-50 cursor-not-allowed bg-surface-container-highest/50 text-white/40"
                      : "bg-[#d5e629] text-[#001809] hover:shadow-[0_0_20px_rgba(213,230,41,0.3)] hover:-translate-y-0.5 active:scale-95"
                  }`}
                >
                  {isResubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin" style={{ fontVariationSettings: "'wght' 700" }}>progress_activity</span>
                      <span>Mengirim Revisi...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">upload_file</span>
                      <span>Kirim Revisi Pendaftaran</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
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

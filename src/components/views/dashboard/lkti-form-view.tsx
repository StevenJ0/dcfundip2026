"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { submitLKTIRegistration } from "@/app/actions/register-lkti";
import { ModalNotify } from "@/components/ui/modal-notify";

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

export function LktiFormView({ user }: { user: User }) {
  const router = useRouter();
  
  // Section 1: Leader Profile
  const [leaderName, setLeaderName] = useState(user.user_metadata?.full_name || "");
  const [schoolName, setSchoolName] = useState(user.user_metadata?.school_name || "");
  const [phoneNumber, setPhoneNumber] = useState(user.user_metadata?.phone_number || "");

  // Section 2: Team Data
  const [teamName, setTeamName] = useState("");
  const [paperTitle, setPaperTitle] = useState("");
  const [member1Name, setMember1Name] = useState("");
  const [member2Name, setMember2Name] = useState("");

  // Section 3: Files
  const [abstractFile, setAbstractFile] = useState<File | null>(null);
  const [twibbonFile, setTwibbonFile] = useState<File | null>(null);
  const [instagramFile, setInstagramFile] = useState<File | null>(null);
  const [leaderCardFile, setLeaderCardFile] = useState<File | null>(null);
  const [member1CardFile, setMember1CardFile] = useState<File | null>(null);
  const [member2CardFile, setMember2CardFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error" | "info">("info");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (title: string, message: string, type: "success" | "error" | "info") => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setIsModalOpen(true);
  };

  const isFormValid =
    leaderName.trim() !== "" &&
    schoolName.trim() !== "" &&
    phoneNumber.trim() !== "" &&
    teamName.trim() !== "" &&
    paperTitle.trim() !== "" &&
    member1Name.trim() !== "" &&
    abstractFile !== null &&
    twibbonFile !== null &&
    instagramFile !== null &&
    leaderCardFile !== null &&
    member1CardFile !== null &&
    (member2Name.trim() === "" || member2CardFile !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      showModal("Pendafaran Gagal", "Harap lengkapi semua field yang diwajibkan sebelum submit.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      
      const uploadFile = async (file: File, folder: string) => {
        const filePath = `lkti/${user.id}/${folder}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("dcf_files")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Gagal mengunggah ${folder}: ${uploadError.message}`);
        }

        const { data } = supabase.storage.from("dcf_files").getPublicUrl(filePath);
        return data.publicUrl;
      };

      // Sequentially upload to avoid overwhelming the connection
      const abstractUrl = await uploadFile(abstractFile, "abstrak");
      const twibbonUrl = await uploadFile(twibbonFile, "twibbon");
      const igUrl = await uploadFile(instagramFile, "instagram");
      
      const leaderCardUrl = await uploadFile(leaderCardFile, "kartu-pelajar-ketua");
      const member1CardUrl = await uploadFile(member1CardFile, "kartu-pelajar-anggota-1");
      let member2CardUrl = "";
      if (member2Name.trim() !== "" && member2CardFile) {
        member2CardUrl = await uploadFile(member2CardFile, "kartu-pelajar-anggota-2");
      }

      // Insert to Database via Server Action
      const submitResult = await submitLKTIRegistration(
        user.id,
        leaderName,
        schoolName,
        phoneNumber,
        teamName,
        paperTitle,
        member1Name,
        member2Name,
        abstractUrl,
        twibbonUrl,
        igUrl,
        leaderCardUrl,
        member1CardUrl,
        member2CardUrl
      );

      if (!submitResult.success) {
        throw new Error(submitResult.error);
      }

      // Show success modal FIRST, keep button disabled during redirect delay
      setIsRedirecting(true);
      setIsSubmitting(false);
      showModal("Pendaftaran Berhasil! 🎉", "Pendaftaran LKTI Anda berhasil dikirim! Anda akan diarahkan ke dashboard.", "success");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2500);
      
    } catch (err: any) {
      console.error(err);
      showModal("Gagal", err.message || "Terjadi kesalahan saat memproses pendaftaran.", "error");
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="bg-surface-container p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      {/* Subtle Decorative Background Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-headline font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-2 h-2 bg-primary-container rounded-full"></span>
          Formulir Pendaftaran LKTI
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* SECTION 1: DATA KETUA */}
          <div>
             <h3 className="text-xl font-headline font-semibold text-white mb-6 flex items-center gap-2">
                Data Ketua Tim
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface-container-highest/20 p-6 rounded-2xl border border-outline-variant/30">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-on-surface-variant">Nama Lengkap (Ketua)</label>
                 <span className="text-xs text-on-surface-variant/70 -mt-2 block mb-2">Pastikan nama sesuai untuk keperluan e-sertifikat.</span>
                 <input
                   type="text"
                   value={leaderName}
                   onChange={(e) => setLeaderName(e.target.value)}
                   required
                   className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-white text-base focus:ring-2 focus:ring-primary-container transition-all"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2">Email Ketua (Tetap)</label>
                 <input
                   disabled
                   type="email"
                   value={user.email || ""}
                   className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-white text-base opacity-50 cursor-not-allowed"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-on-surface-variant">Asal Sekolah/Instansi</label>
                 <input
                   type="text"
                   value={schoolName}
                   onChange={(e) => setSchoolName(e.target.value)}
                   required
                   className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-white text-base focus:ring-2 focus:ring-primary-container transition-all"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-on-surface-variant">Nomor Telepon (WhatsApp)</label>
                 <input
                   type="text"
                   value={phoneNumber}
                   onChange={(e) => setPhoneNumber(e.target.value)}
                   required
                   className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-white text-base focus:ring-2 focus:ring-primary-container transition-all"
                 />
               </div>
             </div>
          </div>

          {/* SECTION 2: DATA TIM & KARYA */}
          <div>
            <h3 className="text-xl font-headline font-semibold text-white mb-6 flex items-center gap-2">
                Data Tim & Anggota
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface-container-highest/20 p-6 rounded-2xl border border-outline-variant/30">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-on-surface-variant">Nama Tim <span className="text-error">*</span></label>
                 <input
                   type="text"
                   value={teamName}
                   onChange={(e) => setTeamName(e.target.value)}
                   required
                   placeholder="Contoh: Sang Juara Team"
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
                   placeholder="Masukkan Judul Inovasi Anda"
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

          {/* SECTION 3: DOKUMEN */}
          <div>
            <h3 className="text-xl font-headline font-semibold text-white mb-6 flex items-center gap-2">
                Dokumen Persyaratan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Abstrak PDF */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant ml-1">
                  Upload Abstrak (.pdf) <span className="text-error">*</span>
                </label>
                <label className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors group cursor-pointer block text-center min-h-[220px]">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">
                    description
                  </span>
                  <p className="text-white font-medium mb-1">Click to upload Abstrak</p>
                  <p className="text-on-surface-variant text-xs">PDF (max. 10MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => setAbstractFile(e.target.files?.[0] || null)}
                  />
                  {abstractFile && (
                    <p className="text-primary-container mt-4 text-sm font-bold bg-primary-container/10 px-4 py-2 rounded-lg">
                      {abstractFile.name}
                    </p>
                  )}
                </label>
              </div>


              {/* Upload Twibbon */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant ml-1">
                  Bukti Upload Twibbon <span className="text-error">*</span><br/>
                  <span className="text-xs opacity-70">(Ketua & Semua Anggota digabung dlm 1 file)</span>
                </label>
                <label className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors group cursor-pointer block text-center min-h-[220px]">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">
                    frame_person
                  </span>
                  <p className="text-white font-medium mb-1">Click to upload Twibbon</p>
                  <p className="text-on-surface-variant text-xs">PDF, JPG or PNG (max. 10MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => setTwibbonFile(e.target.files?.[0] || null)}
                  />
                  {twibbonFile && (
                    <p className="text-primary-container mt-4 text-sm font-bold bg-primary-container/10 px-4 py-2 rounded-lg">
                      {twibbonFile.name}
                    </p>
                  )}
                </label>
              </div>

              {/* Upload IG */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant ml-1">
                  Bukti Follow Instagram @dcfundip <span className="text-error">*</span><br/>
                  <span className="text-xs opacity-70">(Ketua & Semua Anggota digabung dlm 1 file)</span>
                </label>
                <label className="w-full border-2 border-dashed border-outline-variant rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-surface-container-high transition-colors group cursor-pointer block text-center min-h-[220px]">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">
                    photo_camera
                  </span>
                  <p className="text-white font-medium mb-1">Click to upload Bukti Follow</p>
                  <p className="text-on-surface-variant text-xs">PDF, JPG or PNG (max. 10MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => setInstagramFile(e.target.files?.[0] || null)}
                  />
                  {instagramFile && (
                    <p className="text-primary-container mt-4 text-sm font-bold bg-primary-container/10 px-4 py-2 rounded-lg">
                      {instagramFile.name}
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
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">
                    badge
                  </span>
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
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">
                    badge
                  </span>
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
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 group-hover:text-primary-container transition-colors">
                    badge
                  </span>
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

          <div className="flex flex-col md:flex-row items-center gap-6 pt-8 border-t border-outline-variant/30">
            <button
              disabled={isSubmitting || isRedirecting || !isFormValid}
              type="submit"
              className={`w-full md:w-auto px-10 py-4 rounded-xl font-headline font-extrabold text-base transition-all flex justify-center items-center gap-2 ${
                isSubmitting || isRedirecting || !isFormValid 
                  ? "opacity-50 cursor-not-allowed bg-surface-container-highest/50 text-white/40" 
                  : "bg-[#d5e629] text-[#001809] hover:shadow-[0_0_20px_rgba(213,230,41,0.3)] hover:-translate-y-0.5 active:scale-95"
              }`}
            >
              {isRedirecting ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontVariationSettings: "'wght' 700" }}>progress_activity</span>
                  <span>Mengalihkan...</span>
                </>
              ) : isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontVariationSettings: "'wght' 700" }}>progress_activity</span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                "Submit Pendaftaran LKTI"
              )}
            </button>
          </div>
        </form>
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

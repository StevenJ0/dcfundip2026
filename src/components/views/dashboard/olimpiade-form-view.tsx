"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { submitOlimpiadeRegistration } from "@/app/actions/register-olimpiade";
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

export function OlimpiadeFormView({ user }: { user: User }) {
  const router = useRouter();
  
  const [pembayaranFile, setPembayaranFile] = useState<File | null>(null);
  const [twibbonFile, setTwibbonFile] = useState<File | null>(null);
  const [studentCardFile, setStudentCardFile] = useState<File | null>(null);
  const [instagramFile, setInstagramFile] = useState<File | null>(null);
  
  const [fullName, setFullName] = useState(user.user_metadata?.full_name || "");
  const [schoolName, setSchoolName] = useState(user.user_metadata?.school_name || "");
  const [phoneNumber, setPhoneNumber] = useState(user.user_metadata?.phone_number || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    fullName.trim() !== "" &&
    schoolName.trim() !== "" &&
    phoneNumber.trim() !== "" &&
    pembayaranFile !== null &&
    twibbonFile !== null &&
    studentCardFile !== null &&
    instagramFile !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      showModal("Gagal", "Harap lengkapi semua field dan unggah dokumen yang diwajibkan.", "error");
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

      // Sequentially upload to avoid overwhelming the connection
      const twibbonUrl = await uploadFile(twibbonFile, "twibbon");
      const studentCardUrl = await uploadFile(studentCardFile, "kartu-pelajar");
      const igUrl = await uploadFile(instagramFile, "instagram");
      const paymentUrl = await uploadFile(pembayaranFile, "bukti-bayar");

      // Insert to Database via Server Action
      const submitResult = await submitOlimpiadeRegistration(
        user.id,
        fullName,
        schoolName,
        phoneNumber,
        twibbonUrl,
        studentCardUrl,
        igUrl,
        paymentUrl
      );

      if (!submitResult.success) {
        throw new Error(submitResult.error);
      }

      // 1. Matikan dulu efek loading-nya agar tombol kembali normal
      setIsSubmitting(false);

      // 2. Beri jeda/feedback ke user
      showModal("Berhasil", "Pendaftaran Olimpiade berhasil!", "success");

      // 3. Pindah halaman
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
      
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
          Informasi Peserta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Read Only Data Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface-container-highest/20 p-6 rounded-2xl border border-outline-variant/30">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                Nama Lengkap
              </label>
              <span className="text-xs text-on-surface-variant/70 -mt-2 block mb-2">
                Pastikan nama sesuai untuk keperluan e-sertifikat.
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-white focus:ring-2 focus:ring-primary-container transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">lock</span> Email
              </label>
              <input
                disabled
                type="text"
                value={user.email || ""}
                className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-white opacity-50 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                Asal Sekolah/Instansi
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-white focus:ring-2 focus:ring-primary-container transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                Nomor Telepon
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-white focus:ring-2 focus:ring-primary-container transition-all"
              />
            </div>
          </div>

          <h2 className="text-2xl font-headline font-bold text-white mb-8 flex items-center gap-3 pt-4">
            <span className="w-2 h-2 bg-primary-container rounded-full"></span>
            Dokumen Persyaratan
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
              disabled={isSubmitting || !isFormValid}
              type="submit"
              className={`w-full md:w-auto px-10 py-4 rounded-xl font-headline font-extrabold text-base transition-all flex justify-center items-center gap-2 ${
                isSubmitting || !isFormValid
                  ? "opacity-50 cursor-not-allowed bg-surface-container-highest/50 text-white/40"
                  : "bg-[#d5e629] text-[#001809] hover:shadow-[0_0_20px_rgba(213,230,41,0.3)] hover:-translate-y-0.5 active:scale-95"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontVariationSettings: "'wght' 700" }}>progress_activity</span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                "Submit Pendaftaran"
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

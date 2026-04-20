"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/app/actions/update-profile";

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

export function ProfileView({ user }: { user: User }) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [fullName, setFullName] = useState(user.user_metadata?.full_name || "");
  const [schoolName, setSchoolName] = useState(user.user_metadata?.school_name || "");
  const [phoneNumber, setPhoneNumber] = useState(user.user_metadata?.phone_number || "");

  const displayFullName = user.user_metadata?.full_name || "Peserta DCF";
  const initial = displayFullName.charAt(0).toUpperCase();

  const handleSave = async () => {
    if (!fullName || !schoolName || !phoneNumber) {
      setErrorMsg("Harap isi semua kolom data personal.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const result = await updateUserProfile(fullName, schoolName, phoneNumber);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      setIsEditing(false);
      alert("Profil berhasil diperbarui!");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset state back to initial on cancel
    setFullName(user.user_metadata?.full_name || "");
    setSchoolName(user.user_metadata?.school_name || "");
    setPhoneNumber(user.user_metadata?.phone_number || "");
    setErrorMsg(null);
    setIsEditing(false);
  };

  return (
    <div className="w-full px-8 py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-headline font-bold text-primary tracking-tight mb-2">
          Profil Akun
        </h1>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Detail informasi akun yang terdaftar pada sistem DCF 2026.
        </p>
      </header>

      <div className="bg-surface-container p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="relative z-10 space-y-12">
          {/* Avatar & Header Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-outline-variant/30 pb-10">
            <div className="w-28 h-28 bg-primary-container text-surface-container rounded-full flex items-center justify-center text-5xl font-headline font-bold shadow-xl shrink-0">
              {initial}
            </div>
            <div className="text-center md:text-left space-y-2 mt-2">
              <h2 className="text-3xl font-headline font-bold text-white tracking-wide">
                {displayFullName}
              </h2>
              <p className="text-on-surface-variant font-medium text-lg">
                Peserta DCF 2026
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 bg-error-container text-on-error-container rounded-xl font-medium text-sm">
              {errorMsg}
            </div>
          )}

          {/* Data Grid Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-headline font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-container rounded-full"></span>
              Data Personal
            </h3>
            
            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface-container-highest/20 p-8 rounded-2xl border border-outline-variant/30">
                <div className="space-y-2">
                  <label className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                    Nama Lengkap
                  </label>
                  <div className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl py-4 px-6 text-white/90">
                    {user.user_metadata?.full_name || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                    Alamat Email
                  </label>
                  <div className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl py-4 px-6 text-white/90 opacity-80">
                    {user.email || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                    Asal Sekolah/Instansi
                  </label>
                  <div className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl py-4 px-6 text-white/90">
                    {user.user_metadata?.school_name || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                    Nomor Telepon
                  </label>
                  <div className="w-full bg-surface-container-highest/50 border border-outline-variant/20 rounded-xl py-4 px-6 text-white/90">
                    {user.user_metadata?.phone_number || "-"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface-container-highest/20 p-8 rounded-2xl border border-outline-variant/30">
                <div className="space-y-2">
                  <label className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-white focus:ring-2 focus:ring-primary-container transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
                    Alamat Email (Tidak Dapat Diubah)
                  </label>
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-6 text-white opacity-50 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
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
                  <label className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
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
            )}
          </div>

          {/* Action Section */}
          <div className="pt-8 flex flex-col items-start gap-4 border-t border-outline-variant/20">
             {!isEditing ? (
                 <button
                   onClick={() => setIsEditing(true)}
                   className="bg-surface-container-highest text-white border border-outline-variant/30 hover:border-primary-container/50 px-8 py-3.5 rounded-xl font-headline font-bold text-sm transition-all flex items-center gap-2 hover:-translate-y-0.5 active:scale-95"
                 >
                   <span className="material-symbols-outlined text-[18px]">edit</span>
                   Ubah Profil
                 </button>
             ) : (
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                   <button
                     onClick={handleCancel}
                     disabled={isSubmitting}
                     className="bg-transparent text-white border border-outline-variant hover:bg-surface-container-highest px-8 py-3.5 rounded-xl font-headline font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                   >
                     <span className="material-symbols-outlined text-[18px]">close</span>
                     Batal
                   </button>
                   <button
                     onClick={handleSave}
                     disabled={isSubmitting}
                     className="bg-[#d5e629] text-[#001809] px-8 py-3.5 rounded-xl font-headline font-extrabold text-sm transition-all hover:shadow-[0_0_20px_rgba(213,230,41,0.3)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                   >
                     {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                          Menyimpan...
                        </>
                     ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">save</span>
                          Simpan Perubahan
                        </>
                     )}
                   </button>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

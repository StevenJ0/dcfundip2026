"use client"

import { useState } from "react";
import { updateUserRole } from "@/app/actions/admin-actions";
import { Search, Loader2, ShieldCheck, User as UserIcon, ShieldAlert, ArrowRightLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ModalConfirmation } from "@/components/ui/modal-confirmation";
import { ModalNotify } from "@/components/ui/modal-notify";

interface UserItem {
  id: string;
  email: string;
  full_name?: string;
  school_name?: string;
  role: string;
}

export function UserClientTable({ initialData, currentUser }: { initialData: UserItem[], currentUser: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<UserItem | null>(null);
  const [actionType, setActionType] = useState<"promote" | "demote" | null>(null);
  const [notifyConfig, setNotifyConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });
  const router = useRouter();

  const filteredData = initialData.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setTargetUser(null);
    setActionType(null);
  };

  const handleRoleToggle = (user: UserItem) => {
    if (user.id === currentUser?.id) {
      setNotifyConfig({
        isOpen: true,
        title: "Aksi Ditolak",
        message: "Anda tidak dapat mengubah role Anda sendiri untuk mencegah penguncian akun (self-lockout).",
        type: "error",
      });
      return;
    }

    setTargetUser(user);
    setActionType(user.role === "admin" ? "demote" : "promote");
    setIsModalOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!targetUser || !actionType) return;

    const newRole = actionType === "promote" ? "admin" : "peserta";
    setLoadingId(targetUser.id);

    try {
      const res = await updateUserRole(targetUser.id, newRole);
      if (res.success) {
        closeModal();
        router.refresh();
      } else {
        setNotifyConfig({
          isOpen: true,
          title: "Gagal Mengubah Role",
          message: res.error || "Terjadi kesalahan saat memperbarui role.",
          type: "error",
        });
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 backdrop-blur-sm">
        <div className="relative w-full md:w-[400px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/40 group-focus-within:text-blue-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search users by name or email..."
            className="w-full bg-[#001809] border border-[#345118] text-[#cbead1] pl-12 pr-4 py-3 rounded-xl focus:ring-1 focus:ring-blue-400 focus:outline-none placeholder:text-blue-400/20 text-sm font-['Space_Grotesk']"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-[10px] font-black text-blue-400/60 uppercase tracking-widest px-4 py-2 border border-blue-500/20 rounded-lg bg-[#001809]">
           {filteredData.length} Users Indexed
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#0a2510] border border-[#345118]/20 rounded-[40px] overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-spacing-0">
              <thead>
                <tr className="border-b border-[#345118]/10 bg-[#001809]/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/40">Identitas Pengguna</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/40">Asal Instansi / Sekolah</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/40">Otoritas</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/40 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? filteredData.map((user) => {
                  const isSelf = user.id === currentUser?.id;
                  return (
                    <tr key={user.id} className={`group transition-colors border-b border-[#345118]/10 last:border-0 ${isSelf ? "bg-blue-400/[0.03]" : "hover:bg-[#345118]/10"}`}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border ${isSelf ? "bg-blue-400/20 border-blue-400/50 text-blue-400" : "bg-[#345118]/40 border-[#345118] text-[#d5e629]"}`}>
                             {user.full_name?.[0] || user.email[0].toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-headline font-bold text-sm tracking-tight flex items-center gap-2">
                               {user.full_name || "User Tanpa Nama"}
                               {isSelf && <span className="bg-blue-400/20 text-blue-400 text-[8px] px-1.5 py-0.5 rounded uppercase font-black">ANDA</span>}
                            </span>
                            <span className="text-[10px] font-mono text-[#cbead1]/40 tracking-wider lowercase">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[#cbead1] text-xs font-['Space_Grotesk'] font-medium opacity-70">
                           {user.school_name || "Tidak ada data instansi"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           {user.role === "admin" ? (
                              <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-full text-[9px] font-black text-blue-400 tracking-widest uppercase">
                                 <ShieldCheck size={12} className="text-blue-400" /> ADMINISTRATOR
                              </div>
                           ) : (
                              <div className="flex items-center gap-1.5 bg-[#345118]/20 border border-[#345118]/30 px-3 py-1.5 rounded-full text-[9px] font-black text-[#cbead1] tracking-widest uppercase">
                                 <UserIcon size={12} className="text-[#cbead1]/40" /> PESERTA
                              </div>
                           )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                           {loadingId === user.id ? (
                               <Loader2 size={16} className="animate-spin text-blue-400" />
                           ) : (
                               <button 
                                  onClick={() => handleRoleToggle(user)}
                                  disabled={isSelf}
                                  className={`group/role flex items-center gap-3 px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                                    isSelf 
                                      ? "opacity-20 cursor-not-allowed bg-gray-500/10 text-white grayscale" 
                                      : user.role === "admin"
                                        ? "bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400/20"
                                        : "bg-blue-400/10 text-blue-400 border border-blue-400/20 hover:bg-blue-400/20"
                                  }`}
                               >
                                  {user.role === "admin" ? (
                                     <>
                                        <ShieldAlert size={14} className="group-hover/role:rotate-12 transition-transform" /> DEMOTE TO PESERTA
                                     </>
                                  ) : (
                                     <>
                                        <ArrowRightLeft size={14} className="group-hover/role:rotate-180 transition-transform duration-500" /> PROMOTE TO ADMIN
                                     </>
                                  )}
                               </button>
                           )}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center opacity-30">
                       <p className="text-lg font-bold font-headline">No users found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </div>

      <ModalConfirmation
        isOpen={isModalOpen && !!targetUser && !!actionType}
        onClose={closeModal}
        onConfirm={confirmRoleChange}
        title="Konfirmasi Perubahan Otoritas"
        message={`Apakah Anda yakin ingin mengubah role ${targetUser?.full_name || targetUser?.email || "pengguna ini"} menjadi ${actionType === "demote" ? "PESERTA" : "ADMIN"}?`}
        confirmText="Ya, Ubah Role"
        cancelText="Batal"
        actionType={actionType === "demote" ? "danger" : "primary"}
        isLoading={!!targetUser && loadingId === targetUser.id}
      />

      <ModalNotify
        isOpen={notifyConfig.isOpen}
        onClose={() => setNotifyConfig((prev) => ({ ...prev, isOpen: false }))}
        title={notifyConfig.title}
        message={notifyConfig.message}
        type={notifyConfig.type}
      />
    </div>
  );
}

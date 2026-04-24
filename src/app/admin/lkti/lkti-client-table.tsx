"use client"

import { useState } from "react";
import { updateLktiStatus } from "@/app/actions/admin-actions";
import { Search, ExternalLink, Check, X, Loader2, Filter, FileText, Download, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { CiInstagram } from "react-icons/ci";
import { AdminDetailModal } from "@/components/ui/admin-detail-modal";
import { ModalConfirmation } from "@/components/ui/modal-confirmation";
import { ModalNotify } from "@/components/ui/modal-notify";

interface LktiItem {
  id: string;
  team_name: string;
  user_id: string;
  status: string;
  payment_proof_url?: string;
  twibbon_url: string;
  ig_proof_url: string;
  abstract_url?: string;
  paper_url?: string;
  student_card_url: string;
  created_at: string;
  users: {
    full_name: string;
    email: string;
    school_name?: string;
    phone_number?: string;
  };
  lkti_team_members: {
    member_name: string;
    role: string;
    student_card_url: string;
  }[];
}

export function LktiClientTable({ initialData }: { initialData: LktiItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<LktiItem | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [targetName, setTargetName] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"ABSTRAK_PASSED" | "ABSTRAK_REJECTED" | "FINAL_VERIFIED" | "FULLPAPER_REJECTED" | null>(null);
  const [activeTab, setActiveTab] = useState<"SELEKSI_ABSTRAK" | "VERIFIKASI_FINAL">("SELEKSI_ABSTRAK");
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

  const filteredData = initialData.filter(item => {
    const matchesSearch = item.team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.users?.school_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeTab === "SELEKSI_ABSTRAK") {
      return ["ABSTRAK_PENDING", "ABSTRAK_REJECTED", "ABSTRAK_PASSED"].includes(item.status);
    } else {
      return ["FULLPAPER_PENDING", "FULLPAPER_REJECTED", "FINAL_VERIFIED"].includes(item.status);
    }
  });

  const handleStatusUpdate = (id: string, name: string, newStatus: "ABSTRAK_PASSED" | "ABSTRAK_REJECTED" | "FINAL_VERIFIED" | "FULLPAPER_REJECTED") => {
    setTargetId(id);
    setTargetName(name);
    setActionType(newStatus);
    setIsConfirmModalOpen(true);
  };

  const executeStatusUpdate = async () => {
    if (!targetId || !actionType) return;

    setLoadingId(targetId);
    const res = await updateLktiStatus(targetId, actionType);
    if (res.success) {
      setIsConfirmModalOpen(false);
      setTargetId(null);
      setTargetName(null);
      setActionType(null);
      setSelectedTeam(null);
      router.refresh();
    } else {
      setNotifyConfig({
        isOpen: true,
        title: "Gagal Memperbarui Status",
        message: res.error || "Terjadi kesalahan saat memperbarui status.",
        type: "error",
      });
    }
    setLoadingId(null);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setTargetId(null);
    setTargetName(null);
    setActionType(null);
  };

  const isConfirmLoading = !!targetId && loadingId === targetId;

  const renderStatusBadge = (status: string) => {
    if (status.includes("PENDING")) {
      return (
        <div className="flex items-center justify-center gap-2 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1.5 rounded-full text-[10px] font-black text-yellow-400 uppercase tracking-wider w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div>
          {status.replace("_", " ")}
        </div>
      );
    }

    if (status.includes("PASSED") || status === "FINAL_VERIFIED") {
      return (
        <div className="flex items-center justify-center gap-2 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full text-[10px] font-black text-green-400 uppercase tracking-wider w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
          {status.replace("_", " ")}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 bg-red-400/10 border border-red-400/20 px-3 py-1.5 rounded-full text-[10px] font-black text-red-400 uppercase tracking-wider w-fit">
        <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
        {status.replace("_", " ")}
      </div>
    );
  };

  // Helper untuk render tombol dokumen (seragam)
  const renderDocButton = (url: string | undefined | null, icon: React.ReactNode, title: string, colorClass: string) => {
    if (!url) {
      return (
        <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-white/20 mx-auto" title={`${title} (Belum Ada)`}>
          <span className="opacity-50">-</span>
        </span>
      );
    }
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all mx-auto ${colorClass}`}
        title={title}
      >
        {icon}
      </a>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#345118]/30 pb-4">
        <button
          onClick={() => setActiveTab("SELEKSI_ABSTRAK")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === "SELEKSI_ABSTRAK"
              ? "bg-[#d5e629] text-[#001809]"
              : "bg-[#0a2510]/40 text-[#cbead1]/60 hover:text-[#cbead1]"
          }`}
        >
          Tahap 1: Seleksi Abstrak
        </button>
        <button
          onClick={() => setActiveTab("VERIFIKASI_FINAL")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === "VERIFIKASI_FINAL"
              ? "bg-[#d5e629] text-[#001809]"
              : "bg-[#0a2510]/40 text-[#cbead1]/60 hover:text-[#cbead1]"
          }`}
        >
          Tahap 2: Verifikasi Final
        </button>
      </div>

      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0a2510]/40 p-4 rounded-2xl border border-[#345118]/20 backdrop-blur-sm">
        <div className="relative w-full md:w-[400px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cbead1] opacity-40 group-focus-within:text-[#d5e629] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Cari Nama Tim, Ketua, atau Instansi..."
            className="w-full bg-[#001809] border border-[#345118] text-[#cbead1] pl-12 pr-4 py-3 rounded-xl focus:ring-1 focus:ring-[#d5e629] focus:outline-none placeholder:text-[#cbead1]/30 text-sm font-['Space_Grotesk']"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border border-[#345118]/30 rounded-xl bg-[#001809]">
           <Filter size={14} className="text-[#d5e629]" />
           <span className="text-[10px] font-bold text-[#cbead1]/60 uppercase tracking-widest">{filteredData.length} Teams found</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#0a2510]/60 border border-[#345118]/20 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
         <div className="overflow-x-auto pb-4 w-full">
            <table className="w-full text-left border-collapse border-spacing-0 whitespace-nowrap min-w-max">
              <thead className="hidden lg:table-header-group">
                <tr className="border-b border-[#345118]/10 bg-[#001809]/80">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40 text-center">No</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40">Info Tim</th>
                  <th className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40 text-center">Abstrak</th>
                  {activeTab === "VERIFIKASI_FINAL" && (
                    <th className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40 text-center">Bayar</th>
                  )}
                  <th className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40 text-center">Kartu Ketua</th>
                  <th className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40 text-center">Twibbon</th>
                  <th className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40 text-center">IG</th>
                  {activeTab === "VERIFIKASI_FINAL" && (
                    <th className="px-4 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40 text-center">Full Paper</th>
                  )}
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40 text-center">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40 text-center">Verifikasi</th>
                </tr>
              </thead>
              <tbody className="block lg:table-row-group p-4 lg:p-0">
                {filteredData.length > 0 ? filteredData.map((item, index) => (
                  <tr key={item.id} className="block lg:table-row group hover:bg-[#345118]/10 transition-colors lg:border-b border-[#345118]/10 last:border-0 mb-4 lg:mb-0 border border-white/10 lg:border-x-0 lg:border-t-0 rounded-2xl lg:rounded-none p-4 lg:p-0">
                    
                    {/* Kolom No (Desktop) */}
                    <td className="hidden lg:table-cell px-6 py-5 text-center align-middle">
                       <span className="text-[10px] font-mono text-[#cbead1]/40">{index + 1}</span>
                    </td>

                    {/* Kolom Info Tim (Desktop & Mobile) */}
                    <td className="block lg:table-cell px-6 py-5 align-middle">
                      <div className="flex flex-col">
                        <span className="text-white font-headline font-bold text-sm tracking-tight uppercase">{item.team_name}</span>
                        <div className="flex flex-col mt-1 space-y-1">
                          {item.lkti_team_members?.map((member, idx) => (
                            <span key={idx} className="text-[10px] font-medium text-[#cbead1]/60 tracking-wide">
                              {member.role}: <span className="text-white">{member.member_name}</span>
                            </span>
                          ))}
                        </div>
                        <span className="text-[#cbead1] text-[10px] font-['Space_Grotesk'] mt-2">{item.users?.school_name || "Instansi Tidak Diketahui"}</span>
                      </div>
                    </td>

                    {/* GRUP DOKUMEN KHUSUS MOBILE (Sembunyi di Desktop) */}
                    <td className="block lg:hidden px-6 py-3 border-t border-white/5 mt-3">
                      <span className="text-[9px] font-black text-[#d5e629]/40 uppercase tracking-widest block mb-2">Dokumen Tim</span>
                      <div className="flex gap-2 flex-wrap">
                        {renderDocButton(item.abstract_url, <FileText size={14} />, "Abstrak", "bg-purple-400/10 border border-purple-400/30 text-purple-400 hover:bg-purple-400 hover:text-white")}
                        {activeTab === "VERIFIKASI_FINAL" && renderDocButton(item.payment_proof_url, <ExternalLink size={14} />, "Bukti Bayar", "bg-[#345118]/20 border border-[#345118] text-[#d5e629] hover:bg-[#d5e629] hover:text-[#001809]")}
                        {renderDocButton(item.student_card_url, <span className="font-bold text-[10px]">K</span>, "Kartu Ketua", "bg-[#345118]/20 border border-[#345118] text-[#d5e629] hover:bg-white hover:text-[#001809]")}
                        {renderDocButton(item.twibbon_url, <span className="font-bold text-[10px]">T</span>, "Twibbon", "bg-[#345118]/20 border border-[#345118] text-[#d5e629] hover:bg-white hover:text-[#001809]")}
                        {renderDocButton(item.ig_proof_url, <CiInstagram size={14} />, "Instagram", "bg-[#345118]/20 border border-[#345118] text-[#d5e629] hover:bg-white hover:text-[#001809]")}
                        {activeTab === "VERIFIKASI_FINAL" && renderDocButton(item.paper_url, <Download size={14} />, "Full Paper", "bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-400 hover:text-white")}
                      </div>
                    </td>

                    {/* KOLOM DOKUMEN TERPISAH (Desktop Saja) */}
                    <td className="hidden lg:table-cell px-4 py-5 align-middle">
                      {renderDocButton(item.abstract_url, <FileText size={16} />, "Abstrak", "bg-purple-400/10 border border-purple-400/30 text-purple-400 hover:bg-purple-400 hover:text-white")}
                    </td>
                    {activeTab === "VERIFIKASI_FINAL" && (
                      <td className="hidden lg:table-cell px-4 py-5 align-middle">
                        {renderDocButton(item.payment_proof_url, <ExternalLink size={16} />, "Bukti Bayar", "bg-[#345118]/20 border border-[#345118] text-[#d5e629] hover:bg-[#d5e629] hover:text-[#001809]")}
                      </td>
                    )}
                    <td className="hidden lg:table-cell px-4 py-5 align-middle">
                      {renderDocButton(item.student_card_url, <span className="font-bold text-[12px]">K</span>, "Kartu Ketua", "bg-[#345118]/20 border border-[#345118] text-[#d5e629] hover:bg-white hover:text-[#001809]")}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-5 align-middle">
                      {renderDocButton(item.twibbon_url, <span className="font-bold text-[12px]">T</span>, "Twibbon", "bg-[#345118]/20 border border-[#345118] text-[#d5e629] hover:bg-white hover:text-[#001809]")}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-5 align-middle">
                      {renderDocButton(item.ig_proof_url, <CiInstagram size={16} />, "Instagram", "bg-[#345118]/20 border border-[#345118] text-[#d5e629] hover:bg-gradient-to-tr hover:from-orange-500 hover:via-pink-500 hover:to-purple-500 hover:text-white hover:border-transparent")}
                    </td>
                    {activeTab === "VERIFIKASI_FINAL" && (
                      <td className="hidden lg:table-cell px-4 py-5 align-middle">
                        {renderDocButton(item.paper_url, <Download size={16} />, "Full Paper", "bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-400 hover:text-white")}
                      </td>
                    )}

                    {/* Kolom Status */}
                    <td className="block lg:table-cell px-6 py-5 align-middle">
                      <div className="flex flex-col lg:items-center gap-2">
                        <span className="text-[9px] font-black text-[#d5e629]/40 uppercase tracking-widest lg:hidden mb-1 mt-3">Status Verifikasi</span>
                        {renderStatusBadge(item.status)}
                      </div>
                    </td>

                    {/* Kolom Aksi Verifikasi */}
                    <td className="block lg:table-cell px-6 py-5 align-middle">
                      <div className="flex lg:justify-center items-center gap-2 mt-4 lg:mt-0 pt-4 lg:pt-0 border-t border-white/5 lg:border-t-0">
                        {loadingId === item.id ? (
                          <div className="flex items-center gap-2 py-2 text-[#d5e629] text-[10px] font-bold mx-auto">
                             <Loader2 size={14} className="animate-spin" /> Memproses...
                          </div>
                        ) : (
                          <div className="flex gap-2 w-full lg:w-auto flex-wrap justify-end lg:justify-center">
                            <button
                              onClick={() => setSelectedTeam(item)}
                              className="flex-1 lg:flex-none px-3 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all bg-[#d5e629]/10 text-[#d5e629] border border-[#d5e629]/30 hover:bg-[#d5e629] hover:text-[#001809]"
                            >
                              <Eye size={14} strokeWidth={2.5} /> DETAIL
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(item.id, item.team_name, activeTab === "SELEKSI_ABSTRAK" ? "ABSTRAK_PASSED" : "FINAL_VERIFIED")}
                              disabled={item.status === "ABSTRAK_PASSED" || item.status === "FINAL_VERIFIED"}
                              className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                                item.status === "ABSTRAK_PASSED" || item.status === "FINAL_VERIFIED"
                                  ? "bg-green-400/10 text-green-400/30 border border-green-400/10 cursor-not-allowed"
                                  : "bg-green-400/10 text-green-400 border border-green-400/30 hover:bg-green-400 hover:text-[#001809] hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]"
                              }`}
                            >
                              <Check size={14} strokeWidth={3} /> {activeTab === "SELEKSI_ABSTRAK" ? "LOLOS ABSTRAK" : "VERIFY"}
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(item.id, item.team_name, activeTab === "SELEKSI_ABSTRAK" ? "ABSTRAK_REJECTED" : "FULLPAPER_REJECTED")}
                              disabled={item.status === "ABSTRAK_REJECTED" || item.status === "FULLPAPER_REJECTED"}
                              className={`flex-1 lg:flex-none px-4 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                                item.status === "ABSTRAK_REJECTED" || item.status === "FULLPAPER_REJECTED"
                                  ? "bg-red-400/10 text-red-400/30 border border-red-400/10 cursor-not-allowed"
                                  : "bg-red-400/10 text-red-400 border border-red-400/30 hover:bg-red-400 hover:text-white hover:shadow-[0_0_15px_rgba(248,113,113,0.2)]"
                              }`}
                            >
                              <X size={14} strokeWidth={3} /> REJECT
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr className="block lg:table-row">
                    <td colSpan={9} className="block lg:table-cell px-8 py-20 text-center">
                       <div className="flex flex-col items-center gap-4 opacity-20">
                          <FileText size={48} className="text-[#cbead1]" />
                          <p className="text-[#cbead1] font-headline font-bold text-lg">Belum ada tim yang mendaftar.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
         </div>
      </div>

      <ModalConfirmation
        isOpen={isConfirmModalOpen && !!targetId && !!actionType}
        onClose={closeConfirmModal}
        onConfirm={executeStatusUpdate}
        title={actionType === "ABSTRAK_PASSED" || actionType === "FINAL_VERIFIED" ? "Verifikasi Pendaftaran" : "Tolak Pendaftaran"}
        message={
          actionType === "ABSTRAK_PASSED" || actionType === "FINAL_VERIFIED"
            ? `Apakah Anda yakin ingin memverifikasi pendaftaran ${targetName || "peserta ini"}? Status akan berubah menjadi ${actionType.replace("_", " ")}.`
            : `Apakah Anda yakin ingin menolak pendaftaran ${targetName || "peserta ini"}? Status akan berubah menjadi ${actionType?.replace("_", " ")} dan peserta harus memperbaiki datanya.`
        }
        confirmText="Ya, Ubah Status"
        cancelText="Batal"
        actionType={actionType === "ABSTRAK_PASSED" || actionType === "FINAL_VERIFIED" ? "success" : "danger"}
        isLoading={isConfirmLoading}
      />

      <AdminDetailModal
        isOpen={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        title={selectedTeam ? `Detail Tim: ${selectedTeam.team_name}` : "Detail Tim"}
      >
        {selectedTeam && (
          <div className="space-y-6">
            <section className="space-y-3">
              <h4 className="text-sm font-black uppercase tracking-widest text-[#d5e629]/70">Informasi Tim</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#001809] border border-[#345118]/30 rounded-2xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-[#cbead1]/50 mb-1">Nama Tim</p>
                  <p className="text-white font-bold">{selectedTeam.team_name}</p>
                </div>
                <div className="bg-[#001809] border border-[#345118]/30 rounded-2xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-[#cbead1]/50 mb-2">Status</p>
                  {renderStatusBadge(selectedTeam.status)}
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-sm font-black uppercase tracking-widest text-[#d5e629]/70">Informasi Ketua</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#001809] border border-[#345118]/30 rounded-2xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-[#cbead1]/50 mb-1">Nama Lengkap</p>
                  <p className="text-white font-semibold">{selectedTeam.users?.full_name || "-"}</p>
                </div>
                <div className="bg-[#001809] border border-[#345118]/30 rounded-2xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-[#cbead1]/50 mb-1">Asal Instansi/Sekolah</p>
                  <p className="text-white font-semibold">{selectedTeam.users?.school_name || "-"}</p>
                </div>
                <div className="bg-[#001809] border border-[#345118]/30 rounded-2xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-[#cbead1]/50 mb-1">Email</p>
                  <p className="text-white font-semibold break-all">{selectedTeam.users?.email || "-"}</p>
                </div>
                <div className="bg-[#001809] border border-[#345118]/30 rounded-2xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-[#cbead1]/50 mb-1">Nomor HP/WA Ketua</p>
                  {selectedTeam.users?.phone_number ? (
                    <a href={`tel:${selectedTeam.users.phone_number}`} className="text-white font-semibold hover:text-[#d5e629] transition-colors">
                      {selectedTeam.users.phone_number}
                    </a>
                  ) : (
                    <p className="text-white font-semibold">-</p>
                  )}
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-sm font-black uppercase tracking-widest text-[#d5e629]/70">Dokumen Tim</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: "Abstrak", url: selectedTeam.abstract_url },
                  { label: "Bukti Bayar", url: selectedTeam.payment_proof_url },
                  { label: "Twibbon", url: selectedTeam.twibbon_url },
                  { label: "Instagram", url: selectedTeam.ig_proof_url },
                  { label: "Full Paper", url: selectedTeam.paper_url },
                ].map((doc) => (
                  <div key={doc.label} className="bg-[#001809] border border-[#345118]/30 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-white font-semibold">{doc.label}</p>
                      <p className="text-xs text-[#cbead1]/60">{doc.url ? "Tersedia" : "Belum diunggah"}</p>
                    </div>
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold border border-[#d5e629]/40 text-[#d5e629] hover:bg-[#d5e629] hover:text-[#001809] transition-colors"
                      >
                        <ExternalLink size={13} /> Buka
                      </a>
                    ) : (
                      <span className="text-[11px] text-[#cbead1]/40">N/A</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-sm font-black uppercase tracking-widest text-[#d5e629]/70">Kartu Pelajar Tim</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedTeam.lkti_team_members?.map((member, idx) => (
                  <div key={idx} className="bg-[#001809] border border-[#345118]/30 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-white font-semibold">{member.role}</p>
                      <p className="text-xs text-[#cbead1]/60">{member.member_name}</p>
                    </div>
                    {member.student_card_url ? (
                      <a
                        href={member.student_card_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold border border-[#d5e629]/40 text-[#d5e629] hover:bg-[#d5e629] hover:text-[#001809] transition-colors"
                      >
                        <ExternalLink size={13} /> Buka
                      </a>
                    ) : (
                      <span className="text-[11px] text-[#cbead1]/40">N/A</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="pt-2 border-t border-[#345118]/30">
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => handleStatusUpdate(selectedTeam.id, selectedTeam.team_name, activeTab === "SELEKSI_ABSTRAK" ? "ABSTRAK_PASSED" : "FINAL_VERIFIED")}
                  disabled={loadingId === selectedTeam.id || selectedTeam.status === "ABSTRAK_PASSED" || selectedTeam.status === "FINAL_VERIFIED"}
                  className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all bg-green-400/10 text-green-400 border border-green-400/30 hover:bg-green-400 hover:text-[#001809] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={14} strokeWidth={3} /> {activeTab === "SELEKSI_ABSTRAK" ? "LOLOS ABSTRAK" : "VERIFY"}
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedTeam.id, selectedTeam.team_name, activeTab === "SELEKSI_ABSTRAK" ? "ABSTRAK_REJECTED" : "FULLPAPER_REJECTED")}
                  disabled={loadingId === selectedTeam.id || selectedTeam.status === "ABSTRAK_REJECTED" || selectedTeam.status === "FULLPAPER_REJECTED"}
                  className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all bg-red-400/10 text-red-400 border border-red-400/30 hover:bg-red-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={14} strokeWidth={3} /> REJECT
                </button>
              </div>
            </section>
          </div>
        )}
      </AdminDetailModal>

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
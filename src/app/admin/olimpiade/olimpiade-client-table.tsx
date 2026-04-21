"use client"

import { useState } from "react";
import { updateOlimpiadeStatus } from "@/app/actions/admin-actions";
import { Search, ExternalLink, Check, X, Loader2, Filter, Eye, Image, Link as LinkIcon } from "lucide-react";
import { CiInstagram } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { AdminDetailModal } from "@/components/ui/admin-detail-modal";
import { ModalConfirmation } from "@/components/ui/modal-confirmation";
import { ModalNotify } from "@/components/ui/modal-notify";

interface OlimpiadeItem {
  id: string;
  user_id: string;
  status: string;
  payment_proof_url: string;
  twibbon_url: string;
  ig_proof_url: string;
  created_at: string;
  users: {
    full_name: string;
    email: string;
    school_name?: string;
  }
}

export function OlimpiadeClientTable({ initialData }: { initialData: OlimpiadeItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<OlimpiadeItem | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [targetName, setTargetName] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"VERIFIED" | "REJECTED" | null>(null);
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

  const filteredData = initialData.filter(item => 
    item.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.users?.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.users?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = (id: string, name: string, newStatus: "VERIFIED" | "REJECTED") => {
    setTargetId(id);
    setTargetName(name);
    setActionType(newStatus);
    setIsConfirmModalOpen(true);
  };

  const executeStatusUpdate = async () => {
    if (!targetId || !actionType) return;

    setLoadingId(targetId);
    const res = await updateOlimpiadeStatus(targetId, actionType);
    if (res.success) {
      setIsConfirmModalOpen(false);
      setTargetId(null);
      setTargetName(null);
      setActionType(null);
      setSelectedParticipant(null);
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
    if (status === "PENDING") {
      return (
        <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1.5 rounded-full text-[10px] font-black text-yellow-400 uppercase tracking-wider">
          <div className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse"></div>
          PENDING
        </div>
      );
    }

    if (status === "VERIFIED") {
      return (
        <div className="flex items-center gap-2 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full text-[10px] font-black text-green-400 uppercase tracking-wider">
          <div className="w-1 h-1 rounded-full bg-green-400"></div>
          VERIFIED
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 bg-red-400/10 border border-red-400/20 px-3 py-1.5 rounded-full text-[10px] font-black text-red-400 uppercase tracking-wider">
        <div className="w-1 h-1 rounded-full bg-red-400"></div>
        REJECTED
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0a2510]/40 p-4 rounded-2xl border border-[#345118]/20 backdrop-blur-sm">
        <div className="relative w-full md:w-[400px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cbead1] opacity-40 group-focus-within:text-[#d5e629] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Cari Nama, Instansi, atau Email..."
            className="w-full bg-[#001809] border border-[#345118] text-[#cbead1] pl-12 pr-4 py-3 rounded-xl focus:ring-1 focus:ring-[#d5e629] focus:outline-none placeholder:text-[#cbead1]/30 text-sm font-['Space_Grotesk']"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 border border-[#345118]/30 rounded-xl bg-[#001809]">
           <Filter size={14} className="text-[#d5e629]" />
           <span className="text-[10px] font-bold text-[#cbead1]/60 uppercase tracking-widest">{filteredData.length} Records found</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#0a2510] border border-[#345118]/20 rounded-[40px] overflow-hidden shadow-2xl relative">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-spacing-0">
              <thead>
                <tr className="border-b border-[#345118]/10 bg-[#001809]/50">
                  <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40">Nama Peserta / Email</th>
                  <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40">Asal Instansi</th>
                  <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40">Status</th>
                  <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40 text-center">Bukti Bayar</th>
                  <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40 text-center">Kartu / Twibbon</th>
                  <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40 text-center">Bukti IG</th>
                  <th className="px-4 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#d5e629]/40 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? filteredData.map((item) => (
                  <tr key={item.id} className="group hover:bg-[#345118]/10 transition-colors border-b border-[#345118]/10 last:border-0 relative">
                    <td className="px-4 py-6">
                      <div className="flex flex-col">
                        <span className="text-white font-headline font-bold text-sm tracking-tight">{item.users?.full_name}</span>
                        <span className="text-[10px] font-mono text-[#cbead1]/40">{item.users?.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <span className="text-[#cbead1] text-xs font-['Space_Grotesk'] font-medium">{item.users?.school_name || "N/A"}</span>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-2">{renderStatusBadge(item.status)}</div>
                    </td>
                    <td className="px-4 py-6 text-center">
                      {item.payment_proof_url ? (
                        <a 
                          href={item.payment_proof_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mx-auto w-fit px-3 py-1.5 rounded-lg border border-[#345118] text-[#cbead1] hover:bg-[#345118]/20 flex items-center justify-center gap-1 transition-colors relative group/btn"
                          title="Buka Bukti Bayar"
                        >
                           <LinkIcon size={14} />
                           <span className="text-[10px] font-bold">Bayar</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-[#cbead1]/40 mx-auto block w-fit">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-6 text-center">
                      {item.twibbon_url ? (
                        <a 
                          href={item.twibbon_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mx-auto w-fit px-3 py-1.5 rounded-lg border border-[#345118] text-[#cbead1] hover:bg-[#345118]/20 flex items-center justify-center gap-1 transition-colors relative group/btn"
                          title="Buka Bukti Twibbon / Kartu Pelajar"
                        >
                           <Image size={14} />
                           <span className="text-[10px] font-bold">Kartu</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-[#cbead1]/40 mx-auto block w-fit">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-6 text-center">
                      {item.ig_proof_url ? (
                        <a 
                          href={item.ig_proof_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mx-auto w-fit px-3 py-1.5 rounded-lg border border-[#345118] text-[#cbead1] hover:bg-gradient-to-tr hover:from-orange-500 hover:via-pink-500 hover:to-purple-500 hover:text-white hover:border-transparent flex items-center justify-center gap-1 transition-all relative group/btn"
                          title="Buka Bukti IG"
                        >
                           <CiInstagram size={14} />
                           <span className="text-[10px] font-bold">IG</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-[#cbead1]/40 mx-auto block w-fit">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex justify-center items-center gap-2">
                        {loadingId === item.id ? (
                          <div className="flex items-center gap-2 py-2 text-[#d5e629] text-[10px] font-bold">
                             <Loader2 size={14} className="animate-spin" /> Memproses...
                          </div>
                        ) : (
                          <div className="flex gap-2 w-full justify-center">
                            <button
                              onClick={() => setSelectedParticipant(item)}
                              className="px-3 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all bg-[#d5e629]/10 text-[#d5e629] border border-[#d5e629]/30 hover:bg-[#d5e629] hover:text-[#001809]"
                            >
                              <Eye size={14} strokeWidth={2.5} /> DETAIL
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(item.id, item.users?.full_name || item.users?.email || "Peserta", "VERIFIED")}
                              disabled={item.status === "VERIFIED"}
                              className={`px-4 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                                item.status === "VERIFIED" 
                                  ? "bg-green-400/10 text-green-400/30 border border-green-400/10 cursor-not-allowed"
                                  : "bg-green-400/10 text-green-400 border border-green-400/30 hover:bg-green-400 hover:text-[#001809] hover:shadow-[0_0_15px_rgba(74,222,128,0.2)]"
                              }`}
                            >
                              <Check size={14} strokeWidth={3} /> VERIFY
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(item.id, item.users?.full_name || item.users?.email || "Peserta", "REJECTED")}
                              disabled={item.status === "REJECTED"}
                              className={`px-4 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                                item.status === "REJECTED" 
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
                  <tr>
                    <td colSpan={7} className="px-4 py-20 text-center">
                       <div className="flex flex-col items-center gap-4 opacity-30">
                          <Search size={48} className="text-[#cbead1]" />
                          <p className="text-[#cbead1] font-headline font-bold text-lg">No records found matching your search.</p>
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
        title={actionType === "VERIFIED" ? "Verifikasi Pendaftaran" : "Tolak Pendaftaran"}
        message={
          actionType === "VERIFIED"
            ? `Apakah Anda yakin ingin memverifikasi pendaftaran ${targetName || "peserta ini"}? Status akan berubah menjadi VERIFIED.`
            : `Apakah Anda yakin ingin menolak pendaftaran ${targetName || "peserta ini"}? Status akan berubah menjadi REJECTED dan peserta harus memperbaiki datanya.`
        }
        confirmText="Ya, Ubah Status"
        cancelText="Batal"
        actionType={actionType === "VERIFIED" ? "success" : "danger"}
        isLoading={isConfirmLoading}
      />

      <AdminDetailModal
        isOpen={!!selectedParticipant}
        onClose={() => setSelectedParticipant(null)}
        title={selectedParticipant ? `Detail Peserta: ${selectedParticipant.users?.full_name || "-"}` : "Detail Peserta"}
      >
        {selectedParticipant && (
          <div className="space-y-6">
            <section className="space-y-3">
              <h4 className="text-sm font-black uppercase tracking-widest text-[#d5e629]/70">Informasi Peserta</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#001809] border border-[#345118]/30 rounded-2xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-[#cbead1]/50 mb-1">Nama Lengkap</p>
                  <p className="text-white font-semibold">{selectedParticipant.users?.full_name || "-"}</p>
                </div>
                <div className="bg-[#001809] border border-[#345118]/30 rounded-2xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-[#cbead1]/50 mb-1">Asal Sekolah</p>
                  <p className="text-white font-semibold">{selectedParticipant.users?.school_name || "-"}</p>
                </div>
                <div className="bg-[#001809] border border-[#345118]/30 rounded-2xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-[#cbead1]/50 mb-2">Status</p>
                  {renderStatusBadge(selectedParticipant.status)}
                </div>
                <div className="bg-[#001809] border border-[#345118]/30 rounded-2xl p-4">
                  <p className="text-[11px] uppercase tracking-wider text-[#cbead1]/50 mb-1">Email</p>
                  <p className="text-white font-semibold break-all">{selectedParticipant.users?.email || "-"}</p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-sm font-black uppercase tracking-widest text-[#d5e629]/70">Dokumen</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: "Bukti Bayar", url: selectedParticipant.payment_proof_url },
                  { label: "Twibbon / Kartu Pelajar", url: selectedParticipant.twibbon_url },
                  { label: "Bukti Instagram", url: selectedParticipant.ig_proof_url },
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

            <section className="pt-2 border-t border-[#345118]/30">
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => handleStatusUpdate(selectedParticipant.id, selectedParticipant.users?.full_name || selectedParticipant.users?.email || "Peserta", "VERIFIED")}
                  disabled={loadingId === selectedParticipant.id || selectedParticipant.status === "VERIFIED"}
                  className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all bg-green-400/10 text-green-400 border border-green-400/30 hover:bg-green-400 hover:text-[#001809] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={14} strokeWidth={3} /> VERIFY
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedParticipant.id, selectedParticipant.users?.full_name || selectedParticipant.users?.email || "Peserta", "REJECTED")}
                  disabled={loadingId === selectedParticipant.id || selectedParticipant.status === "REJECTED"}
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

"use client";

import { CheckCircle, Info, XCircle } from "lucide-react";

interface ModalNotifyProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error" | "info";
}

export function ModalNotify({ isOpen, onClose, title, message, type }: ModalNotifyProps) {
  if (!isOpen) return null;

  const icon =
    type === "success" ? <CheckCircle size={24} /> : type === "error" ? <XCircle size={24} /> : <Info size={24} />;

  const iconClass =
    type === "success"
      ? "bg-green-500/10 border-green-500/30 text-green-400"
      : type === "error"
        ? "bg-red-500/10 border-red-500/30 text-red-400"
        : "bg-blue-500/10 border-blue-500/30 text-blue-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0a2510] border border-[#345118]/40 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-center mb-5">
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${iconClass}`}>{icon}</div>
        </div>

        <h3 className="text-center text-[#d5e629] font-headline font-black text-xl mb-3">{title}</h3>
        <p className="text-center text-[#cbead1]/80 text-sm leading-relaxed mb-8">{message}</p>

        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-3 rounded-xl border border-[#345118]/50 text-[#cbead1] text-xs font-bold tracking-widest uppercase hover:bg-[#001809] transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

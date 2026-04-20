"use client";

import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

interface ModalConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  actionType: "danger" | "success" | "primary";
  isLoading: boolean;
}

export function ModalConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  actionType,
  isLoading,
}: ModalConfirmationProps) {
  if (!isOpen) return null;

  const actionColor =
    actionType === "danger"
      ? "bg-red-500 text-white hover:bg-red-400"
      : actionType === "success"
        ? "bg-green-500 text-[#001809] hover:bg-green-400"
        : "bg-blue-500 text-white hover:bg-blue-400";

  const iconClass =
    actionType === "danger"
      ? "bg-red-500/10 border-red-500/30 text-red-400"
      : actionType === "success"
        ? "bg-green-500/10 border-green-500/30 text-green-400"
        : "bg-blue-500/10 border-blue-500/30 text-blue-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0a2510] border border-[#345118]/40 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-center mb-5">
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${iconClass}`}>
            {actionType === "danger" ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
          </div>
        </div>

        <h3 className="text-center text-[#d5e629] font-headline font-black text-xl mb-3">{title}</h3>
        <p className="text-center text-[#cbead1]/80 text-sm leading-relaxed mb-8">{message}</p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl border border-[#345118]/50 text-[#cbead1] text-xs font-bold tracking-widest uppercase hover:bg-[#001809] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 rounded-xl text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${actionColor}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Memproses...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

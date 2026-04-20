"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface AdminDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function AdminDetailModal({ isOpen, onClose, title, children }: AdminDetailModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="bg-black/60 backdrop-blur-sm z-50 fixed inset-0 p-4 md:p-8 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#0a2510] border border-[#345118]/30 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-[#0a2510]/95 backdrop-blur border-b border-[#345118]/20 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-headline font-bold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 inline-flex items-center justify-center rounded-xl border border-[#345118]/40 text-[#cbead1] hover:text-[#d5e629] hover:border-[#d5e629]/40 hover:bg-[#001809] transition-colors"
            aria-label="Tutup modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 md:p-7">{children}</div>
      </div>
    </div>
  );
}

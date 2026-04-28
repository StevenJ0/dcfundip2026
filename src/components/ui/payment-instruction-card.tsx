"use client";

import React, { useState } from "react";
import { CreditCard, Wallet, Landmark, Check, Copy } from "lucide-react";

interface PaymentMethod {
  id: string;
  label: string;
  /** Raw digits written to clipboard */
  accountNumber: string;
  /** Human-readable display with canonical spacing */
  accountDisplay: string;
  accountName: string;
  icon: React.ReactNode;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "bri",
    label: "BRI",
    accountNumber: "5934010458455360",
    accountDisplay: "5934 0104 5845 536",
    accountName: "Anggita Novarindra",
    icon: <CreditCard size={20} className="text-[#d5e629] flex-shrink-0" />,
  },
  {
    id: "mandiri",
    label: "Mandiri",
    accountNumber: "1370023742071",
    accountDisplay: "1370 0237 42071",
    accountName: "Fatima Amalia Kusuma",
    icon: <CreditCard size={20} className="text-[#d5e629] flex-shrink-0" />,
  },
  {
    id: "shopeepay",
    label: "ShopeePay",
    accountNumber: "081392419968",
    accountDisplay: "0813 9241 9968",
    accountName: "Fatima Amalia",
    icon: <Wallet size={20} className="text-[#d5e629] flex-shrink-0" />,
  },
  {
    id: "gopay",
    label: "GoPay",
    accountNumber: "081392419968",
    accountDisplay: "0813 9241 9968",
    accountName: "alya",
    icon: <Wallet size={20} className="text-[#d5e629] flex-shrink-0" />,
  },
];

export function PaymentInstructionCard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, rawNumber: string) => {
    navigator.clipboard.writeText(rawNumber).catch(() => {
      // Fallback for environments without clipboard API support
      const el = document.createElement("textarea");
      el.value = rawNumber;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#001809] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <div className="w-8 h-8 bg-[#d5e629]/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Landmark size={16} className="text-[#d5e629]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white leading-tight">
            Informasi Rekening Pembayaran
          </h3>
          <p className="text-xs text-white/40 mt-0.5">
            Salin nomor rekening, lalu unggah bukti transfer di bawah
          </p>
        </div>
      </div>

      {/* Payment rows */}
      <div className="divide-y divide-white/5">
        {PAYMENT_METHODS.map((method) => {
          const isCopied = copiedId === method.id;
          return (
            <div
              key={method.id}
              className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors"
            >
              {/* Icon badge */}
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                {method.icon}
              </div>

              {/* Account info */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold mb-0.5">
                  {method.label}
                </p>
                <p className="text-white font-mono font-semibold text-sm leading-tight">
                  {method.accountDisplay}
                </p>
                <p className="text-[#d5e629] text-xs font-semibold mt-0.5 truncate">
                  a.n. {method.accountName}
                </p>
              </div>

              {/* Copy button */}
              <button
                type="button"
                onClick={() => handleCopy(method.id, method.accountNumber)}
                aria-label={`Salin nomor ${method.label}`}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 ${
                  isCopied
                    ? "bg-[#d5e629]/10 border-[#d5e629]/30 text-[#d5e629]"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/20"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check size={12} />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02]">
        <p className="text-[11px] text-white/30 leading-relaxed">
          💡 Pastikan nominal transfer sesuai dengan ketentuan gelombang pendaftaran Anda.
        </p>
      </div>
    </div>
  );
}

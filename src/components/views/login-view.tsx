'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ModalNotify } from "@/components/ui/modal-notify";

export default function LoginView() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        showModal("Login Gagal", data.error || "Email atau password salah", "error");
        setIsSubmitting(false);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      showModal("Terjadi Kesalahan", "An unexpected error occurred", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-16">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-surface-container border border-outline-variant/30 rounded-3xl p-10 shadow-2xl">

          {/* Header */}
          <div className="mb-10 text-center">
            <Link href="/" className="inline-block text-2xl font-bold tracking-tighter text-[#d5e629] mb-6">
              DCF 2026
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-on-surface-variant text-sm">Sign in to your DCF account to continue.</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleLogin}>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-on-surface-variant mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface-container-high border border-outline-variant/50 text-on-surface rounded-xl px-4 py-3 text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container/70 focus:border-primary-container transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-on-surface-variant">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-high border border-outline-variant/50 text-on-surface rounded-xl px-4 py-3 pr-12 text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container/70 focus:border-primary-container transition-all"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-[#d5e629]"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full bg-primary-container text-on-primary-container font-bold py-3.5 rounded-xl text-sm transition-all mt-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_24px_rgba(213,230,41,0.3)]'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-outline-variant/30" />
            <span className="text-xs text-on-surface-variant uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-outline-variant/30" />
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-on-surface-variant">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-primary font-semibold hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>

        {/* Bottom caption */}
        <p className="text-center text-xs text-on-surface-variant/50 mt-6">
          © 2026 Diponegoro Chemistry Fair. All rights reserved.
        </p>
      </motion.div>
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

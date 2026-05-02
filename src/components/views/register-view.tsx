'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { ModalNotify } from "@/components/ui/modal-notify";

export default function RegisterView() {

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false) 

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
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const isPasswordStrong = hasMinLength && hasUppercase && hasSymbol;
  const isFormValid =
    fullName.trim() !== '' &&
    email.trim() !== '' &&
    schoolName.trim() !== '' &&
    phoneNumber.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    password === confirmPassword &&
    isPasswordStrong;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!isPasswordStrong) {
      showModal("Validasi Gagal", "Password must be at least 8 characters, include an uppercase letter, and include a symbol.", "error");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      showModal("Validasi Gagal", "Passwords do not match", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName,
          schoolName,
          phoneNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showModal("Registrasi Gagal", data.error || "Registration failed", "error");
      } else {
        showModal("Registrasi Berhasil", "Account created successfully!", "success");
        // Optional: Clear form
        setFullName('');
        setEmail('');
        setSchoolName('');
        setPhoneNumber('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      showModal("Terjadi Kesalahan", "An unexpected error occurred", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-16">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl" />
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
            <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-on-surface-variant text-sm">
              Join the Molecular Alchemist community today.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleRegister}>

            {/* Full Name Field */}
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-on-surface-variant mb-2">
                Full Name
              </label>
              <input
                id="fullname"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-surface-container-high border border-outline-variant/50 text-on-surface rounded-xl px-4 py-3 text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container/70 focus:border-primary-container transition-all"
              />
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              {/* School Name */}
              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium text-on-surface-variant mb-2">
                  School / Univ
                </label>
                <input
                  id="schoolName"
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Inst. Name"
                  className="w-full bg-surface-container-high border border-outline-variant/50 text-on-surface rounded-xl px-4 py-3 text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container/70 focus:border-primary-container transition-all"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-on-surface-variant mb-2">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+62..."
                  className="w-full bg-surface-container-high border border-outline-variant/50 text-on-surface rounded-xl px-4 py-3 text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container/70 focus:border-primary-container transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-on-surface-variant mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
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
              <div className="text-xs space-y-1 mt-2">
                <div className={`flex items-center gap-2 ${hasMinLength ? 'text-green-400' : 'text-[#cbead1]/50'}`}>
                  {hasMinLength ? <CheckCircle2 size={14} className="text-green-400" /> : <Circle size={14} className="text-[#cbead1]/30" />}
                  <span>Minimum 8 karakter</span>
                </div>
                <div className={`flex items-center gap-2 ${hasUppercase ? 'text-green-400' : 'text-[#cbead1]/50'}`}>
                  {hasUppercase ? <CheckCircle2 size={14} className="text-green-400" /> : <Circle size={14} className="text-[#cbead1]/30" />}
                  <span>Memiliki minimal 1 huruf besar (A-Z)</span>
                </div>
                <div className={`flex items-center gap-2 ${hasSymbol ? 'text-green-400' : 'text-[#cbead1]/50'}`}>
                  {hasSymbol ? <CheckCircle2 size={14} className="text-green-400" /> : <Circle size={14} className="text-[#cbead1]/30" />}
                  <span>Memiliki minimal 1 simbol (!@#$%^&*)</span>
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-on-surface-variant mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full bg-surface-container-high border border-outline-variant/50 text-on-surface rounded-xl px-4 py-3 pr-12 text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary-container/70 focus:border-primary-container transition-all"
                />
                <button
                  type="button"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400 hover:text-[#d5e629]"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showConfirm ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Terms Notice */}
            <p className="text-xs text-on-surface-variant/60 leading-relaxed">
              By creating an account, you agree to our{' '}
              <Link href="#" className="text-primary hover:underline">Terms of Service</Link>{' '}
              and{' '}
              <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full bg-primary-container text-on-primary-container font-bold py-3.5 rounded-xl text-sm transition-all mt-2 ${
                isSubmitting || !isFormValid ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-[0_0_24px_rgba(213,230,41,0.3)]'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Create Account'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-outline-variant/30" />
            <span className="text-xs text-on-surface-variant uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-outline-variant/30" />
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign in instead
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

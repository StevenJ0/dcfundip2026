"use server";

import { createClient } from "@/utils/supabase/server";

// ============================================================
// COMPETITION REGISTRATION TOGGLE
// Set to `true` to re-open Gelombang 2 registration.
// ============================================================
const IS_COMPETITION_OPEN = false;

export async function submitOlimpiadeRegistration(
  userId: string,
  fullName: string,
  schoolName: string,
  phoneNumber: string,
  twibbonUrl: string,
  studentCardUrl: string,
  igUrl: string,
  paymentUrl: string
) {
  try {
    // Guard: reject submission if registration period is closed.
    if (!IS_COMPETITION_OPEN) {
      return {
        success: false,
        error: "Pendaftaran lomba Gelombang 1 telah ditutup. Silakan tunggu Gelombang 2 pada 6 Juli 2026.",
      };
    }

    if (!userId || !fullName || !schoolName || !phoneNumber || !twibbonUrl || !studentCardUrl || !igUrl || !paymentUrl) {
      return { success: false, error: "Data pendaftaran tidak lengkap. Mohon periksa kembali form Anda." };
    }

    const supabase = await createClient();

    // Update the auth user details securely server-side
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        school_name: schoolName,
        phone_number: phoneNumber,
      },
    });

    if (updateError) {
      return { success: false, error: "Gagal memperbarui profil. Silakan coba beberapa saat lagi." };
    }

    // Additionally sync with public.users
    const { error: updatePublicError } = await supabase
      .from("users")
      .update({
        full_name: fullName,
        school_name: schoolName,
        phone_number: phoneNumber,
      })
      .eq("id", userId);

    if (updatePublicError) {
      return { success: false, error: "Gagal memperbarui data profil. Silakan coba beberapa saat lagi." };
    }

    // 1. Verify if the user exists/is already registered
    const { data: existingUser, error: checkError } = await supabase
      .from("olympiad_participants")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (checkError) {
      return { success: false, error: "Terjadi kesalahan saat memverifikasi status pendaftaran." };
    }

    if (existingUser) {
      return { success: false, error: "Anda sudah terdaftar sebagai peserta Olimpiade Kimia." };
    }

    // 1.5. Validate Mutual Exclusion (LKTI)
    const { data: lktiUser, error: lktiCheckError } = await supabase
      .from("lkti_teams")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (lktiCheckError) {
      return { success: false, error: "Terjadi kesalahan saat memverifikasi status pendaftaran." };
    }

    if (lktiUser) {
      return { success: false, error: "Pendaftaran ditolak: Anda sudah terdaftar di LKTI." };
    }

    // 2. Perform the Insert
    const { error: insertError } = await supabase
      .from("olympiad_participants")
      .insert({
        user_id: userId,
        payment_proof_url: paymentUrl,
        twibbon_url: twibbonUrl,
        student_card_url: studentCardUrl,
        ig_proof_url: igUrl,
      });

    if (insertError) {
      return { success: false, error: "Gagal menyimpan data pendaftaran. Pastikan ukuran file tidak terlalu besar atau coba beberapa saat lagi." };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi." };
  }
}

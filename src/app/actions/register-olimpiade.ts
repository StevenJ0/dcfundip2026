"use server";

import { createClient } from "@/utils/supabase/server";

export async function submitOlimpiadeRegistration(
  userId: string,
  fullName: string,
  schoolName: string,
  phoneNumber: string,
  twibbonUrl: string,
  igUrl: string,
  paymentUrl: string
) {
  try {
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
      return { success: false, error: `Gagal memperbarui profil: ${updateError.message}` };
    }

    // 1. Verify if the user exists/is already registered
    const { data: existingUser, error: checkError } = await supabase
      .from("olympiad_participants")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (checkError) {
      return { success: false, error: "Gagal memverifikasi status pendaftaran." };
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
      return { success: false, error: "Gagal memverifikasi status pendaftaran LKTI silang." };
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
        ig_proof_url: igUrl,
      });

    if (insertError) {
      return { success: false, error: `Gagal menyimpan data partisipan: ${insertError.message}` };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Terjadi kesalahan pada server." };
  }
}

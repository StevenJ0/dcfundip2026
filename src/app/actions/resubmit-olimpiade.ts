"use server";

import { createClient } from "@/utils/supabase/server";

export async function resubmitOlimpiadeRegistration(
  userId: string,
  twibbonUrl: string,
  studentCardUrl: string,
  igUrl: string,
  paymentUrl: string
) {
  try {
    if (!userId || !twibbonUrl || !studentCardUrl || !igUrl || !paymentUrl) {
      return { success: false, error: "Data revisi tidak lengkap. Mohon lengkapi semua dokumen yang diperlukan." };
    }

    const supabase = await createClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    if (user.id !== userId) {
      return { success: false, error: "Tindakan tidak diizinkan." };
    }

    // Sync auth metadata to public.users just to be safe
    if (user.user_metadata) {
      const { full_name, school_name, phone_number } = user.user_metadata;
      await supabase.from("users").update({
        full_name: full_name,
        school_name: school_name,
        phone_number: phone_number,
      }).eq("id", userId);
    }

    const { error: updateError } = await supabase
      .from("olympiad_participants")
      .update({
        twibbon_url: twibbonUrl,
        student_card_url: studentCardUrl,
        ig_proof_url: igUrl,
        payment_proof_url: paymentUrl,
        status: "PENDING",
      })
      .eq("user_id", userId);

    if (updateError) {
      return { success: false, error: "Gagal menyimpan revisi pendaftaran. Silakan coba beberapa saat lagi." };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Resubmit Olimpiade Error:", err);
    return { success: false, error: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi." };
  }
}

"use server";

import { createClient } from "@/utils/supabase/server";

export async function submitFullPaperLkti(
  userId: string,
  paymentUrl: string,
  paperUrl: string
) {
  try {
    if (!userId || !paymentUrl || !paperUrl) {
      throw new Error("Data tidak lengkap. Mohon periksa kembali file Anda.");
    }

    const supabase = await createClient();

    // Verify user has an LKTI team and the abstract was passed
    const { data: existingTeam, error: teamError } = await supabase
      .from("lkti_teams")
      .select("id, status")
      .eq("user_id", userId)
      .single();

    if (teamError || !existingTeam) {
      throw new Error("Data tim tidak ditemukan.");
    }

    if (existingTeam.status !== 'ABSTRAK_PASSED' && existingTeam.status !== 'FULLPAPER_REJECTED') {
       throw new Error("Status tim tidak valid untuk mengunggah Full Paper.");
    }

    // Update the team with payment proof and paper url, set status to FULLPAPER_PENDING
    const { error: updateError } = await supabase
      .from("lkti_teams")
      .update({
        payment_proof_url: paymentUrl,
        paper_url: paperUrl,
        status: 'FULLPAPER_PENDING'
      })
      .eq("id", existingTeam.id);

    if (updateError) {
      throw new Error("Gagal menyimpan dokumen. Silakan coba beberapa saat lagi.");
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi." };
  }
}

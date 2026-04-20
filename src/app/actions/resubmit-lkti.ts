"use server";

import { createClient } from "@/utils/supabase/server";

export async function resubmitLKTIRegistration(
  teamId: string,
  teamName: string,
  paperTitle: string,
  abstractUrl: string,
  twibbonUrl: string,
  igUrl: string,
  paymentUrl: string
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Anda harus login untuk melakukan revisi.");
    }

    const { error: updateError } = await supabase
      .from("lkti_teams")
      .update({
        team_name: teamName,
        paper_title: paperTitle,
        abstract_url: abstractUrl,
        twibbon_url: twibbonUrl,
        ig_proof_url: igUrl,
        payment_proof_url: paymentUrl,
        status: "PENDING",
      })
      .eq("id", teamId);

    if (updateError) {
      throw new Error(`Gagal menyimpan revisi LKTI: ${updateError.message}`);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Terjadi kesalahan pada server." };
  }
}

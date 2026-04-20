"use server";

import { createClient } from "@/utils/supabase/server";

export async function resubmitOlimpiadeRegistration(
  userId: string,
  twibbonUrl: string,
  igUrl: string,
  paymentUrl: string
) {
  try {
    const supabase = await createClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    if (user.id !== userId) {
      return { success: false, error: "Tindakan tidak diizinkan." };
    }

    const { error: updateError } = await supabase
      .from("olympiad_participants")
      .update({
        twibbon_url: twibbonUrl,
        ig_proof_url: igUrl,
        payment_proof_url: paymentUrl,
        status: "PENDING",
      })
      .eq("user_id", userId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Resubmit Olimpiade Error:", err);
    return { success: false, error: err.message || "Terjadi kesalahan internal" };
  }
}

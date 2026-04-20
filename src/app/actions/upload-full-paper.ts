"use server";

import { createClient } from "@/utils/supabase/server";

export async function submitFullPaper(userId: string, paperUrl: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("lkti_teams")
      .update({ paper_url: paperUrl })
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Gagal menyimpan Full Paper: ${error.message}`);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Terjadi kesalahan pada server." };
  }
}

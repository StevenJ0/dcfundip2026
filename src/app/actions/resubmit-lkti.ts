"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Handles ABSTRAK revision re-submission only.
 * Resets team status to ABSTRAK_PENDING so the abstrak goes through review again.
 * For Full Paper re-uploads (FULLPAPER_REJECTED → FULLPAPER_PENDING), use submitFullPaperLkti instead.
 */
export async function resubmitLKTIRegistration(
  teamId: string,
  teamName: string,
  paperTitle: string,
  member1Name: string,
  member2Name: string,
  abstractUrl: string,
  twibbonUrl: string,
  igUrl: string,
  leaderCardUrl: string,
  member1CardUrl: string,
  member2CardUrl: string
) {
  try {
    if (!teamId || !teamName || !paperTitle || !member1Name || !abstractUrl || !twibbonUrl || !igUrl || !leaderCardUrl || !member1CardUrl) {
      return { success: false, error: "Data revisi tidak lengkap. Mohon lengkapi semua dokumen yang diperlukan." };
    }

    const supabase = await createClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Unauthorized" };
    }

    // Sync auth metadata to public.users just to be safe
    if (user.user_metadata) {
      const { full_name, school_name, phone_number } = user.user_metadata;
      await supabase.from("users").update({
        full_name: full_name,
        school_name: school_name,
        phone_number: phone_number,
      }).eq("id", user.id);
    }

    const { error: updateError } = await supabase
      .from("lkti_teams")
      .update({
        team_name: teamName,
        paper_title: paperTitle,
        abstract_url: abstractUrl,
        twibbon_url: twibbonUrl,
        ig_proof_url: igUrl,
        student_card_url: leaderCardUrl,
        status: "ABSTRAK_PENDING",
      })
      .eq("id", teamId);

    if (updateError) {
      throw new Error("Gagal menyimpan revisi pendaftaran. Silakan coba beberapa saat lagi.");
    }

    // Delete existing members
    const { error: deleteMembersError } = await supabase
      .from("lkti_team_members")
      .delete()
      .eq("team_id", teamId);

    if (deleteMembersError) {
      throw new Error("Gagal memperbarui anggota tim. Silakan coba beberapa saat lagi.");
    }

    // Insert new members
    const membersToInsert = [
      { team_id: teamId, member_name: user.user_metadata?.full_name || "Ketua", role: "Ketua", student_card_url: leaderCardUrl },
      { team_id: teamId, member_name: member1Name, role: "Anggota 1", student_card_url: member1CardUrl },
    ];

    if (member2Name && member2Name.trim() !== "") {
      membersToInsert.push({ team_id: teamId, member_name: member2Name, role: "Anggota 2", student_card_url: member2CardUrl });
    }

    const { error: insertMembersError } = await supabase
      .from("lkti_team_members")
      .insert(membersToInsert);

    if (insertMembersError) {
      throw new Error("Gagal menyimpan anggota tim baru. Pastikan file tidak terlalu besar.");
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi." };
  }
}

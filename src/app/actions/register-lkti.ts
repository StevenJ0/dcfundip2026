"use server";

import { createClient } from "@/utils/supabase/server";

// ============================================================
// COMPETITION REGISTRATION TOGGLE
// Set to `true` to re-open Gelombang 2 registration.
// ============================================================
const IS_COMPETITION_OPEN = false;

export async function submitLKTIRegistration(
  userId: string,
  leaderName: string,
  schoolName: string,
  phoneNumber: string,
  teamName: string,
  paperTitle: string,
  member1Name: string,
  member2Name: string | undefined, // Note: member2Name might be empty string from client, so we will handle that.
  abstractUrl: string,
  twibbonUrl: string,
  igUrl: string,
  leaderCardUrl: string,
  member1CardUrl: string,
  member2CardUrl: string
) {
  try {
    // Guard: reject submission if registration period is closed.
    if (!IS_COMPETITION_OPEN) {
      return {
        success: false,
        error: "Pendaftaran lomba Gelombang 1 telah ditutup. Silakan tunggu Gelombang 2 pada 6 Juli 2026.",
      };
    }

    if (!userId || !leaderName || !schoolName || !phoneNumber || !teamName || !paperTitle || !member1Name || !abstractUrl || !twibbonUrl || !igUrl || !leaderCardUrl || !member1CardUrl) {
      throw new Error("Data pendaftaran tidak lengkap. Mohon periksa kembali form Anda.");
    }

    const supabase = await createClient();

    // 1. Update the auth user details securely server-side
    const { error: updateAuthError } = await supabase.auth.updateUser({
      data: {
        full_name: leaderName,
        school_name: schoolName,
        phone_number: phoneNumber,
      },
    });

    if (updateAuthError) {
      throw new Error("Gagal memperbarui profil. Silakan coba beberapa saat lagi.");
    }

    // Additionally sync with public.users just in case the trigger isn't perfect or needed directly
    const { error: updatePublicError } = await supabase
      .from("users")
      .update({
        full_name: leaderName,
        school_name: schoolName,
        phone_number: phoneNumber,
      })
      .eq("id", userId);

    if (updatePublicError) {
      throw new Error("Gagal memperbarui data profil. Silakan coba beberapa saat lagi.");
    }

    // 2. Mutual Exclusion Validation (Olympiad)
    const { data: olympiadUser, error: olympiadCheckError } = await supabase
      .from("olympiad_participants")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (olympiadCheckError && olympiadCheckError.code !== "PGRST116") {
      throw new Error("Terjadi kesalahan saat memverifikasi status pendaftaran.");
    }

    if (olympiadUser) {
      throw new Error("Gagal: Anda telah terdaftar di kategori Olimpiade.");
    }

    // 3. Duplication Validation (LKTI)
    const { data: existingLKTI, error: lktiCheckError } = await supabase
      .from("lkti_teams")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (lktiCheckError && lktiCheckError.code !== "PGRST116") {
      throw new Error("Terjadi kesalahan saat memverifikasi status pendaftaran.");
    }

    if (existingLKTI) {
      throw new Error("Gagal: Anda sudah terdaftar sebagai peserta LKTI.");
    }

    // 4. Insert Team
    const { data: newTeam, error: insertTeamError } = await supabase
      .from("lkti_teams")
      .insert({
        user_id: userId,
        team_name: teamName,
        school_name: schoolName,
        paper_title: paperTitle,
        abstract_url: abstractUrl,
        twibbon_url: twibbonUrl,
        ig_proof_url: igUrl,
        student_card_url: leaderCardUrl,
        status: 'ABSTRAK_PENDING'
      })
      .select("id")
      .single();

    if (insertTeamError || !newTeam) {
      throw new Error("Gagal menyimpan data pendaftaran. Pastikan ukuran file tidak terlalu besar atau coba beberapa saat lagi.");
    }

    // 5. Insert Members
    const membersToInsert = [
      { team_id: newTeam.id, member_name: leaderName, role: "Ketua", student_card_url: leaderCardUrl },
      { team_id: newTeam.id, member_name: member1Name, role: "Anggota 1", student_card_url: member1CardUrl },
    ];

    if (member2Name && member2Name.trim() !== "") {
      membersToInsert.push({ team_id: newTeam.id, member_name: member2Name, role: "Anggota 2", student_card_url: member2CardUrl });
    }

    const { error: insertMembersError } = await supabase
      .from("lkti_team_members")
      .insert(membersToInsert);

    if (insertMembersError) {
      // Best effort rollback. If members insertion failed, we ideally should revert the team insertion.
      await supabase.from("lkti_teams").delete().eq("id", newTeam.id);
      throw new Error("Gagal menyimpan data pendaftaran. Pastikan ukuran file tidak terlalu besar atau coba beberapa saat lagi.");
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi." };
  }
}

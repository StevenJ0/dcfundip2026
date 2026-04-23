"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendStatusEmail } from "@/utils/mail";

/**
 * Verifies if the requester is authenticated and has the 'admin' role.
 * Throws an error if not.
 */
async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Sesi tidak ditemukan atau kedaluwarsa.");
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userError || !userData || userData.role !== "admin") {
    throw new Error("Akses ditolak. Anda bukan admin.");
  }

  return { supabase, adminUser: user };
}

/**
 * Returns total users, total Olimpiade, total LKTI, and count of 'PENDING' statuses.
 */
export async function getAdminStats() {
  try {
    const { supabase } = await verifyAdmin();

    const [usersCount, olimpiadeStats, lktiStats] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("olympiad_participants").select("status"),
      supabase.from("lkti_teams").select("status"),
    ]);

    const totalUsers = usersCount.count || 0;
    const totalOlimpiade = olimpiadeStats.data?.length || 0;
    const totalLkti = lktiStats.data?.length || 0;

    const pendingOlimpiade = olimpiadeStats.data?.filter(p => p.status === "PENDING").length || 0;
    const pendingLkti = lktiStats.data?.filter(p => p.status === "PENDING").length || 0;

    return {
      success: true,
      data: {
        totalUsers,
        totalOlimpiade,
        totalLkti,
        totalPending: pendingOlimpiade + pendingLkti,
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Updates status ('PENDING', 'VERIFIED', 'REJECTED') for LKTI team.
 */
export async function updateLktiStatus(teamId: string, newStatus: string) {
  try {
    const { supabase } = await verifyAdmin();

    const { data: targetTeam, error: targetError } = await supabase
      .from("lkti_teams")
      .select("team_name, users!inner(full_name, email)")
      .eq("id", teamId)
      .single();

    if (targetError || !targetTeam) {
      throw new Error("Data tim LKTI tidak ditemukan.");
    }

    const { error } = await supabase
      .from("lkti_teams")
      .update({ status: newStatus })
      .eq("id", teamId);

    if (error) throw error;

    if (newStatus === "VERIFIED" || newStatus === "REJECTED") {
      const user = Array.isArray(targetTeam.users) ? targetTeam.users[0] : targetTeam.users;
      if (user?.email) {
        void sendStatusEmail(
          user.email,
          user.full_name || targetTeam.team_name || "Peserta LKTI",
          "LKTI Nasional",
          newStatus
        );
      }
    }

    revalidatePath("/admin/lkti");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Updates status for Olimpiade participant.
 */
export async function updateOlimpiadeStatus(participantId: string, newStatus: string) {
  try {
    const { supabase } = await verifyAdmin();

    const { data: targetParticipant, error: targetError } = await supabase
      .from("olympiad_participants")
      .select("users!inner(full_name, email)")
      .eq("id", participantId)
      .single();

    if (targetError || !targetParticipant) {
      throw new Error("Data peserta Olimpiade tidak ditemukan.");
    }

    const { error } = await supabase
      .from("olympiad_participants")
      .update({ status: newStatus })
      .eq("id", participantId);

    if (error) throw error;

    if (newStatus === "VERIFIED" || newStatus === "REJECTED") {
      const user = Array.isArray(targetParticipant.users) ? targetParticipant.users[0] : targetParticipant.users;
      if (user?.email) {
        void sendStatusEmail(user.email, user.full_name || "Peserta Olimpiade", "Olimpiade Kimia", newStatus);
      }
    }

    revalidatePath("/admin/olimpiade");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Updates a user's role.
 */
export async function updateUserRole(targetUserId: string, newRole: string) {
  try {
    const { supabase, adminUser } = await verifyAdmin();

    // Prevent current admin from demoting themselves
    if (targetUserId === adminUser.id && newRole !== "admin") {
      throw new Error("Anda tidak dapat mengubah role Anda sendiri untuk mencegah penguncian akun.");
    }

    const { error } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", targetUserId);

    if (error) throw error;

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllUsers() {
  try {
    const { supabase } = await verifyAdmin();
    const { data, error } = await supabase.from("users").select("*").order("full_name", { ascending: true });
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllOlimpiadeParticipants() {
  try {
    const { supabase } = await verifyAdmin();
    // Assuming join with users for full_name
    const { data, error } = await supabase
      .from("olympiad_participants")
      .select("*, users!inner(full_name, email, school_name, phone_number)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllLktiTeams() {
  try {
    const { supabase } = await verifyAdmin();
    // Assuming join with users for leader info and lkti_team_members for members
    const { data, error } = await supabase
      .from("lkti_teams")
      .select("*, users!inner(full_name, email, school_name, phone_number), lkti_team_members(member_name, role, student_card_url)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

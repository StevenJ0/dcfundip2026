"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateUserProfile(fullName: string, schoolName: string, phoneNumber: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Sesi tidak ditemukan atau kedaluwarsa.");
    }

    // 1. Update public.users table
    const { error: publicError } = await supabase
      .from("users")
      .update({
        full_name: fullName,
        school_name: schoolName,
        phone_number: phoneNumber,
      })
      .eq("id", user.id);

    if (publicError) {
      throw new Error(`Gagal memperbarui database pengguna: ${publicError.message}`);
    }

    // 2. Update supabase.auth metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        school_name: schoolName,
        phone_number: phoneNumber,
      },
    });

    if (authError) {
      throw new Error(`Gagal memperbarui metadata sesi: ${authError.message}`);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Terjadi kesalahan pada server saat memperbarui profil." };
  }
}

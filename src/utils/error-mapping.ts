export const translateAuthError = (message: string) => {
    if (message.includes("Invalid login credentials")) return "Email atau password yang Anda masukkan salah.";
    // "User already registered" = confirmation OFF; "already registered" = confirmation ON
    if (message.includes("already registered")) return "Email ini sudah terdaftar. Silakan gunakan email lain atau coba login.";
    if (message.includes("Password should be at least 6 characters")) return "Password terlalu lemah (minimal 6 karakter).";
    if (message.includes("Email rate limit exceeded")) return "Terlalu banyak percobaan. Silakan tunggu beberapa saat.";
    if (message.includes("over_email_send_rate_limit")) return "Terlalu banyak percobaan pengiriman email. Silakan tunggu sebentar.";
    return "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.";
};

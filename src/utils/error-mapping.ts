export const translateAuthError = (message: string) => {
    if (message.includes("Invalid login credentials")) return "Email atau password yang Anda masukkan salah.";
    if (message.includes("User already registered")) return "Email ini sudah terdaftar. Silakan gunakan email lain atau coba login.";
    if (message.includes("Password should be at least 6 characters")) return "Password terlalu lemah (minimal 6 karakter).";
    if (message.includes("Email rate limit exceeded")) return "Terlalu banyak percobaan. Silakan tunggu beberapa saat.";
    return "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.";
};

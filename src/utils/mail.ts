import nodemailer from "nodemailer";

type StatusType = "VERIFIED" | "REJECTED";

function buildEmailTemplate(name: string, competition: string, status: StatusType) {
  const isVerified = status === "VERIFIED";
  const heading = isVerified ? "Pendaftaran Berhasil Diverifikasi" : "Perlu Perbaikan Dokumen Pendaftaran";
  const accentColor = isVerified ? "#4ade80" : "#f87171";
  const badgeText = isVerified ? "VERIFIED" : "REJECTED";
  const message = isVerified
    ? `Selamat, <strong>${name}</strong>! Pendaftaran Anda untuk <strong>${competition}</strong> telah berhasil diverifikasi. Silakan menunggu informasi lanjutan terkait technical meeting dari panitia DCF 2026.`
    : `Halo <strong>${name}</strong>, dokumen pendaftaran Anda untuk <strong>${competition}</strong> belum memenuhi persyaratan verifikasi. Anda wajib login ke dashboard dan melakukan perbaikan/resubmit data sesegera mungkin.`;

  return `
    <div style="margin:0;padding:0;background:#001809;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;color:#cbead1;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#001809;padding:24px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#0a2510;border:1px solid rgba(52,81,24,0.4);border-radius:20px;overflow:hidden;">
              <tr>
                <td style="padding:28px 28px 18px 28px;border-bottom:1px solid rgba(52,81,24,0.3);">
                  <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#d5e629;font-weight:700;">Panitia DCF 2026</p>
                  <h1 style="margin:0;color:#ffffff;font-size:24px;line-height:1.3;font-weight:800;">${heading}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 28px;">
                  <div style="display:inline-block;padding:6px 12px;border-radius:999px;border:1px solid ${accentColor};background:rgba(0,0,0,0.25);color:${accentColor};font-size:12px;font-weight:800;letter-spacing:0.08em;">
                    STATUS: ${badgeText}
                  </div>
                  <p style="margin:18px 0 0 0;font-size:15px;line-height:1.7;color:#cbead1;">
                    ${message}
                  </p>
                  <div style="margin-top:22px;padding:16px;border:1px solid rgba(52,81,24,0.35);border-radius:12px;background:rgba(0,24,9,0.6);">
                    <p style="margin:0;font-size:13px;line-height:1.7;color:#cbead1;">
                      Tetap pantau dashboard Anda untuk update terbaru. Jika ada kendala, hubungi panitia melalui kanal resmi DCF 2026.
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 28px 24px 28px;border-top:1px solid rgba(52,81,24,0.3);">
                  <p style="margin:0;font-size:12px;line-height:1.6;color:rgba(203,234,209,0.65);">
                    Email ini dikirim otomatis oleh sistem Diponegoro Chemistry Fair 2026.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

export async function sendStatusEmail(to: string, name: string, competition: string, status: StatusType) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("[mail] EMAIL_USER/EMAIL_PASS is missing. Skip sending email.");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subject =
      status === "VERIFIED"
        ? `✅ Verified: Selamat! Pendaftaran ${competition} Berhasil`
        : `⚠️ Action Required: Perbaikan Pendaftaran ${competition}`;

    await transporter.sendMail({
      from: `"Panitia DCF 2026" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: buildEmailTemplate(name, competition, status),
    });
  } catch (error) {
    console.error("[mail] Failed to send status email", {
      to,
      competition,
      status,
      error,
    });
  }
}

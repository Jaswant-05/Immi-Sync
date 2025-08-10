// services/resendService.js
const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const MAIL_FROM = process.env.RESEND_MAIL_FROM; 
const FRONTEND_URL = process.env.FRONTEND_URL

function buildUrl(path, params = {}) {
  const url = new URL(path, FRONTEND_URL);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });
  return url.toString();
}

const resendService = {
  async sendEmail({ to, subject, html, text }) {
    if (!MAIL_FROM) throw new Error("MAIL_FROM not configured");
    if (!to) throw new Error("Missing 'to' address");
    const { data, error } = await resend.emails.send({
      from: MAIL_FROM,
      to,
      subject,
      html,
      text,
    });
    if (error) throw new Error(error.message || "Failed to send email");
    return { success: true, id: data?.id };
  },

  async sendConfirmationEmail({ to, token }) {
    console.log(to)
    console.log(token);

    if (!token) throw new Error("Missing token");
    const confirmUrl = buildUrl("/verify-email", { token });
    const subject = "Confirm your email - Immi-Sync";
    const text = `Confirm your email: ${confirmUrl}`;
    const html = `
      <p>Hi,</p>
      <p>Click the link below to confirm your email address:</p>
      <p><a href="${confirmUrl}">Confirm Email</a></p>
      <p>If you didn't create an account, you can ignore this email.</p>
    `;
    return await resendService.sendEmail({ to, subject, html, text });
  },

  async sendPasswordResetEmail({ to, token }) {
    if (!token) throw new Error("Missing token");
    const resetUrl = buildUrl("/reset-password", { token });
    const subject = "Reset your password - Immi-Sync";
    const text = `Reset your password: ${resetUrl}`;
    const html = `
      <p>Hi,</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>If you didn’t request a password reset, you can ignore this email.</p>
    `;
    return await resendService.sendEmail({ to, subject, html, text });
  },
};

module.exports = resendService;

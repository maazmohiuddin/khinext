/**
 * Nodemailer SMTP transport for bulk/direct email sending.
 * Uses mail.khinext.com via SSL on port 465.
 *
 * Server-only — never import from a client component.
 */
import nodemailer from "nodemailer";
import { renderKhinextEmail, type KhinextEmailParams } from "./email/layout";

function createTransport() {
  const host = process.env.SMTP_HOST ?? "mail.khinext.com";
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER ?? "info@khinext.com";
  const pass = process.env.SMTP_PASS;
  if (!pass) throw new Error("SMTP_PASS is not configured.");

  return nodemailer.createTransport({
    host,
    port,
    secure: true, // SSL on port 465
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

const FROM_NAME = "Khinext '26";
const FROM_ADDRESS = process.env.SMTP_USER ?? "info@khinext.com";
const FROM = `${FROM_NAME} <${FROM_ADDRESS}>`;

export interface SmtpEmailParams extends KhinextEmailParams {
  to: string;
  subject: string;
  text?: string;
}

export async function sendSmtpEmail(p: SmtpEmailParams) {
  const transport = createTransport();
  const html = renderKhinextEmail(p);
  const text = p.text ?? stripHtml(p.body);

  return transport.sendMail({
    from: FROM,
    to: p.to,
    replyTo: FROM_ADDRESS,
    subject: p.subject,
    html,
    text,
  });
}

export async function sendSmtpEmailsBulk(
  recipients: string[],
  params: Omit<SmtpEmailParams, "to">
): Promise<{ sent: string[]; failed: { email: string; error: string }[] }> {
  const transport = createTransport();
  const html = renderKhinextEmail(params);
  const text = params.text ?? stripHtml(params.body);

  const sent: string[] = [];
  const failed: { email: string; error: string }[] = [];

  // Send sequentially to avoid overwhelming the SMTP server
  for (const to of recipients) {
    try {
      await transport.sendMail({
        from: FROM,
        to,
        replyTo: FROM_ADDRESS,
        subject: params.subject,
        html,
        text,
      });
      sent.push(to);
    } catch (err) {
      failed.push({ email: to, error: err instanceof Error ? err.message : String(err) });
    }
  }

  return { sent, failed };
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

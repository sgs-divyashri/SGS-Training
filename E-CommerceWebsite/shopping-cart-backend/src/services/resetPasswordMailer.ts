import "dotenv/config";
import Nodemailer from "nodemailer";

export type SendMailArgs = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
};

const PROVIDER = (process.env.MAIL_PROVIDER || "gmail_app").toLowerCase();

const sender = {
  name: process.env.MAIL_FROM_NAME || "Amzon",
  address: process.env.MAIL_FROM_ADDR || "",
};

if (!sender.address) {
  throw new Error(
    "MAIL_FROM_ADDR is required (use your verified Gmail address)"
  );
}

let transport: Nodemailer.Transporter;

if (PROVIDER === "gmail_app") {
  // Gmail via App Password (simple & reliable)
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error(
      "GMAIL_USER / GMAIL_APP_PASSWORD missing in .env for Gmail App Password"
    );
  }
    transport = Nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      logger: true,
      debug: true,
    });
} else {
  throw new Error(`Unknown MAIL_PROVIDER: ${PROVIDER} (expected 'gmail_app')`);
}

export async function sendMail({ to, subject, html, text }: SendMailArgs) {
  console.log("sendMail payload:", {
    to,
    subject,
    hasHtml: !!html,
    hasText: !!text,
    provider: PROVIDER,
    from: sender.address,
  });

  await transport.verify();
  console.log("SMTP verify: OK");

  const info = await transport.sendMail({
    from: sender, 
    to: [to],
    subject,
    text,
    html,
  });

  console.log("Mail sent:", {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    envelope: info.envelope,
    response: info.response,
  });

  return info;
}

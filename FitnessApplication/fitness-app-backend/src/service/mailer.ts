// src/service/mailer.ts
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
  name: process.env.MAIL_FROM_NAME || "Evogym",
  address: process.env.MAIL_FROM_ADDR || "",
};

if (!sender.address) {
  throw new Error(
    "MAIL_FROM_ADDR is required (use your verified Gmail address)"
  );
}

let transport: Nodemailer.Transporter;

if (PROVIDER === "gmail_app") {
  // ✅ Gmail via App Password (simple & reliable)
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error(
      "GMAIL_USER / GMAIL_APP_PASSWORD missing in .env for Gmail App Password"
    );
  }

  // Option A: Use `service: 'gmail'` helper
//   const transport = Nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user, // Your actual Gmail address
//       pass // The 16-char App Password (remove spaces if you want, usually works with them too)
//     },
//   });
    transport = Nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      logger: true,
      debug: true,
    });

  // Option B: Explicit SMTP host (either works)
  // transport = Nodemailer.createTransport({
  //   host: 'smtp.gmail.com',
  //   port: 465,
  //   secure: true, // implicit TLS
  //   auth: { user, pass },
  //   logger: true,
  //   debug: true,
  // });
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
    from: sender, // "Evogym" <divya0301shri@gmail.com>
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

// // src/service/mailer.ts
// import "dotenv/config";
// import Nodemailer from "nodemailer";
// import { MailtrapTransport } from "mailtrap";

// export type SendMailArgs = {
//   to: string;
//   subject: string;
//   html?: string;
//   text?: string;
// };

// const PROVIDER = (process.env.MAIL_PROVIDER || "mailtrap").toLowerCase();

// // Sender (must be verified/authorized in the chosen provider)
// const sender = {
//   name: process.env.MAIL_FROM_NAME || "Evogym",
//   address: process.env.MAIL_FROM_ADDR || "", // e.g., 'noreply@yourdomain.com'
// };

// if (!sender.address) {
//   console.warn("MAIL_FROM_ADDR is empty. Set a verified sender in your .env");
// }

// // Build transport per provider
// let transport: Nodemailer.Transporter;
// // ✅ Mailtrap Email Sending - SMTP (production-capable)
// // Get SMTP creds from Mailtrap → Sending → SMTP
// const user = process.env.MAILTRAP_SMTP_USER;
// const pass = process.env.MAILTRAP_SMTP_PASS;

// if (!user || !pass) {
//   throw new Error(
//     "MAILTRAP_SMTP_USER / MAILTRAP_SMTP_PASS missing in .env for Mailtrap SMTP"
//   );
// }

// transport = Nodemailer.createTransport({
//   host: "live.smtp.mailtrap.io",
//   port: 587,
//   secure: false,
//   auth: { user, pass },
//   logger: true,
//   debug: true,
// });

// export async function sendMail({ to, subject, html, text }: SendMailArgs) {
//   // Basic payload sanity log
//   console.log("sendMail payload:", {
//     to,
//     subject,
//     hasHtml: !!html,
//     hasText: !!text,
//     provider: PROVIDER,
//     from: sender.address,
//   });

//   try {
//     // Verify connection and credentials first (fast failure if Unauthorized)
//     await transport.verify();
//     console.log("SMTP verify: OK");

//     const info = await transport.sendMail({
//       from: sender, // e.g., "Evogym" <noreply@yourdomain.com>
//       to: [to],
//       subject,
//       text,
//       html,
//     });

//     // Correct Nodemailer fields (no 'info.success')
//     console.log("Mail sent:", {
//       messageId: info.messageId,
//       accepted: info.accepted,
//       rejected: info.rejected,
//       envelope: info.envelope,
//       response: info.response,
//     });

//     return info;
//   } catch (err: any) {
//     console.error("Mail send failed:", {
//       name: err?.name,
//       message: err?.message,
//       code: err?.code, // e.g., 'EAUTH', 'EDNS'
//       response: err?.response,
//       command: err?.command,
//       status: err?.status,
//       provider: PROVIDER,
//     });
//     throw new Error(`Mail sending failed: ${err?.message || "Unknown error"}`);
//   }
// }

import { Request, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { generateToken } from "../../authentication/authentication";
import { UserPayload } from "../../models/userTableDefinition";
import { sendMail } from "../../services/resetPasswordMailer";
import { normalizeEmail } from "../../services/emailValidation";

export const forgotPasswordUserHandler = async (
  request: Request,
  h: ResponseToolkit
) => {
  try {
    const payload = request.payload as Pick<UserPayload, "email" | "name">;

    if (!payload.email) {
      return h.response({ error: "Email is required" }).code(400);
    }

    const email = normalizeEmail(payload.email);

    // Validate credentials
    const user = await userServices.forgotPassword(payload);

    if (!user) {
      return h.response({ error: "Invalid email" }).code(401);
    }

    const token = generateToken(
      {
        userId: user.getDataValue("userId"),
        email: user.getDataValue("email"),
        purpose: 'password_reset'
      },
      { expiresIn: "15m" } // adjust to your auth helper's options
    );

    const FRONTEND_ORIGIN =
      process.env.FRONTEND_ORIGIN || "http://localhost:5173";
    const resetUrl = `${FRONTEND_ORIGIN}/reset-password?token=${encodeURIComponent(
      token
    )}`;

    await sendMail({
      to: email,
      subject: "Reset your Amazon Password",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
          <h2 style="margin:0 0 12px;">Reset your password</h2>
          <p>We received a request to reset your password. Click the button below to proceed. This link expires in 15 minutes.</p>
          <p style="margin:16px 0;">
            <a href="${resetUrl}" 
style="display:inline-block;background:#2563eb;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;">
              Reset Password
            </a>
          </p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `,

    //   text: `Hello ${payload.name},\n\nThanks for registering with Evogym!\n\nRegards,\nEvogym Team`,
    });

    return h
      .response({
        message: "If this email exists, a reset link has been sent.",
        token,
      })
      .code(200);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(500);
  }
};

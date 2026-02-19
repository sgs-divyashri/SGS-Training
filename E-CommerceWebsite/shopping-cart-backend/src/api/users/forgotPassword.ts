import { Request, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../services/userServices";
import { generateToken } from "../../authentication/authentication";
import { UserPayload } from "../../models/userTableDefinition";
import { sendMail } from "../../services/resetPasswordMailer";

export const forgotPasswordUserHandler = async (
  request: Request,
  h: ResponseToolkit,
) => {
  try {
    const payload = request.payload as Pick<UserPayload, "email">;

    if (!payload.email) {
      return h.response({ error: "Email is required" }).code(400);
    }

    const user = await userServices.forgotPassword(payload);

    if (!user) {
      return h
        .response({
          error: "If this email exists, a reset link has been sent.",
        })
        .code(401);
    }

    const { accessToken } = generateToken(
      {
        userId: user.getDataValue("userId"),
        email: user.getDataValue("email"),
        purpose: "password_reset",
        role: user.getDataValue("role"),
      },
      { expiresIn: "15m", accessOnly: true },
    );

    const FRONTEND_ORIGIN =
      process.env.FRONTEND_ORIGIN || "http://localhost:5173";
    const resetUrl = `${FRONTEND_ORIGIN}/reset-password?token=${encodeURIComponent(
      accessToken,
    )}`;

    await sendMail({
      to: payload.email,
      subject: "Reset your Amazon Password",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:black">
          <h2 style="margin:0 0 12px;">Reset your password</h2>
          <p>We received a request to reset your password. Click the button below to proceed. This link expires in 15 minutes.</p>
          <p style="margin:16px 0;">
            <a href="${resetUrl}" 
style="display:inline-block;background:blue;color:white;padding:10px 16px;border-radius:8px;text-decoration:none;">
              Reset Password
            </a>
          </p>
          <p style="margin-top:12px;color:black">If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>

          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
      // text: `If the button doesn't work, copy and paste this link into your browser: \n${resetUrl}`,
    });

    return h
      .response({
        message: "If this email exists, a reset link has been sent.",
        token: accessToken,
      })
      .code(200);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message || "Server error" }).code(500);
  }
};

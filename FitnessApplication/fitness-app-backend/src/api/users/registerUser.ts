import type { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { userServices } from "../../service/userServices";
import { validateEmail, normalizeEmail } from "../../service/emailValidation";
import { UserPayload } from "../../models/userTableDefinition";
import { passwordServices } from "../../service/passwordServices";
import { sendMail } from "../../service/mailer";

export const registerUserHandler = async (
  request: Request,
  h: ResponseToolkit
): Promise<ResponseObject> => {
  try {
    const payload = request.payload as Pick<
      UserPayload,
      "name" | "email" | "password" | "age"
    >;

    if (!payload.name || !payload.email || !payload.password || !payload.age) {
      return h.response({ error: "Bad Request" }).code(400);
    }
    const email = normalizeEmail(payload.email)
    // const validEmail = validateEmail(payload.email);

    if (!validateEmail(email)) {
      return h.response({ error: "Invalid email format" }).code(400);
    }

    // Check if email already exists
    const existingUser = await userServices.findByEmail(email);
    if (existingUser) {
      return h.response({ error: "Email already registered" }).code(409);
    }

    const policy = passwordServices.validatePasswordPolicy(payload.password);

    if (!policy.ok) {
      return h
        .response({ error: "Weak password", reasons: policy.errors })
        .code(400);
    }

    const newUser = await userServices.createUser({
      name: payload.name,
      email: email,
      password: payload.password,
      age: payload.age,
    });

    await sendMail({
      to: email,
      subject: "Welcome to Evogym",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Hello ${payload.name},</h2>
          <p>Thanks for registering with Evogym ✨!</p>
          <p>We're excited to help you stay fit and healthy.</p>
          <p>Regards,<br/>Evogym Team</p>
        </div>
      `,
      text: `Hello ${payload.name},\n\nThanks for registering with Evogym!\n\nRegards,\nEvogym Team`,
    });

    return h
      .response({
        message: "Inserted successfully!",
        userID: newUser.userId,
      })
      .code(201);
  } catch (err: any) {
    console.error(err);
    return h.response({ error: err.message }).code(500);
  }
};

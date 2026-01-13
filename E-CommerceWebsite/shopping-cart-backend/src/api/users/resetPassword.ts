import { Request, ResponseToolkit } from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "../../config/constants";
import { userServices } from "../../services/userServices";

export async function resetPasswordHandler(request: Request, h: ResponseToolkit) {
  try {
    // 1) Get Bearer token from Authorization header (preferred)
    const authHeader = request.headers['authorization'] || request.headers['Authorization'] as string | undefined;
    const bearerPrefix = 'Bearer ';
    const tokenFromHeader =
      authHeader && authHeader.startsWith(bearerPrefix)
        ? authHeader.slice(bearerPrefix.length).trim()
        : undefined;

    // 2) Also support token in body for fallback (optional)
    const { token: tokenFromBody, password } = request.payload as { token?: string; password: string };

    // 3) Choose header token first, else body token
    const token = tokenFromHeader || tokenFromBody;

    if (!token || !password) {
      return h.response({ error: "Token and Password are required" }).code(400);
    }

    // 4) Decode + verify token
    const artifacts = Jwt.token.decode(token);
    Jwt.token.verify(artifacts, { key: JWT_SECRET, algorithm: 'HS256' });

    // 5) Claims
    const claims = artifacts.decoded.payload as {
      userId: number;
      email?: string;
      purpose?: "password_reset" | "auth";
      aud?: string;
      iss?: string;
      iat?: number;
      exp?: number;
    };

    // 6) Custom checks
    if (claims.purpose !== "password_reset") {
      return h.response({ error: "Invalid token purpose" }).code(400);
    }
    if (claims.aud !== "urn:audience:test" || claims.iss !== "urn:issuer:test") {
      return h.response({ error: "Invalid token audience/issuer" }).code(401);
    }

    // 7) Hash + update
    const hash = await bcrypt.hash(password, 10);
    await userServices.updatePassword(claims.userId, hash);

    return h.response({ message: "Password updated successfully." }).code(200);
  } catch (err: any) {
    console.error("resetPasswordHandler error:", err);
    const msg = String(err?.message || "");
    if (msg.toLowerCase().includes("token") || msg.toLowerCase().includes("verify")) {
      return h.response({ error: "Invalid or expired token" }).code(401);
    }
    return h.response({ error: "Internal server error" }).code(500);
  }
}





// import { Request, ResponseToolkit } from "@hapi/hapi";
// import Jwt from "@hapi/jwt";
// import bcrypt from "bcrypt";
// import { JWT_SECRET } from "../../config/constants";
// import { userServices } from "../../services/userServices";

// export async function resetPasswordHandler(request: Request, h: ResponseToolkit) {
//   try {
//     const { token, password } = request.payload as { token: string; password: string };
//     if (!token || !password) {
//       return h.response({ error: "Token and Password are required" }).code(400);
//     }

//     // 1) Decode the token
//     const artifacts = Jwt.token.decode(token);

//     // 2) Verify signature + expiry (throws on failure)
//     Jwt.token.verify(artifacts, { key: JWT_SECRET, algorithm: 'HS256' });

//     // 3) Read claims
//     const claims = artifacts.decoded.payload as {
//       userId: number;
//       email?: string;
//       purpose?: "password_reset" | "auth";
//       aud?: string;
//       iss?: string;
//       iat?: number;
//       exp?: number;
//     };

//     // 4) Enforce your custom claims
//     if (claims.purpose !== "password_reset") {
//       return h.response({ error: "Invalid token purpose" }).code(400);
//     }
//     if (claims.aud !== "urn:audience:test" || claims.iss !== "urn:issuer:test") {
//       return h.response({ error: "Invalid token audience/issuer" }).code(401);
//     }

//     // 5) Hash and update password
//     const hash = await bcrypt.hash(password, 10);
//     await userServices.updatePassword(claims.userId, hash);

//     return h.response({ message: "Password updated successfully." }).code(200);
//   } catch (err: any) {
//     // If verify() throws for invalid/expired tokens, you’ll land here
//     console.error("resetPasswordHandler error:", err);
//     // Return 401 if verification failed; otherwise 500
//     const msg = String(err?.message || "");
//     if (msg.toLowerCase().includes("token") || msg.toLowerCase().includes("verify")) {
//       return h.response({ error: "Invalid or expired token" }).code(401);
//     }
//     return h.response({ error: "Internal server error" }).code(500);
//   }
// }

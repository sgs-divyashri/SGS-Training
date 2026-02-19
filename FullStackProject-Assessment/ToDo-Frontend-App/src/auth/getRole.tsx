import { decodeToken } from "./decodeToken";
import { isTokenExpired } from "./isTokenExpired";

export type Role = "Admin" | "User";

export const getRole = (): Role | null => {
  const c = decodeToken();
  if (!c || isTokenExpired(c)) return null;
  try {
    if (c.role === "Admin" || c.role === "User") {
      return c.role;
    }
    return null;
  } catch {
    return null;
  }
}
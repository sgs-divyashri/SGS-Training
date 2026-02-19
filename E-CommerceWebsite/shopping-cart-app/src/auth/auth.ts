import { jwtDecode } from "jwt-decode";

export type Claims = {
  userId?: number;
  email?: string;
  role?: string;
  exp?: number;
};

export const getToken = (): string | null => {
  const t = localStorage.getItem("token");
  return typeof t === "string" && t.trim() ? t : null;
}

export const decodeToken = (): Claims | null => {
  const t = getToken();
  if (!t) return null;
  try {
    return jwtDecode(t) as Claims;
  } catch {
    return null;
  }
}

export const isTokenExpired = (c: Claims | null): boolean => {
  if (!c?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return c.exp <= now;
}

export const isAuthenticated = (): boolean => {
  const c = decodeToken();
  return !!c && !isTokenExpired(c);
}

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

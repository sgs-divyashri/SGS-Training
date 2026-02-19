import { Claims } from "../types/tokenClaimsType";
import { getToken } from "./getToken";
import { jwtDecode } from "jwt-decode";

export const decodeToken = (): Claims | null => {
  const t = getToken();
  if (!t) return null;
  try {
    return jwtDecode(t) as Claims;
  } catch {
    return null;
  }
}
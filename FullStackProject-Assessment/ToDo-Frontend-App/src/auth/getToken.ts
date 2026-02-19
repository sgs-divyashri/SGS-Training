export const getToken = (): string | null => {
  const t = localStorage.getItem("token");
  return typeof t === "string" && t.trim() ? t : null;
}
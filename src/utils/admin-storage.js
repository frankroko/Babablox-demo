const ADMIN_TOKEN_KEY = "adminAuthToken";
const ADMIN_USER_KEY = "adminUser";

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function getAdminUser() {
  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to parse admin user:", error);
    return null;
  }
}

export function setAdminUser(user) {
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function clearAdminUser() {
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function clearAdminAuth() {
  clearAdminToken();
  clearAdminUser();
}

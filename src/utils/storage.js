export function getJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error("Failed to parse localStorage key:", key, error);
    return fallback;
  }
}

export function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getAuthToken() {
  return localStorage.getItem("authToken");
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("authToken", token);
  }
}

export function clearAuthToken() {
  localStorage.removeItem("authToken");
}

export function getCurrentUser() {
  return getJSON("currentUser", null);
}

export function setCurrentUser(user) {
  setJSON("currentUser", user);
}

export function clearAuth() {
  localStorage.removeItem("currentUser");
  clearAuthToken();
}

export function getRememberedEmail() {
  return localStorage.getItem("rememberedEmail");
}

export function setRememberedEmail(email) {
  if (email) {
    localStorage.setItem("rememberedEmail", email);
  }
}

export function clearRememberedEmail() {
  localStorage.removeItem("rememberedEmail");
}

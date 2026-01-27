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

export function getCurrentUser() {
  return getJSON("currentUser", null);
}

export function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true" && !!getCurrentUser();
}

export function setLoggedInUser(user) {
  setJSON("currentUser", user);
  localStorage.setItem("isLoggedIn", "true");
}

export function clearAuth() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isLoggedIn");
}

export function getCart() {
  return getJSON("cart", []);
}

export function setCart(cart) {
  setJSON("cart", cart);
}

export function getOrderHistory() {
  return getJSON("orderHistory", []);
}

export function setOrderHistory(history) {
  setJSON("orderHistory", history);
}

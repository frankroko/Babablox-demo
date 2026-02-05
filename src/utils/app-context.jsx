import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "./api.js";
import { clearAuth, getAuthToken, getCurrentUser, setCurrentUser } from "./storage.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => (getAuthToken() ? getCurrentUser() : null));
  const [cartCount, setCartCount] = useState(0);
  const [authReady, setAuthReady] = useState(false);

  const refreshAuth = useCallback(async () => {
    setAuthReady(false);
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setAuthReady(true);
      return;
    }

    try {
      const data = await apiFetch("/api/auth/me");
      setUser(data.user);
      setCurrentUser(data.user);
    } catch (error) {
      clearAuth();
      setUser(null);
    } finally {
      setAuthReady(true);
    }
  }, []);

  const refreshCart = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const cart = await apiFetch("/api/cart");
      const count = (cart.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(count);
    } catch (error) {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    if (authReady) {
      refreshCart();
    }
  }, [authReady, refreshCart]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      cartCount,
      setCartCount,
      authReady,
      refreshAuth,
      refreshCart,
    }),
    [user, cartCount, authReady, refreshAuth, refreshCart]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return ctx;
}

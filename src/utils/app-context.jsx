import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getCart, getCurrentUser, isLoggedIn } from "./storage.js";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => (isLoggedIn() ? getCurrentUser() : null));
  const [cartCount, setCartCount] = useState(() =>
    getCart().reduce((sum, item) => sum + (item.quantity || 0), 0)
  );

  const refreshAuth = useCallback(() => {
    setUser(isLoggedIn() ? getCurrentUser() : null);
  }, []);

  const refreshCart = useCallback(() => {
    setCartCount(getCart().reduce((sum, item) => sum + (item.quantity || 0), 0));
  }, []);

  useEffect(() => {
    refreshAuth();
    refreshCart();
  }, [refreshAuth, refreshCart]);

  const value = useMemo(
    () => ({ user, setUser, cartCount, refreshAuth, refreshCart }),
    [user, cartCount, refreshAuth, refreshCart]
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

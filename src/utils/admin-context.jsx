import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { adminApiFetch } from "./admin-api.js";
import { clearAdminAuth, getAdminToken, getAdminUser, setAdminUser } from "./admin-storage.js";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [adminUser, setAdminUserState] = useState(() => getAdminUser());
  const [adminReady, setAdminReady] = useState(false);

  const refreshAdminAuth = useCallback(async () => {
    setAdminReady(false);
    const token = getAdminToken();
    if (!token) {
      setAdminUserState(null);
      setAdminReady(true);
      return;
    }

    try {
      const data = await adminApiFetch("/api/auth/me");
      setAdminUserState(data.user);
      setAdminUser(data.user);
    } catch (error) {
      clearAdminAuth();
      setAdminUserState(null);
    } finally {
      setAdminReady(true);
    }
  }, []);

  const adminLogout = useCallback(async () => {
    try {
      await adminApiFetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      // ignore
    }
    clearAdminAuth();
    setAdminUserState(null);
    setAdminReady(true);
  }, []);

  useEffect(() => {
    refreshAdminAuth();
  }, [refreshAdminAuth]);

  const value = useMemo(
    () => ({
      adminUser,
      setAdminUser: setAdminUserState,
      adminReady,
      refreshAdminAuth,
      adminLogout,
    }),
    [adminUser, adminReady, refreshAdminAuth, adminLogout]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminContext() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdminContext must be used inside AdminProvider");
  }
  return ctx;
}

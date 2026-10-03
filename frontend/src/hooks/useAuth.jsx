import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, getToken, onUnauthorized, setToken } from "../lib/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onUnauthorized(() => setUser(null)), []);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const me = await api.me();
        if (!cancelled) setUser(me);
      } catch {
        setToken(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email, password) => {
    await api.login(email, password);
    const me = await api.me();
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (data) => {
    const resp = await api.register(data);
    setToken(resp.access_token);
    const me = await api.me();
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

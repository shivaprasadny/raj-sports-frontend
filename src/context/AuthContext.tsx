import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../types/user";
import { authStorage } from "../utils/authStorage";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  // True while the initial localStorage restore is in-flight.
  // ProtectedRoute must wait for isLoading=false before checking isAuthenticated,
  // otherwise the protected page redirects to /login on every browser refresh.
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // isLoading starts true and becomes false once localStorage has been read.
  // Components that gate on isAuthenticated must suspend rendering until then.
  const [isLoading, setIsLoading] = useState(true);

  // Restore auth state from localStorage on first mount.
  // This runs after the first render, which is why ProtectedRoute must not
  // act on isAuthenticated until isLoading is false.
  useEffect(() => {
    const storedToken = authStorage.getToken();
    const storedUser = authStorage.getUser();

    if (storedToken && storedUser) {
      // Both values present — restore the session.
      setToken(storedToken);
      setUser(storedUser);
    } else if (storedToken || storedUser) {
      // Partial data — inconsistent state, clear it to force re-login.
      authStorage.clear();
    }

    setIsLoading(false);
  }, []);

  // Persists the session after a successful API login response.
  const login = (newToken: string, newUser: AuthUser) => {
    authStorage.save(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  };

  // Wipes the session on explicit logout.
  // axiosClient also calls authStorage.clear() on 401 responses.
  const logout = () => {
    authStorage.clear();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import type { AuthUser } from "../types/user";

// Single source of truth for the localStorage keys used by auth.
// Both AuthContext and axiosClient must read/write through these helpers
// so the key strings are never duplicated or accidentally mismatched.
const TOKEN_KEY = "accessToken";
const USER_KEY = "authUser";

export const authStorage = {
  /** Returns the stored JWT token, or null if none exists. */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /** Returns the stored AuthUser, or null if none exists or JSON is corrupt. */
  getUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      // Corrupt data — treat as unauthenticated and let the caller clean up.
      return null;
    }
  },

  /** Persists the token and user together after a successful login. */
  save(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /** Removes both token and user — called on logout or 401 responses. */
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "CUSTOMER";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
}

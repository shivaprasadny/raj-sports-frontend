export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "CUSTOMER";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
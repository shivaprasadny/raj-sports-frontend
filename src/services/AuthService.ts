import axiosClient from "../api/axiosClient";
import type { ApiUser, AuthUser } from "../types/user";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: ApiUser;
}

export const mapApiUserToAuthUser = (user: ApiUser): AuthUser => ({
  id: user.id,
  name: `${user.firstName} ${user.lastName}`.trim(),
  email: user.email,
  phone: user.phone ?? undefined,
  role: user.role,
});

export const AuthService = {
  async login(payload: LoginRequest) {
    const response = await axiosClient.post<ApiResponse<LoginResponse>>("/auth/login", payload);

    return {
      token: response.data.data.accessToken,
      tokenType: response.data.data.tokenType,
      expiresIn: response.data.data.expiresIn,
      user: mapApiUserToAuthUser(response.data.data.user),
    };
  },

  async register(payload: RegisterRequest) {
    const response = await axiosClient.post<ApiResponse<ApiUser>>("/auth/register", payload);

    return mapApiUserToAuthUser(response.data.data);
  },

  async getCurrentUser() {
    const response = await axiosClient.get<ApiResponse<ApiUser>>("/auth/me");

    return mapApiUserToAuthUser(response.data.data);
  },
};

import { request } from "./client";

export interface AuthUserResponse {
  id: string;
  email: string;
  fullName: string;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

const AUTH_PREFIX = "/api/auth";

export const authApi = {
  register(payload: RegisterPayload) {
    return request<AuthUserResponse>(`${AUTH_PREFIX}/register`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  login(payload: LoginPayload) {
    return request<AuthUserResponse>(`${AUTH_PREFIX}/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

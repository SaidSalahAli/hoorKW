import apiClient from 'lib/apiClient';
import type { LoginPayload, AuthUser, ApiResponse } from 'types/cms';

// ==============================|| API — AUTH ||============================== //

export const authApi = {
  login: async (payload: LoginPayload) => {
    const res = await apiClient.post<ApiResponse<{ user: AuthUser; token: string }>>('/api/auth/login', payload);
    return res.data.data;
  },

  logout: async () => {
    const res = await apiClient.post('/api/auth/logout');
    return res.data;
  },

  me: async () => {
    const res = await apiClient.get<ApiResponse<AuthUser>>('/api/auth/me');
    return res.data.data;
  }
};

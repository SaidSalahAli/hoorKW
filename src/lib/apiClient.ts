import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession, signOut } from 'next-auth/react';

// ==============================|| API CLIENT — PHP CMS ||============================== //

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// ── Request interceptor: inject Bearer token ──────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    // Only attach token in browser context
    if (typeof window !== 'undefined') {
      const session = await getSession();
      const token = (session as any)?.token?.accessToken;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: global 401 handling ─────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (typeof window !== 'undefined') {
      if (error?.response?.status === 401 && !window.location.href.includes('/login')) {
        await signOut({ redirect: false });
        window.location.pathname = '/login';
      }
    }
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'حدث خطأ غير متوقع';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;

// ── SWR fetcher (JSON responses) ─────────────────────────────────────────
export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await apiClient.get(url, { ...config });
  return res.data;
};

// ── Multipart fetcher (FormData — image uploads) ──────────────────────────
export const formDataRequest = async (
  method: 'post' | 'put' | 'patch',
  url: string,
  data: FormData
) => {
  const res = await apiClient.request({
    method,
    url,
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession, signOut } from 'next-auth/react';

// ==============================|| API CLIENT — PHP CMS ||============================== //

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ── Public API client — NO auth interceptor (fast, for public pages) ──────
export const publicApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// ── Authenticated API client — with Bearer token (for dashboard) ──────────
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// ── Cached token — avoids calling getSession() on every request ───────────
let cachedToken: string | null = null;

export function setAuthToken(token: string | null) {
  cachedToken = token;
}

// ── Request interceptor: inject Bearer token ──────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      if (cachedToken) {
        config.headers['Authorization'] = `Bearer ${cachedToken}`;
      } else {
        const session = await getSession();
        const token = (session as any)?.token?.accessToken;
        if (token) {
          cachedToken = token;
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Shared Error Handler ──────────────────────────────────────────────────
const handleResponseError = async (error: any) => {
  if (typeof window !== 'undefined') {
    if (error?.response?.status === 401 && !window.location.href.includes('/login')) {
      cachedToken = null;
      await signOut({ redirect: false });
      window.location.pathname = '/login';
    }
  }
  const data = error?.response?.data;
  let message = data?.message || data?.error || error?.message || 'حدث خطأ غير متوقع';

  // If there are validation errors, extract the first one to make the error message clearer
  if (data?.errors && typeof data.errors === 'object') {
    const firstFieldErrors = Object.values(data.errors)[0];
    if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
      message = firstFieldErrors[0];
    }
  }

  return Promise.reject(new Error(message));
};

// ── Response interceptors ─────────────────────────────────────────────────
publicApiClient.interceptors.response.use((response) => response, handleResponseError);

apiClient.interceptors.response.use((response: AxiosResponse) => response, handleResponseError);

export default apiClient;

// ── SWR fetcher (authenticated) ───────────────────────────────────────────
export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await apiClient.get(url, { ...config });
  return res.data;
};

// ── SWR fetcher (public — no auth) ────────────────────────────────────────
export const publicFetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await publicApiClient.get(url, { ...config });
  return res.data;
};

// ── Multipart fetcher (FormData — image uploads) ──────────────────────────
export const formDataRequest = async (method: 'post' | 'put' | 'patch', url: string, data: FormData) => {
  const res = await apiClient.request({
    method,
    url,
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

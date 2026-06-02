import apiClient from 'lib/apiClient';
import type { ServiceRequest, RequestFormValues, TableFilters, PaginatedResponse, ApiResponse, RequestStatus } from 'types/cms';

// ==============================|| API — REQUESTS ||============================== //

export const requestsApi = {
  getAll: async (filters: TableFilters & { status?: RequestStatus } = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.per_page) params.append('per_page', String(filters.per_page));
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);

    const res = await apiClient.get<PaginatedResponse<ServiceRequest>>(`/api/requests?${params}`);
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<ApiResponse<ServiceRequest>>(`/api/requests/${id}`);
    return res.data.data;
  },

  /** Public: submit a service request from the website */
  submit: async (values: RequestFormValues) => {
    const res = await apiClient.post('/api/requests', values);
    return res.data;
  },

  updateStatus: async (id: number, status: RequestStatus) => {
    const res = await apiClient.patch(`/api/requests/${id}/status`, { status });
    return res.data;
  },

  delete: async (id: number) => {
    const res = await apiClient.delete(`/api/requests/${id}`);
    return res.data;
  }
};

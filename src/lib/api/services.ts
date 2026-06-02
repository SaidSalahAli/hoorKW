import apiClient, { formDataRequest } from 'lib/apiClient';
import type { Service, ServiceFormValues, TableFilters, PaginatedResponse, ApiResponse } from 'types/cms';

// ==============================|| API — SERVICES ||============================== //

export const servicesApi = {
  /** List with search / pagination / filters */
  getAll: async (filters: TableFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.per_page) params.append('per_page', String(filters.per_page));
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);

    const res = await apiClient.get<PaginatedResponse<Service>>(`/api/services?${params}`);
    return res.data;
  },

  /** Single service by ID */
  getById: async (id: number) => {
    const res = await apiClient.get<ApiResponse<Service>>(`/api/services/${id}`);
    return res.data.data;
  },

  /** Create — supports image upload */
  create: async (values: ServiceFormValues) => {
    const fd = buildFormData(values);
    return formDataRequest('post', '/api/services', fd);
  },

  /** Update — supports image upload */
  update: async (id: number, values: ServiceFormValues) => {
    const fd = buildFormData(values);
    fd.append('_method', 'PUT'); // PHP REST convention
    return formDataRequest('post', `/api/services/${id}`, fd);
  },

  /** Delete single */
  delete: async (id: number) => {
    const res = await apiClient.delete(`/api/services/${id}`);
    return res.data;
  },

  /** Bulk delete */
  bulkDelete: async (ids: number[]) => {
    const res = await apiClient.post('/api/services/bulk-delete', { ids });
    return res.data;
  }
};

// ── Helpers ──────────────────────────────────────────────────────────────
function buildFormData(values: ServiceFormValues): FormData {
  const fd = new FormData();
  fd.append('title', values.title);
  fd.append('slug', values.slug);
  fd.append('short_description', values.short_description);
  fd.append('description', values.description);
  fd.append('meta_title', values.meta_title);
  fd.append('meta_description', values.meta_description);
  fd.append('status', values.status);
  if (values.image instanceof File) fd.append('image', values.image);
  return fd;
}

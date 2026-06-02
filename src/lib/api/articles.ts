import apiClient, { formDataRequest } from 'lib/apiClient';
import type { Article, ArticleFormValues, TableFilters, PaginatedResponse, ApiResponse } from 'types/cms';

// ==============================|| API — ARTICLES ||============================== //

export const articlesApi = {
  getAll: async (filters: TableFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.per_page) params.append('per_page', String(filters.per_page));
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);

    const res = await apiClient.get<PaginatedResponse<Article>>(`/api/articles?${params}`);
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<ApiResponse<Article>>(`/api/articles/${id}`);
    return res.data.data;
  },

  getBySlug: async (slug: string) => {
    const res = await apiClient.get<ApiResponse<Article>>(`/api/articles/slug/${slug}`);
    return res.data.data;
  },

  create: async (values: ArticleFormValues) => {
    const fd = buildFormData(values);
    return formDataRequest('post', '/api/articles', fd);
  },

  update: async (id: number, values: ArticleFormValues) => {
    const fd = buildFormData(values);
    fd.append('_method', 'PUT');
    return formDataRequest('post', `/api/articles/${id}`, fd);
  },

  delete: async (id: number) => {
    const res = await apiClient.delete(`/api/articles/${id}`);
    return res.data;
  },

  bulkDelete: async (ids: number[]) => {
    const res = await apiClient.post('/api/articles/bulk-delete', { ids });
    return res.data;
  }
};

function buildFormData(values: ArticleFormValues): FormData {
  const fd = new FormData();
  fd.append('title', values.title);
  fd.append('slug', values.slug);
  fd.append('excerpt', values.excerpt);
  fd.append('content', values.content);
  fd.append('meta_title', values.meta_title);
  fd.append('meta_description', values.meta_description);
  fd.append('status', values.status);
  if (values.image instanceof File) fd.append('image', values.image);
  return fd;
}

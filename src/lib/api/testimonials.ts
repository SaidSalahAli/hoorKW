import apiClient, { formDataRequest } from 'lib/apiClient';
import type { Testimonial, TestimonialFormValues, TableFilters, PaginatedResponse, ApiResponse } from 'types/cms';

// ==============================|| API — TESTIMONIALS ||============================== //

export const testimonialsApi = {
  getAll: async (filters: TableFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.per_page) params.append('per_page', String(filters.per_page));

    const res = await apiClient.get<PaginatedResponse<Testimonial>>(`/api/testimonials?${params}`);
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<ApiResponse<Testimonial>>(`/api/testimonials/${id}`);
    return res.data.data;
  },

  create: async (values: TestimonialFormValues) => {
    const fd = buildFormData(values);
    return formDataRequest('post', '/api/testimonials', fd);
  },

  update: async (id: number, values: TestimonialFormValues) => {
    const fd = buildFormData(values);
    fd.append('_method', 'PUT');
    return formDataRequest('post', `/api/testimonials/${id}`, fd);
  },

  delete: async (id: number) => {
    const res = await apiClient.delete(`/api/testimonials/${id}`);
    return res.data;
  }
};

function buildFormData(values: TestimonialFormValues): FormData {
  const fd = new FormData();
  fd.append('name', values.name);
  fd.append('job_title', values.job_title);
  fd.append('comment', values.comment);
  fd.append('rating', String(values.rating));
  fd.append('status', values.status);
  if (values.image instanceof File) fd.append('image', values.image);
  return fd;
}

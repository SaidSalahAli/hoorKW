import apiClient, { formDataRequest } from 'lib/apiClient';
import type { GalleryImage, GalleryFormValues, TableFilters, PaginatedResponse } from 'types/cms';

// ==============================|| API — GALLERY ||============================== //

export const galleryApi = {
  getAll: async (filters: TableFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.per_page) params.append('per_page', String(filters.per_page));

    const res = await apiClient.get<PaginatedResponse<GalleryImage>>(`/api/gallery?${params}`);
    return res.data;
  },

  upload: async (values: GalleryFormValues) => {
    const fd = new FormData();
    fd.append('title', values.title);
    if (values.image instanceof File) fd.append('image', values.image);
    return formDataRequest('post', '/api/gallery', fd);
  },

  delete: async (id: number) => {
    const res = await apiClient.delete(`/api/gallery/${id}`);
    return res.data;
  },

  bulkDelete: async (ids: number[]) => {
    const res = await apiClient.post('/api/gallery/bulk-delete', { ids });
    return res.data;
  }
};

'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { galleryApi } from 'lib/api/gallery';
import type { TableFilters, GalleryFormValues } from 'types/cms';

// ==============================|| HOOKS — GALLERY ||============================== //

export function useGallery(initialFilters: TableFilters = {}) {
  const [filters, setFilters] = useState<TableFilters>({ page: 1, per_page: 20, ...initialFilters });

  const { data, error, isLoading, mutate } = useSWR(
    ['gallery', filters],
    () => galleryApi.getAll(filters),
    { revalidateOnFocus: false }
  );

  const updateFilters = useCallback((next: Partial<TableFilters>) => {
    setFilters((prev) => ({ ...prev, page: 1, ...next }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return { images: data?.data ?? [], meta: data?.meta, isLoading, error, filters, updateFilters, setPage, mutate };
}

export function useMutateGallery() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (values: GalleryFormValues) => {
    setIsLoading(true); setError(null);
    try { return await galleryApi.upload(values); }
    catch (e: any) { setError(e.message); throw e; }
    finally { setIsLoading(false); }
  };

  const remove = async (id: number) => {
    setIsLoading(true);
    try { await galleryApi.delete(id); }
    finally { setIsLoading(false); }
  };

  const bulkRemove = async (ids: number[]) => {
    setIsLoading(true);
    try { await galleryApi.bulkDelete(ids); }
    finally { setIsLoading(false); }
  };

  return { upload, remove, bulkRemove, isLoading, error };
}

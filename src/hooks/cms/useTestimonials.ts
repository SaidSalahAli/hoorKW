'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { testimonialsApi } from 'lib/api/testimonials';
import type { TableFilters, TestimonialFormValues } from 'types/cms';

// ==============================|| HOOKS — TESTIMONIALS ||============================== //

export function useTestimonials(initialFilters: TableFilters = {}) {
  const [filters, setFilters] = useState<TableFilters>({ page: 1, per_page: 10, ...initialFilters });

  const { data, error, isLoading, mutate } = useSWR(
    ['testimonials', filters],
    () => testimonialsApi.getAll(filters),
    { revalidateOnFocus: false }
  );

  const updateFilters = useCallback((next: Partial<TableFilters>) => {
    setFilters((prev) => ({ ...prev, page: 1, ...next }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return { testimonials: data?.data ?? [], meta: data?.meta, isLoading, error, filters, updateFilters, setPage, mutate };
}

export function useMutateTestimonial() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (values: TestimonialFormValues) => {
    setIsLoading(true); setError(null);
    try { return await testimonialsApi.create(values); }
    catch (e: any) { setError(e.message); throw e; }
    finally { setIsLoading(false); }
  };

  const update = async (id: number, values: TestimonialFormValues) => {
    setIsLoading(true); setError(null);
    try { return await testimonialsApi.update(id, values); }
    catch (e: any) { setError(e.message); throw e; }
    finally { setIsLoading(false); }
  };

  const remove = async (id: number) => {
    setIsLoading(true);
    try { await testimonialsApi.delete(id); }
    finally { setIsLoading(false); }
  };

  return { create, update, remove, isLoading, error };
}

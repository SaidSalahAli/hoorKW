'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { servicesApi } from 'lib/api/services';
import type { TableFilters, ServiceFormValues } from 'types/cms';

// ==============================|| HOOKS — SERVICES ||============================== //

export function useServices(initialFilters: TableFilters = {}) {
  const [filters, setFilters] = useState<TableFilters>({ page: 1, per_page: 10, ...initialFilters });

  const { data, error, isLoading, mutate } = useSWR(
    ['services', filters],
    () => servicesApi.getAll(filters),
    { revalidateOnFocus: false }
  );

  const updateFilters = useCallback((next: Partial<TableFilters>) => {
    setFilters((prev) => ({ ...prev, page: 1, ...next }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return {
    services: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error,
    filters,
    updateFilters,
    setPage,
    mutate
  };
}

export function useService(id: number | null) {
  const { data, error, isLoading } = useSWR(
    id ? `services/${id}` : null,
    () => servicesApi.getById(id!),
    { revalidateOnFocus: false }
  );
  return { service: data, isLoading, error };
}

export function useCreateService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (values: ServiceFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await servicesApi.create(values);
      return result;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}

export function useUpdateService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: number, values: ServiceFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await servicesApi.update(id, values);
      return result;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { update, isLoading, error };
}

export function useDeleteService() {
  const [isLoading, setIsLoading] = useState(false);

  const remove = async (id: number) => {
    setIsLoading(true);
    try {
      await servicesApi.delete(id);
    } finally {
      setIsLoading(false);
    }
  };

  const bulkRemove = async (ids: number[]) => {
    setIsLoading(true);
    try {
      await servicesApi.bulkDelete(ids);
    } finally {
      setIsLoading(false);
    }
  };

  return { remove, bulkRemove, isLoading };
}

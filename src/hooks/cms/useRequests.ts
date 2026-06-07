'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { requestsApi } from 'lib/api/requests';
import type { TableFilters, RequestStatus } from 'types/cms';

// ==============================|| HOOKS — REQUESTS ||============================== //

export function useRequests(initialFilters: TableFilters & { status?: RequestStatus } = {}) {
  const [filters, setFilters] = useState({ page: 1, per_page: 10, ...initialFilters });

  const { data, error, isLoading, mutate } = useSWR(['requests', filters], () => requestsApi.getAll(filters), { revalidateOnFocus: false });

  const updateFilters = useCallback((next: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, page: 1, ...next }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return { requests: data?.data ?? [], meta: data?.meta, isLoading, error, filters, updateFilters, setPage, mutate };
}

export function useRequest(id: number | null) {
  const { data, error, isLoading } = useSWR(id ? `requests/${id}` : null, () => requestsApi.getById(id!), { revalidateOnFocus: false });
  return { request: data, isLoading, error };
}

export function useUpdateRequestStatus() {
  const [isLoading, setIsLoading] = useState(false);

  const updateStatus = async (id: number, status: RequestStatus) => {
    setIsLoading(true);
    try {
      return await requestsApi.updateStatus(id, status);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateStatus, isLoading };
}

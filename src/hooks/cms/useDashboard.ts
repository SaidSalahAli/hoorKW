'use client';

import useSWR from 'swr';
import { dashboardApi } from 'lib/api/dashboard';

// ==============================|| HOOKS — DASHBOARD ||============================== //

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR('dashboard-stats', dashboardApi.getStats, {
    revalidateOnFocus: false,
    refreshInterval: 60000 // refresh every 60s
  });
  return { stats: data, isLoading, error, mutate };
}

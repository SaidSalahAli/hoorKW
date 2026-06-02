import apiClient from 'lib/apiClient';
import type { DashboardStats, ApiResponse } from 'types/cms';

// ==============================|| API — DASHBOARD ||============================== //

export const dashboardApi = {
  getStats: async () => {
    const res = await apiClient.get<ApiResponse<DashboardStats>>('/api/dashboard/stats');
    return res.data.data;
  }
};

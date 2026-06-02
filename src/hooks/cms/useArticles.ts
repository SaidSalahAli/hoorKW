'use client';

import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { articlesApi } from 'lib/api/articles';
import type { TableFilters, ArticleFormValues } from 'types/cms';

// ==============================|| HOOKS — ARTICLES ||============================== //

export function useArticles(initialFilters: TableFilters = {}) {
  const [filters, setFilters] = useState<TableFilters>({ page: 1, per_page: 10, ...initialFilters });

  const { data, error, isLoading, mutate } = useSWR(
    ['articles', filters],
    () => articlesApi.getAll(filters),
    { revalidateOnFocus: false }
  );

  const updateFilters = useCallback((next: Partial<TableFilters>) => {
    setFilters((prev) => ({ ...prev, page: 1, ...next }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return { articles: data?.data ?? [], meta: data?.meta, isLoading, error, filters, updateFilters, setPage, mutate };
}

export function useArticle(id: number | null) {
  const { data, error, isLoading } = useSWR(
    id ? `articles/${id}` : null,
    () => articlesApi.getById(id!),
    { revalidateOnFocus: false }
  );
  return { article: data, isLoading, error };
}

export function useMutateArticle() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (values: ArticleFormValues) => {
    setIsLoading(true); setError(null);
    try { return await articlesApi.create(values); }
    catch (e: any) { setError(e.message); throw e; }
    finally { setIsLoading(false); }
  };

  const update = async (id: number, values: ArticleFormValues) => {
    setIsLoading(true); setError(null);
    try { return await articlesApi.update(id, values); }
    catch (e: any) { setError(e.message); throw e; }
    finally { setIsLoading(false); }
  };

  const remove = async (id: number) => {
    setIsLoading(true);
    try { await articlesApi.delete(id); }
    finally { setIsLoading(false); }
  };

  const bulkRemove = async (ids: number[]) => {
    setIsLoading(true);
    try { await articlesApi.bulkDelete(ids); }
    finally { setIsLoading(false); }
  };

  return { create, update, remove, bulkRemove, isLoading, error };
}

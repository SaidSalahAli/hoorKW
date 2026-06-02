'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { settingsApi } from 'lib/api/settings';
import type { SettingsFormValues } from 'types/cms';

// ==============================|| HOOKS — SETTINGS ||============================== //

export function useSettings() {
  const { data, error, isLoading, mutate } = useSWR('settings', settingsApi.get, {
    revalidateOnFocus: false
  });
  return { settings: data, isLoading, error, mutate };
}

export function useUpdateSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (values: SettingsFormValues) => {
    setIsLoading(true); setError(null);
    try { return await settingsApi.update(values); }
    catch (e: any) { setError(e.message); throw e; }
    finally { setIsLoading(false); }
  };

  return { update, isLoading, error };
}

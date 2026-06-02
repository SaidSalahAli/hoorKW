import apiClient, { formDataRequest } from 'lib/apiClient';
import type { Settings, SettingsFormValues, ApiResponse } from 'types/cms';

// ==============================|| API — SETTINGS ||============================== //

export const settingsApi = {
  get: async () => {
    const res = await apiClient.get<ApiResponse<Settings>>('/api/settings');
    return res.data.data;
  },

  update: async (values: SettingsFormValues) => {
    const fd = new FormData();
    fd.append('site_name', values.site_name);
    fd.append('phone', values.phone);
    fd.append('whatsapp', values.whatsapp);
    fd.append('email', values.email);
    fd.append('address', values.address);
    fd.append('seo_title', values.seo_title);
    fd.append('seo_description', values.seo_description);
    fd.append('facebook', values.facebook);
    fd.append('instagram', values.instagram);
    fd.append('twitter', values.twitter);
    fd.append('youtube', values.youtube);
    fd.append('_method', 'PUT');
    if (values.logo instanceof File) fd.append('logo', values.logo);
    if (values.favicon instanceof File) fd.append('favicon', values.favicon);

    return formDataRequest('post', '/api/settings', fd);
  }
};

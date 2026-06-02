'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { Save2 } from '@wandersonalwes/iconsax-react';

import PageHeader from 'components/cms/PageHeader';
import ImageUploader from 'components/cms/ImageUploader';
import { useSettings, useUpdateSettings } from 'hooks/cms/useSettings';
import type { SettingsFormValues } from 'types/cms';

// Validation Schema
const validationSchema = yup.object().shape({
  site_name: yup.string().required('اسم الموقع مطلوب'),
  phone: yup.string().required('رقم الهاتف مطلوب'),
  whatsapp: yup.string().required('رقم الواتساب مطلوب'),
  email: yup.string().email('صيغة البريد الإلكتروني غير صحيحة').required('البريد الإلكتروني مطلوب'),
  address: yup.string().required('العنوان الجغرافي مطلوب'),
  seo_title: yup.string().required('عنوان محركات البحث الرئيسي مطلوب'),
  seo_description: yup.string().required('وصف محركات البحث الرئيسي مطلوب'),
  facebook: yup.string().url('يجب إدخال رابط صحيح'),
  instagram: yup.string().url('يجب إدخال رابط صحيح'),
  twitter: yup.string().url('يجب إدخال رابط صحيح'),
  youtube: yup.string().url('يجب إدخال رابط صحيح')
});

export default function SettingsView() {
  const { settings, isLoading, error, mutate } = useSettings();
  const updateMutation = useUpdateSettings();
  const [tabValue, setTabValue] = useState(0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const formik = useFormik<SettingsFormValues>({
    initialValues: {
      site_name: '',
      phone: '',
      whatsapp: '',
      email: '',
      address: '',
      seo_title: '',
      seo_description: '',
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      logo: null,
      favicon: null
    },
    validationSchema,
    onSubmit: async (values) => {
      setSuccessMsg(null);
      try {
        await updateMutation.update(values);
        mutate();
        setSuccessMsg('تم حفظ الإعدادات بنجاح!');
        // scroll to top to see success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error(err);
      }
    }
  });

  // Load initial settings values when SWR returns data
  useEffect(() => {
    if (settings) {
      formik.setValues({
        site_name: settings.site_name || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        address: settings.address || '',
        seo_title: settings.seo_title || '',
        seo_description: settings.seo_description || '',
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        twitter: settings.twitter || '',
        youtube: settings.youtube || '',
        logo: null,
        favicon: null
      });
    }
  }, [settings]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="إعدادات الموقع العامة"
        subtitle="تعديل معلومات التواصل الجغرافي، الهاتف، الواتساب، روابط التواصل الاجتماعي، وعلامة الهوية التجارية."
      />

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || 'خطأ في تحميل إعدادات الموقع'}
        </Alert>
      )}

      <Card>
        <Tabs
          value={tabValue}
          onChange={(_, val) => setTabValue(val)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}
        >
          <Tab label="بيانات الشركة والتواصل" />
          <Tab label="إعدادات SEO والأرشفة" />
          <Tab label="الشعار والهوية البصرية" />
        </Tabs>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" noValidate onSubmit={formik.handleSubmit}>
            {tabValue === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="site_name"
                    label="اسم الشركة / الموقع"
                    value={formik.values.site_name}
                    onChange={formik.handleChange}
                    error={formik.touched.site_name && Boolean(formik.errors.site_name)}
                    helperText={formik.touched.site_name && formik.errors.site_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="address"
                    label="العنوان الجغرافي الرئيسي (الكويت)"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="phone"
                    label="رقم الهاتف للاتصال المباشر"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="whatsapp"
                    label="رقم الواتساب (صيغة دولية)"
                    value={formik.values.whatsapp}
                    onChange={formik.handleChange}
                    error={formik.touched.whatsapp && Boolean(formik.errors.whatsapp)}
                    helperText={formik.touched.whatsapp && formik.errors.whatsapp}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="email"
                    label="البريد الإلكتروني للشركة"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight={600} mt={2} mb={2} color="primary">
                    روابط شبكات التواصل الاجتماعي
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="facebook"
                    label="رابط صفحة فيسبوك"
                    value={formik.values.facebook}
                    onChange={formik.handleChange}
                    error={formik.touched.facebook && Boolean(formik.errors.facebook)}
                    helperText={formik.touched.facebook && formik.errors.facebook}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="instagram"
                    label="رابط حساب إنستغرام"
                    value={formik.values.instagram}
                    onChange={formik.handleChange}
                    error={formik.touched.instagram && Boolean(formik.errors.instagram)}
                    helperText={formik.touched.instagram && formik.errors.instagram}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="twitter"
                    label="رابط حساب إكس / تويتر"
                    value={formik.values.twitter}
                    onChange={formik.handleChange}
                    error={formik.touched.twitter && Boolean(formik.errors.twitter)}
                    helperText={formik.touched.twitter && formik.errors.twitter}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="youtube"
                    label="رابط قناة يوتيوب"
                    value={formik.values.youtube}
                    onChange={formik.handleChange}
                    error={formik.touched.youtube && Boolean(formik.errors.youtube)}
                    helperText={formik.touched.youtube && formik.errors.youtube}
                  />
                </Grid>
              </Grid>
            )}

            {tabValue === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="seo_title"
                    label="العنوان الافتراضي للموقع (Default SEO Title)"
                    value={formik.values.seo_title}
                    onChange={formik.handleChange}
                    error={formik.touched.seo_title && Boolean(formik.errors.seo_title)}
                    helperText={formik.touched.seo_title && formik.errors.seo_title || 'يظهر في صفحة البداية الرئيسية'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="seo_description"
                    label="الوصف الرئيسي للموقع (Default SEO Description)"
                    multiline
                    rows={4}
                    value={formik.values.seo_description}
                    onChange={formik.handleChange}
                    error={formik.touched.seo_description && Boolean(formik.errors.seo_description)}
                    helperText={formik.touched.seo_description && formik.errors.seo_description || 'الوصف التعريفي للشركة للظهور في جوجل'}
                  />
                </Grid>
              </Grid>
            )}

            {tabValue === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <ImageUploader
                    label="شعار الموقع الرئيسي (Logo)"
                    currentImageUrl={settings?.logo}
                    value={formik.values.logo}
                    onChange={(file) => formik.setFieldValue('logo', file)}
                    error={formik.touched.logo ? (formik.errors.logo as string) : undefined}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ImageUploader
                    label="أيقونة الموقع (Favicon)"
                    currentImageUrl={settings?.favicon}
                    value={formik.values.favicon}
                    onChange={(file) => formik.setFieldValue('favicon', file)}
                    error={formik.touched.favicon ? (formik.errors.favicon as string) : undefined}
                    accept="image/x-icon,image/png,image/x-image"
                  />
                </Grid>
              </Grid>
            )}

            <Stack direction="row" justifyContent="flex-end" mt={4}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Save2 size={18} />}
                disabled={updateMutation.isLoading}
                sx={{ minWidth: 150 }}
              >
                {updateMutation.isLoading ? <CircularProgress size={24} color="inherit" /> : 'حفظ الإعدادات'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

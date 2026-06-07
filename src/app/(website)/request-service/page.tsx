'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { TruckFast } from '@wandersonalwes/iconsax-react';
import { publicApiClient as apiClient } from 'lib/apiClient';
import { requestsApi } from 'lib/api/requests';

// ==============================|| REQUEST SERVICE PAGE ||============================== //

export default function RequestServicePage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await apiClient.get('/api/services?status=active');
        setServices(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      service_id: '',
      message: ''
    },
    validationSchema: yup.object({
      name: yup.string().required('الرجاء إدخال اسمك الكريم'),
      phone: yup.string().required('رقم الهاتف مطلوب').min(8, 'رقم الهاتف غير صحيح'),
      service_id: yup.string().required('الرجاء اختيار نوع الخدمة'),
      message: yup.string().required('الرجاء كتابة تفاصيل الأغراض المراد نقلها والمكان')
    }),
    onSubmit: async (values, { resetForm }) => {
      setFormSubmitting(true);
      setFormError(null);
      setFormSuccess(false);
      try {
        await requestsApi.submit({
          name: values.name,
          phone: values.phone,
          service_id: values.service_id,
          message: values.message
        });
        setFormSuccess(true);
        resetForm();
      } catch (err: any) {
        setFormError(err.message || 'حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.');
      } finally {
        setFormSubmitting(false);
      }
    }
  });

  return (
    <Box sx={{ minHeight: '80vh', bgcolor: '#f8fafc', py: 10 }}>
      <Container maxWidth="md">
        <Card
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}
        >
          <Grid container>
            {/* Left intro banner */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                bgcolor: '#0f172a',
                color: 'white',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <Box mb={2} sx={{ color: 'primary.light', display: 'flex', justifyContent: 'center' }}>
                <TruckFast size={64} variant="Bulk" />
              </Box>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                تسعيرة فورية
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.7 }}>
                املأ النموذج وسنتواصل معك خلال دقائق لتحديد تكلفة نقل عفشك.
              </Typography>
            </Grid>

            {/* Right form inputs */}
            <Grid item xs={12} md={8}>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Typography variant="h3" fontWeight={700} mb={1}>
                  طلب تسعيرة نقل عفش
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={4}>
                  نسعى لتقديم أفضل خدمة نقل أثاث بأقل التكاليف في دولة الكويت.
                </Typography>

                {formSuccess && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    تم إرسال طلب التسعيرة بنجاح! سيتواصل معك مندوبنا قريباً جداً.
                  </Alert>
                )}
                {formError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {formError}
                  </Alert>
                )}

                {loading ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box component="form" noValidate onSubmit={formik.handleSubmit}>
                    <TextField
                      fullWidth
                      name="name"
                      label="اسمك الكريم"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      sx={{ mb: 2.5 }}
                    />
                    <TextField
                      fullWidth
                      name="phone"
                      label="رقم الهاتف الخلوي"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      error={formik.touched.phone && Boolean(formik.errors.phone)}
                      helperText={formik.touched.phone && formik.errors.phone}
                      sx={{ mb: 2.5 }}
                    />
                    <TextField
                      fullWidth
                      name="service_id"
                      select
                      label="اختر الخدمة المطلوبة"
                      value={formik.values.service_id}
                      onChange={formik.handleChange}
                      error={formik.touched.service_id && Boolean(formik.errors.service_id)}
                      helperText={formik.touched.service_id && formik.errors.service_id}
                      sx={{ mb: 2.5 }}
                    >
                      <MenuItem value="0">طلب نقل عام (عفش وأثاث)</MenuItem>
                      {services.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.title}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      name="message"
                      label="تفاصيل النقل (الأغراض، وجهة النقل، الطابق، وجود مصعد)"
                      multiline
                      rows={4}
                      placeholder="مثال: نقل عفش شقة من الطابق الثالث (يوجد مصعد) في السالمية إلى العارضية طابق أرضي..."
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      error={formik.touched.message && Boolean(formik.errors.message)}
                      helperText={formik.touched.message && formik.errors.message}
                      sx={{ mb: 3 }}
                    />
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={formSubmitting}
                      sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
                    >
                      {formSubmitting ? <CircularProgress size={24} /> : 'إرسال طلب التسعيرة'}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
}

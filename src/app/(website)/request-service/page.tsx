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
import ScrollReveal from 'components/ScrollReveal';

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
    <Box sx={{ minHeight: '80vh', bgcolor: '#f8fafc', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <ScrollReveal direction="up">
          <Card
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
              bgcolor: '#ffffff'
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
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Glowing decor */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(250,204,21,0.1) 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }}
                />

                <Box mb={2.5} sx={{ color: '#facc15', display: 'flex', justifyContent: 'center' }}>
                  <TruckFast size={64} variant="Bulk" />
                </Box>
                <Typography variant="h3" fontWeight={900} gutterBottom sx={{ fontSize: '1.6rem' }}>
                  تسعيرة فورية
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.8 }}>
                  املأ النموذج وسنتواصل معك خلال دقائق لتحديد تكلفة نقل عفشك بجميع مناطق الكويت.
                </Typography>
              </Grid>

              {/* Right form inputs */}
              <Grid item xs={12} md={8}>
                <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                  <Typography variant="h3" fontWeight={850} color="#0f172a" mb={1} sx={{ fontSize: '1.6rem' }}>
                    طلب تسعيرة نقل عفش
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={4}>
                    نسعى لتقديم أفضل خدمة نقل أثاث بأقل التكاليف وبأيدي نجارين وعمالة فنية مدربة.
                  </Typography>

                  {formSuccess && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 2.5 }}>
                      تم إرسال طلب التسعيرة بنجاح! سيتواصل معك مندوبنا قريباً جداً.
                    </Alert>
                  )}
                  {formError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>
                      {formError}
                    </Alert>
                  )}

                  {loading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                      <CircularProgress size={36} sx={{ color: '#eab308' }} />
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
                        sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                      />
                      <TextField
                        fullWidth
                        name="phone"
                        label="رقم الهاتف الخلوي"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                        sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
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
                        sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
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
                        sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                      />
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={formSubmitting}
                        sx={{
                          py: 1.8,
                          fontWeight: 800,
                          borderRadius: 2.5,
                          fontSize: '1rem',
                          color: '#0f172a',
                          background: 'linear-gradient(135deg,#facc15,#eab308)',
                          '&:hover': {
                            background: 'linear-gradient(135deg,#fde047,#ca8a04)',
                            transform: 'translateY(-1px)'
                          },
                          '&:focus, &:focus-visible, &:active, &.Mui-focusVisible': {
                            outline: 'none !important',
                            boxShadow: 'none !important',
                            border: 'none !important',
                            bgcolor: '#facc15'
                          },
                          WebkitTapHighlightColor: 'transparent',
                          transition: 'all 0.25s'
                        }}
                      >
                        {formSubmitting ? <CircularProgress size={24} color="inherit" /> : 'إرسال طلب التسعيرة'}
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </ScrollReveal>
      </Container>
    </Box>
  );
}

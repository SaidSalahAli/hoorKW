'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { Call, Whatsapp, Location } from '@wandersonalwes/iconsax-react';
import apiClient from 'lib/apiClient';
import { requestsApi } from 'lib/api/requests';

// ==============================|| CONTACT US PAGE ||============================== //

export default function ContactPage() {
  const [settings, setSettings] = useState<any>({});
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    async function loadContactData() {
      try {
        const [settingsRes, servicesRes] = await Promise.all([
          apiClient.get('/api/settings'),
          apiClient.get('/api/services?status=active')
        ]);
        setSettings(settingsRes.data.data || {});
        setServices(servicesRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadContactData();
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
      service_id: yup.string().required('الرجاء اختيار الخدمة المطلوبة'),
      message: yup.string().required('الرجاء كتابة تفاصيل الطلب أو رسالتك')
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const phone = settings.phone || '96512345678';
  const whatsapp = settings.whatsapp || '96512345678';

  return (
    <Box>
      {/* Banner */}
      <Box sx={{ bgcolor: '#0f172a', color: 'white', py: 8, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h1" fontWeight={800} gutterBottom>
            اتصل بنا
          </Typography>
          <Typography variant="h5" color="grey.400" fontWeight={400}>
            يسعدنا تواصلك معنا في أي وقت لنلبي طلبات نقل أثاثك بكافة مناطق الكويت
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={5}>
          {/* Contact Details Cards */}
          <Grid item xs={12} md={5}>
            <Typography variant="h3" fontWeight={700} mb={3}>
              معلومات الاتصال المباشر
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4} sx={{ lineHeight: 1.7 }}>
              يمكنك التواصل معنا مباشرة عبر الهاتف أو تطبيق واتساب للحصول على تسعيرة نقل سريعة دون انتظار. نحن نعمل طوال 24 ساعة.
            </Typography>

            <Stack spacing={3}>
              {/* Call */}
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Box sx={{ color: 'primary.main', p: 1.5, bgcolor: 'primary.lighter', borderRadius: '50%', display: 'flex' }}>
                    <Call size={28} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">رقم الهاتف للاتصال المباشر</Typography>
                    <Typography variant="h4" fontWeight={700} component="a" href={`tel:${phone}`} sx={{ color: 'text.primary', textDecoration: 'none' }}>
                      {phone}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* WhatsApp */}
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Box sx={{ color: 'success.main', p: 1.5, bgcolor: 'success.lighter', borderRadius: '50%', display: 'flex' }}>
                    <Whatsapp size={28} variant="Bold" />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">المراسلة الفورية عبر واتساب</Typography>
                    <Typography variant="h4" fontWeight={700} component="a" href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" sx={{ color: 'success.main', textDecoration: 'none' }}>
                      تواصل واتساب الآن
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Address */}
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Box sx={{ color: 'info.main', p: 1.5, bgcolor: 'info.lighter', borderRadius: '50%', display: 'flex' }}>
                    <Location size={28} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">مكتب الإدارة والمستودع الرئيسي</Typography>
                    <Typography variant="h5" fontWeight={700}>{settings.address || 'الكويت'}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Form */}
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h3" fontWeight={700} mb={1}>
                  أرسل لنا طلبك بالتفصيل
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={4}>
                  قم بملء البيانات وسنقوم بالرد عليك في غضون دقائق معدودة.
                </Typography>

                {formSuccess && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    تم إرسال طلبك بنجاح! سنتصل بك قريباً جداً.
                  </Alert>
                )}
                {formError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {formError}
                  </Alert>
                )}

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
                    label="رقم الهاتف"
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
                    label="الخدمة التي تريد الاستفسار عنها"
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
                    label="اكتب متطلبات النقل بالتفصيل هنا..."
                    multiline
                    rows={4}
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
                    {formSubmitting ? <CircularProgress size={24} /> : 'إرسال الرسالة'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

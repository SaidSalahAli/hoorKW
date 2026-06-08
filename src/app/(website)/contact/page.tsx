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
import ScrollReveal from 'components/ScrollReveal';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { Call, Whatsapp, Location } from '@wandersonalwes/iconsax-react';
import { publicApiClient as apiClient } from 'lib/apiClient';
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
        <CircularProgress size={44} sx={{ color: '#eab308' }} />
      </Box>
    );
  }

  const phone = settings.phone || '96512345678';
  const whatsapp = settings.whatsapp || '96512345678';

  return (
    <Box>
      {/* Banner */}
      <Box
        sx={{
          color: 'white',
          py: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
          backgroundImage:
            'linear-gradient(135deg, rgba(6, 13, 31, 0.95) 0%, rgba(15, 23, 42, 0.9) 40%, rgba(26, 39, 68, 0.95) 100%), url(/assets/images/home/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          textAlign: 'center'
        }}
      >
        {/* Decorative blurred circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(250,204,21,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: '20%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(250,204,21,0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <ScrollReveal direction="up">
            <Typography variant="h1" fontWeight={900} sx={{ fontSize: { xs: '2.4rem', md: '3.4rem' }, mb: 2 }}>
              اتصل بنا
            </Typography>
            <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 400, maxWidth: 720, mx: 'auto', lineHeight: 1.7 }}>
              يسعدنا تواصلك معنا في أي وقت لنلبي طلبات نقل أثاثك بكافة مناطق الكويت
            </Typography>
          </ScrollReveal>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Grid container spacing={6}>
          {/* Contact Details Cards */}
          <Grid item xs={12} md={5}>
            <ScrollReveal direction="left">
              <Typography variant="h3" fontWeight={850} color="#0f172a" mb={2} sx={{ fontSize: '1.8rem' }}>
                معلومات الاتصال المباشر
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={4} sx={{ lineHeight: 1.8 }}>
                يمكنك التواصل معنا مباشرة عبر الهاتف أو تطبيق واتساب للحصول على تسعيرة نقل سريعة دون انتظار. نحن نعمل طوال 24 ساعة لخدمتك.
              </Typography>

              <Stack spacing={3.5}>
                {/* Call */}
                <Card
                  sx={{
                    borderRadius: 4,
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s',
                    '&:hover': { borderColor: '#eab308', boxShadow: '0 10px 25px rgba(234,179,8,0.05)' }
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
                    <Box sx={{ color: '#0f172a', p: 2, bgcolor: 'rgba(250,204,21,0.15)', borderRadius: '50%', display: 'flex' }}>
                      <Call size={28} variant="Bulk" />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        رقم الهاتف للاتصال المباشر
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={800}
                        component="a"
                        href={`tel:${phone}`}
                        sx={{ color: '#0f172a', textDecoration: 'none', '&:hover': { color: '#eab308' }, transition: 'color 0.2s' }}
                      >
                        {phone}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* WhatsApp */}
                <Card
                  sx={{
                    borderRadius: 4,
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s',
                    '&:hover': { borderColor: '#25d366', boxShadow: '0 10px 25px rgba(37,211,102,0.05)' }
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
                    <Box
                      sx={{
                        color: 'white',
                        p: 2,
                        bgcolor: '#25d366',
                        borderRadius: '50%',
                        display: 'flex',
                        boxShadow: '0 4px 12px rgba(37,211,102,0.2)'
                      }}
                    >
                      <Whatsapp size={28} variant="Bold" />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        المراسلة الفورية عبر واتساب
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={800}
                        component="a"
                        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        sx={{ color: '#25d366', textDecoration: 'none', '&:hover': { color: '#128c7e' }, transition: 'color 0.2s' }}
                      >
                        تواصل واتساب الآن
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Address */}
                <Card
                  sx={{
                    borderRadius: 4,
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s',
                    '&:hover': { borderColor: '#eab308', boxShadow: '0 10px 25px rgba(234,179,8,0.05)' }
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2.5, p: 3 }}>
                    <Box sx={{ color: '#eab308', p: 2, bgcolor: 'rgba(234,179,8,0.08)', borderRadius: '50%', display: 'flex' }}>
                      <Location size={28} variant="Bulk" />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        مكتب الإدارة والمستودع الرئيسي
                      </Typography>
                      <Typography variant="h5" fontWeight={800} color="#0f172a">
                        {settings.address || 'دولة الكويت'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Stack>
            </ScrollReveal>
          </Grid>

          {/* Form */}
          <Grid item xs={12} md={7}>
            <ScrollReveal direction="right">
              <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 15px 35px rgba(0,0,0,0.04)' }}>
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h3" fontWeight={850} color="#0f172a" mb={1} sx={{ fontSize: '1.6rem' }}>
                    أرسل لنا طلبك بالتفصيل
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={4}>
                    قم بملء البيانات وسنقوم بالرد عليك في غضون دقائق معدودة لتزويدك بالتسعيرة.
                  </Typography>

                  {formSuccess && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 2.5 }}>
                      تم إرسال طلبك بنجاح! سنتصل بك قريباً جداً.
                    </Alert>
                  )}
                  {formError && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>
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
                      sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                    />
                    <TextField
                      fullWidth
                      name="phone"
                      label="رقم الهاتف"
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
                      label="الخدمة التي تريد الاستفسار عنها"
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
                      label="اكتب متطلبات النقل بالتفصيل هنا..."
                      multiline
                      rows={4}
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      error={formik.touched.message && Boolean(formik.errors.message)}
                      helperText={formik.touched.message && formik.errors.message}
                      sx={{ mb: 4.5, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
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
                      {formSubmitting ? <CircularProgress size={24} color="inherit" /> : 'إرسال الرسالة'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </ScrollReveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

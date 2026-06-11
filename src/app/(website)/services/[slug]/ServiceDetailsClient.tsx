'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import ScrollReveal from 'components/ScrollReveal';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { requestsApi } from 'lib/api/requests';
import { ShieldSecurity, TickCircle } from '@wandersonalwes/iconsax-react';

// ==============================|| SERVICE DETAILS CLIENT ||============================== //

interface ServiceDetailsClientProps {
  service: any;
}

export default function ServiceDetailsClient({ service }: ServiceDetailsClientProps) {
  const [error, setError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Formik for the service-specific order form
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      message: ''
    },
    validationSchema: yup.object({
      name: yup.string().required('الرجاء إدخال اسمك الكريم'),
      phone: yup.string().required('رقم الهاتف مطلوب للتواصل').min(8, 'رقم الهاتف غير صحيح'),
      message: yup.string().required('الرجاء إدخال تفاصيل النقل المطلوبة').min(10, 'تفاصيل الطلب يجب أن لا تقل عن 10 أحرف')
    }),
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setFormSubmitting(true);
      setError(null);
      setFormSuccess(false);
      try {
        await requestsApi.submit({
          name: values.name,
          phone: values.phone,
          service_id: String(service.id),
          message: values.message
        });
        setFormSuccess(true);
        resetForm();
      } catch (err: any) {
        setError(err.message || 'حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.');
      } finally {
        setFormSubmitting(false);
      }
    }
  });

  return (
    <Box>
      {/* Dynamic breadcrumb header */}
      <Box
        sx={{
          color: 'white',
          py: { xs: 8, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          backgroundImage:
            'linear-gradient(135deg, rgba(6, 13, 31, 0.95) 0%, rgba(15, 23, 42, 0.9) 40%, rgba(26, 39, 68, 0.95) 100%), url(/assets/images/home/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
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
            <Stack direction="row" spacing={1} alignItems="center" mb={2} color="grey.400" fontSize="0.9rem">
              <Link href="/" passHref legacyBehavior>
                <Box
                  component="a"
                  sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: '#facc15' }, transition: 'color 0.2s' }}
                >
                  الرئيسية
                </Box>
              </Link>
              <span>/</span>
              <Link href="/services" passHref legacyBehavior>
                <Box
                  component="a"
                  sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: '#facc15' }, transition: 'color 0.2s' }}
                >
                  الخدمات
                </Box>
              </Link>
              <span>/</span>
              <Typography variant="caption" sx={{ color: '#facc15', fontWeight: 700 }}>
                {service.title}
              </Typography>
            </Stack>
            <Typography variant="h1" fontWeight={900} sx={{ fontSize: { xs: '2.2rem', md: '3.2rem' } }}>
              {service.title}
            </Typography>
          </ScrollReveal>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Grid container spacing={6}>
          {/* Details Section */}
          <Grid item xs={12} md={8}>
            <ScrollReveal direction="left">
              {service.image && (
                <Box
                  component="img"
                  src={service.image}
                  alt={service.title}
                  sx={{
                    width: '100%',
                    maxHeight: 460,
                    objectFit: 'cover',
                    borderRadius: 4,
                    mb: 5,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                  }}
                />
              )}
              <Typography variant="h3" fontWeight={850} color="#0f172a" gutterBottom sx={{ fontSize: '1.8rem', mb: 3 }}>
                تفاصيل ومميزات الخدمة
              </Typography>
              <Typography
                variant="body1"
                component="div"
                dangerouslySetInnerHTML={{ __html: service.description }}
                sx={{ lineHeight: 1.9, fontSize: '1.08rem', color: 'text.secondary', mb: 5 }}
              />

              {/* Highlights Box with Gold Theme */}
              <Box
                sx={{
                  bgcolor: '#ffffff',
                  p: 4,
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                  mb: 4
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={800}
                  color="#0f172a"
                  mb={3}
                  sx={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: 1.5 }}
                >
                  <ShieldSecurity size={28} variant="Bulk" color="#eab308" />
                  لماذا تختار خدمة {service.title} من شركة الحور؟
                </Typography>

                <Stack spacing={2}>
                  {[
                    'كفاءة وسرعة فائقة في إنجاز عملية النقل دون تأخير وبجدول زمني دقيق.',
                    'نستخدم خامات تغليف عالية الجودة مخصصة لكل قطعة أثاث (كرتون مقوى، بابلز، فوم).',
                    'التزام تام بالمحافظة على المنقولات، مع توفير أقصى درجات الحماية ضد أي خسائر أو خدوش.'
                  ].map((text, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <TickCircle size={22} variant="Bold" color="#eab308" style={{ marginTop: 2, flexShrink: 0 }} />
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </ScrollReveal>
          </Grid>

          {/* Request Quote Widget Sidebar */}
          <Grid item xs={12} md={4}>
            <ScrollReveal direction="right">
              <Card
                sx={{
                  position: 'sticky',
                  top: 100,
                  border: '1px solid #e2e8f0',
                  borderRadius: 4,
                  boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                  bgcolor: '#ffffff',
                  overflow: 'hidden'
                }}
              >
                {/* Form header accent bar */}
                <Box sx={{ height: 6, bgcolor: '#eab308' }} />
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" fontWeight={850} color="#0f172a" mb={1} sx={{ fontSize: '1.4rem' }}>
                    اطلب الخدمة الآن
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={4}>
                    أدخل بياناتك وسنتصل بك فوراً لتحديد الموعد والتكلفة الكلية.
                  </Typography>

                  {formSuccess && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 2.5 }}>
                      تم إرسال طلبك بنجاح! سنتواصل معك قريباً.
                    </Alert>
                  )}

                  {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>
                      {error}
                    </Alert>
                  )}

                  <Box component="form" noValidate onSubmit={formik.handleSubmit}>
                    <TextField
                      fullWidth
                      name="name"
                      label="الاسم الكريم"
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
                      name="message"
                      label="تفاصيل الطلب (أماكن الفك والنقل)"
                      multiline
                      rows={3}
                      placeholder={`مثال: أريد نقل أثاث من منطقة السالمية إلى حولي مع الفك والتركيب...`}
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      error={formik.touched.message && Boolean(formik.errors.message)}
                      helperText={formik.touched.message && formik.errors.message}
                      sx={{ mb: 3.5, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                    />
                    <Button
                      fullWidth
                      type="submit"
                      disabled={formSubmitting}
                      sx={{
                        py: 1.8,
                        fontWeight: 800,
                        borderRadius: 2.5,
                        fontSize: '1rem',
                        color: '#0f172a',
                        background: 'linear-gradient(135deg,#facc15,#eab308)',
                        '&:hover': {
                          background: 'linear-gradient(135deg,#fde047,#ca8a04)'
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
                      {formSubmitting ? <CircularProgress size={24} color="inherit" /> : 'إرسال طلب الخدمة'}
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

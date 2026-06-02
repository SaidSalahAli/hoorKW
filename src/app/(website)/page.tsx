'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { CallCalling, ShieldSecurity, Clock, Like1, TruckFast, ArrowRight } from '@wandersonalwes/iconsax-react';

import apiClient from 'lib/apiClient';
import { requestsApi } from 'lib/api/requests';

// ==============================|| PUBLIC HOME PAGE ||============================== //

interface HomeData {
  services: any[];
  articles: any[];
  gallery: any[];
  testimonials: any[];
  settings: any;
}

export default function PublicHomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch all required home page sections from the public endpoints in one go
  useEffect(() => {
    async function loadHomeData() {
      try {
        const [servicesRes, articlesRes, galleryRes, testimonialsRes, settingsRes] = await Promise.all([
          apiClient.get('/api/services?per_page=6&status=active'),
          apiClient.get('/api/articles?per_page=3&status=published'),
          apiClient.get('/api/gallery?per_page=6'),
          apiClient.get('/api/testimonials?per_page=4&status=active'),
          apiClient.get('/api/settings')
        ]);

        setData({
          services: servicesRes.data.data || [],
          articles: articlesRes.data.data || [],
          gallery: galleryRes.data.data || [],
          testimonials: testimonialsRes.data.data || [],
          settings: settingsRes.data.data || {}
        });
      } catch (err) {
        console.error('Error loading public home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  // Formik for the footer request/contact form
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      service_id: '',
      message: ''
    },
    validationSchema: yup.object({
      name: yup.string().required('الرجاء إدخال اسمك الكريم'),
      phone: yup.string().required('رقم الهاتف مطلوب للتواصل معك').min(8, 'رقم الهاتف غير صحيح'),
      service_id: yup.string().required('الرجاء اختيار الخدمة المطلوبة'),
      message: yup.string().required('الرجاء إدخال تفاصيل الطلب')
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
        setFormError(err.message || 'حدث خطأ أثناء إرسال طلبك. يرجى المحاولة لاحقاً.');
      } finally {
        setFormSubmitting(false);
      }
    }
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={44} />
      </Box>
    );
  }

  const settings = data?.settings || {};
  const services = data?.services || [];
  const gallery = data?.gallery || [];
  const testimonials = data?.testimonials || [];
  const articles = data?.articles || [];

  return (
    <Box>
      {/* 1. Hero Section */}
      <Box
        sx={{
          bgcolor: '#1e293b',
          color: 'white',
          py: { xs: 8, md: 14 },
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h1" fontWeight={800} sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1.2, mb: 2 }}>
                نقل عفش وأثاث في الكويت <br />
                <Box component="span" sx={{ color: 'primary.light' }}>بأمان واحترافية تامة</Box>
              </Typography>
              <Typography variant="h5" sx={{ color: 'grey.300', mb: 4, fontWeight: 400, lineHeight: 1.6 }}>
                نضمن لك تجربة نقل أثاث خالية من المتاعب. عمالة فنية مدربة، سيارات نقل حديثة مقفلة، وفك وتركيب جميع أنواع غرف النوم بدقة.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Link href="/request-service" passHref legacyBehavior>
                  <Button variant="contained" color="primary" size="large" sx={{ py: 1.5, px: 4, fontWeight: 700, borderRadius: 2 }}>
                    احصل على تسعيرة فورية
                  </Button>
                </Link>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  component="a"
                  href={`tel:${settings.phone}`}
                  sx={{ py: 1.5, px: 4, fontWeight: 700, borderRadius: 2 }}
                >
                  اتصل بنا الآن
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ position: 'relative', height: 400, width: '100%' }}>
                {/* SVG/CSS truck graphics for wow effect */}
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'rgba(255,255,255,0.05)', p: 4, borderRadius: '50%' }}>
                  <TruckFast size={180} color="#38bdf8" variant="Bulk" />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. Company Introduction */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="overline" color="primary.main" fontWeight={700} sx={{ letterSpacing: 2 }}>من نحن</Typography>
              <Typography variant="h2" fontWeight={700} sx={{ mt: 1, mb: 3 }}>
                شركة حور لنقل العفش والأثاث المنزلي والمكتبي
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
                نحن في شركة حور نفتخر بتقديم أفضل خدمات النقل المتكاملة في جميع محافظات دولة الكويت. نلبي تطلعات عملائنا من خلال الاعتماد على أحدث الأدوات التكنولوجية والخبرات الطويلة في هذا المجال.
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
                مهمتنا هي الحفاظ على سلامة ممتلكاتك الثمينة ونقلها بدون أي خدوش أو تلفيات. نوفر لك خدمات التغليف الكامل لجميع محتويات المنزل من زجاج وأواني وأجهزة حساسة قبل النقل.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card sx={{ bgcolor: 'primary.lighter', height: '100%', p: 1 }}>
                    <CardContent>
                      <Typography variant="h3" color="primary.main" fontWeight={800}>100%</Typography>
                      <Typography variant="subtitle1" fontWeight={700} mt={1}>أمان وضمان</Typography>
                      <Typography variant="body2" color="text.secondary">ضمان كامل لجميع قطع الأثاث من الخدوش</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ bgcolor: 'secondary.lighter', height: '100%', p: 1 }}>
                    <CardContent>
                      <Typography variant="h3" color="secondary.main" fontWeight={800}>24/7</Typography>
                      <Typography variant="subtitle1" fontWeight={700} mt={1}>خدمة متواصلة</Typography>
                      <Typography variant="body2" color="text.secondary">جاهزون لنقل عفشك في أي وقت طوال اليوم</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 3. Services Section */}
      <Box sx={{ py: 10, bgcolor: '#f1f5f9' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="overline" color="primary.main" fontWeight={700}>خدماتنا المتميزة</Typography>
            <Typography variant="h2" fontWeight={800} mt={1}>ما نقدمه لعملائنا في الكويت</Typography>
          </Box>
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  {service.image && (
                    <CardMedia component="img" height="200" image={service.image} alt={service.title} />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>{service.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 3 }}>
                      {service.short_description}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Link href={`/services/${service.slug}`} passHref legacyBehavior>
                      <Button variant="text" color="primary" endIcon={<ArrowRight size={16} />} sx={{ fontWeight: 700 }}>
                        اقرأ المزيد
                      </Button>
                    </Link>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 4. Why Choose Us */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography variant="overline" color="primary.main" fontWeight={700}>مميزاتنا</Typography>
            <Typography variant="h2" fontWeight={800} mt={1}>لماذا تختار شركة حور لنقل العفش؟</Typography>
          </Box>
          <Grid container spacing={4}>
            {[
              { icon: <TruckFast size={32} />, title: 'سيارات نقل مخصصة ومقفلة', desc: 'لحماية الأثاث من الغبار، الأتربة، والأمطار في شوارع الكويت.' },
              { icon: <ShieldSecurity size={32} />, title: 'نجار فك وتركيب غرف نوم', desc: 'نجارون محترفون لفك غرف ايكيا، ميداس، وغرف النوم الصينية والوطنية بدقة.' },
              { icon: <Clock size={32} />, title: 'التزام تام بالمواعيد', desc: 'نصلك في الوقت المتفق عليه لنوفر وقتك ونضمن سرعة إنجاز المعاملة.' },
              { icon: <Like1 size={32} />, title: 'أسعار مناسبة ومنافسة', desc: 'نقدم لك أفضل خدمات نقل العفش في الكويت بأرخص الأسعار المناسبة لجميع الفئات.' }
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box textAlign="center">
                  <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'primary.lighter', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h5" fontWeight={700} mb={1}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>{item.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 5. Gallery Preview */}
      <Box sx={{ py: 10, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={6}>
            <Box>
              <Typography variant="overline" color="primary.main" fontWeight={700}>معرض أعمالنا</Typography>
              <Typography variant="h2" fontWeight={800} mt={1}>شاهد خدماتنا على أرض الواقع</Typography>
            </Box>
            <Link href="/gallery" passHref legacyBehavior>
              <Button variant="outlined" color="primary" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>عرض المعرض بالكامل</Button>
            </Link>
          </Box>
          <Grid container spacing={3}>
            {gallery.slice(0, 6).map((img) => (
              <Grid item xs={12} sm={6} md={4} key={img.id}>
                <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                  <CardMedia component="img" height="240" image={img.image} alt={img.title} />
                  <Box p={2} textAlign="center" bgcolor="background.paper">
                    <Typography variant="subtitle2" fontWeight={600}>{img.title}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 6. Testimonials */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="overline" color="primary.main" fontWeight={700}>آراء العملاء</Typography>
            <Typography variant="h2" fontWeight={800} mt={1}>ماذا يقول عملائنا في الكويت عن خدمتنا؟</Typography>
          </Box>
          <Grid container spacing={3}>
            {testimonials.map((test) => (
              <Grid item xs={12} sm={6} md={3} key={test.id}>
                <Card sx={{ height: '100%', bgcolor: '#f8fafc', p: 1, borderRadius: 3, border: '1px solid #f1f5f9' }}>
                  <CardContent>
                    <Rating value={test.rating} readOnly size="small" sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                      &ldquo;{test.comment}&rdquo;
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2} mt={3}>
                      {test.image && (
                        <Box component="img" src={test.image} sx={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                      )}
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>{test.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{test.job_title}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 7. Latest Articles */}
      <Box sx={{ py: 10, bgcolor: '#f1f5f9' }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={6}>
            <Box>
              <Typography variant="overline" color="primary.main" fontWeight={700}>المدونة والحديث</Typography>
              <Typography variant="h2" fontWeight={800} mt={1}>نصائح وأخبار نقل العفش</Typography>
            </Box>
            <Link href="/blog" passHref legacyBehavior>
              <Button variant="outlined" color="primary">زيارة المدونة</Button>
            </Link>
          </Box>
          <Grid container spacing={3}>
            {articles.map((art) => (
              <Grid item xs={12} md={4} key={art.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden' }}>
                  {art.image && (
                    <CardMedia component="img" height="200" image={art.image} alt={art.title} />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom>{art.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {art.excerpt}
                    </Typography>
                  </CardContent>
                  <Box p={2}>
                    <Link href={`/blog/${art.slug}`} passHref legacyBehavior>
                      <Button variant="text" color="primary" sx={{ fontWeight: 700 }}>اقرأ المقال كاملاً</Button>
                    </Link>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 8. Call To Action & Contact Form */}
      <Box id="contact-form" sx={{ py: 10, bgcolor: '#0f172a', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight={800} color="primary.light" gutterBottom>
                هل تبحث عن خدمات نقل أثاث سريعة ومضمونة بالكويت؟
              </Typography>
              <Typography variant="body1" sx={{ color: 'grey.300', mb: 4, lineHeight: 1.8 }}>
                قم بملء النموذج وسيقوم فريقنا بالتواصل معك هاتفياً أو عبر واتساب خلال دقائق معدودة لتزويدك بالتكلفة الإجمالية المناسبة وحجز موعد النقل.
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', color: 'primary.light' }}>
                  <CallCalling size={32} />
                </Box>
                <Box>
                  <Typography variant="body2" color="grey.400">رقم الهاتف الساخن</Typography>
                  <Typography variant="h4" fontWeight={700} component="a" href={`tel:${settings.phone}`} sx={{ color: 'white', textDecoration: 'none' }}>
                    {settings.phone}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 3, p: 2 }}>
                <CardContent>
                  <Typography variant="h4" fontWeight={700} mb={3} color="text.primary" align="center">
                    اطلب تسعيرة النقل الآن
                  </Typography>
                  {formSuccess && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      تم إرسال طلبك بنجاح! سنتواصل معك قريباً جداً.
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
                      label="رقم الهاتف (الخلوي)"
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
                      label="اختر نوع الخدمة المطلوبة"
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
                      label="تفاصيل النقل (المنطقة الحالية، وجهة النقل، تفاصيل الأثاث)"
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
                      {formSubmitting ? <CircularProgress size={24} /> : 'إرسال طلب النقل'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

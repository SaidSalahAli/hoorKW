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
import { motion } from 'framer-motion';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { CallCalling, ShieldSecurity, Clock, Like1, TruckFast, ArrowRight } from '@wandersonalwes/iconsax-react';

import { publicApiClient as apiClient } from 'lib/apiClient';
import { requestsApi } from 'lib/api/requests';
import ScrollReveal from 'components/ScrollReveal';

// ==============================|| PUBLIC HOME PAGE ||============================== //

interface HomeData {
  services: any[];
  articles: any[];
  gallery: any[];
  testimonials: any[];
  settings: any;
}

// Hero text stagger animation
const heroContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};
const heroItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
};

export default function PublicHomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

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

  const formik = useFormik({
    initialValues: { name: '', phone: '', service_id: '', message: '' },
    validationSchema: yup.object({
      name: yup.string().required('الرجاء إدخال اسمك الكريم'),
      phone: yup.string().required('رقم الهاتف مطلوب للتواصل معك').min(8, 'رقم الهاتف غير صحيح'),
      service_id: yup.string().required('الرجاء اختيار الخدمة المطلوبة'),
      message: yup.string().required('الرجاء إدخال تفاصيل الطلب').min(10, 'تفاصيل الطلب يجب أن لا تقل عن 10 أحرف')
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
      {/* ─── 1. HERO ─────────────────────────────────────────── */}
      <Box
        sx={{
          color: 'white',
          py: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden',
          backgroundImage:
            'linear-gradient(135deg, rgba(6, 13, 31, 0.92) 0%, rgba(15, 23, 42, 0.88) 40%, rgba(26, 39, 68, 0.92) 100%), url(/assets/images/home/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Decorative blurred circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            left: '30%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            left: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div variants={heroContainerVariants} initial="hidden" animate="visible">
                <motion.div variants={heroItemVariants}>
                  {/* Trust badge with yellow details */}
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, borderRadius: 5, px: 2, py: 0.7, mb: 3 }}>
                    <Typography variant="caption" sx={{ color: '#facc15', fontWeight: 700, letterSpacing: 1 }}>
                      الشركة الأولى في نقل الأثاث بالكويت
                    </Typography>
                  </Box>
                </motion.div>
                <motion.div variants={heroItemVariants}>
                  <Typography variant="h1" fontWeight={900} sx={{ fontSize: { xs: '2.4rem', md: '3.8rem' }, lineHeight: 1.15, mb: 3 }}>
                    نقل عفش وأثاث
                    <Box
                      component="span"
                      sx={{
                        display: 'block',
                        background: 'linear-gradient(90deg, #facc15, #f59e0b)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      بأمان واحترافية تامة
                    </Box>
                  </Typography>
                </motion.div>
                <motion.div variants={heroItemVariants}>
                  <Typography variant="h6" sx={{ color: 'grey.400', mb: 5, fontWeight: 400, lineHeight: 1.8, maxWidth: 520 }}>
                    نهتم بتقديم تجربة نقل أثاث خالية من المتاعب. عمالة فنية مدربة، سيارات نقل حديثة مقفلة، وفك وتركيب جميع أنواع غرف النوم بدقة.
                  </Typography>
                </motion.div>
                <motion.div variants={heroItemVariants}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      component={Link}
                      href="/request-service"
                      variant="contained"
                      size="large"
                      sx={{
                        py: 1.8,
                        px: 5,
                        fontWeight: 800,
                        borderRadius: 3,
                        fontSize: '1rem',
                        color: '#0f172a',
                        background: 'linear-gradient(135deg,#facc15,#eab308)',
                        '&:hover': { transform: 'translateY(-2px)', background: 'linear-gradient(135deg,#fde047,#ca8a04)' },
                        transition: 'all 0.3s'
                      }}
                    >
                      احصل على تسعيرة مجانية
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      component="a"
                      href={`tel:${settings.phone}`}
                      sx={{
                        py: 1.8,
                        px: 4,
                        fontWeight: 700,
                        borderRadius: 3,
                        fontSize: '1rem',
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        '&:hover': { borderColor: '#facc15', color: '#facc15' }
                      }}
                    >
                      اتصل بنا الآن
                    </Button>
                  </Stack>
                </motion.div>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── 2. COMPANY INTRO ────────────────────────────────── */}
      <Box sx={{ py: 12, bgcolor: '#ffffff', position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <ScrollReveal direction="left">
                <Box sx={{ display: 'inline-block', bgcolor: 'rgba(234,179,8,0.08)', px: 2, py: 0.5, borderRadius: 1.5, mb: 2 }}>
                  <Typography variant="overline" color="#eab308" fontWeight={800} sx={{ letterSpacing: 1.5 }}>
                    من نحن
                  </Typography>
                </Box>
                <Typography
                  variant="h2"
                  fontWeight={800}
                  sx={{ mb: 3, color: '#1e293b', fontSize: { xs: '2rem', md: '2.6rem' }, lineHeight: 1.3 }}
                >
                  شركة الحور لنقل العفش <br />
                  <Box component="span" sx={{ color: '#eab308' }}>
                    خبرة ومصداقية تتوارثها الأجيال
                  </Box>
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary" sx={{ lineHeight: 1.9, fontSize: '1.08rem', mb: 3 }}>
                  نحن في شركة الحور نفتخر بتقديم أفضل خدمات النقل المتكاملة في جميع محافظات دولة الكويت. نلبي تطلعات عملائنا من خلال
                  الاعتماد على أحدث الأدوات التكنولوجية والخبرات الطويلة في هذا المجال.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, fontSize: '1.08rem' }}>
                  مهمتنا هي الحفاظ على سلامة ممتلكاتك الثمينة ونقلها بدون أي خدوش أو تلفيات. نوفر لك خدمات التغليف الكامل لجميع محتويات
                  المنزل من زجاج وأواني وأجهزة حساسة قبل النقل.
                </Typography>
              </ScrollReveal>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <ScrollReveal direction="up" delay={0.1}>
                    <Card
                      sx={{
                        bgcolor: '#f8fafc',
                        height: '100%',
                        p: 2,
                        borderRadius: 4,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                        transition: 'all 0.3s',
                        '&:hover': { transform: 'translateY(-5px)', borderColor: '#eab308', boxShadow: '0 10px 20px rgba(234,179,8,0.06)' }
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 3,
                            bgcolor: 'rgba(234,179,8,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            color: '#eab308'
                          }}
                        >
                          <ShieldSecurity size={28} variant="Bulk" />
                        </Box>
                        <Typography variant="h3" color="#eab308" fontWeight={800}>
                          100%
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={700} mt={1} color="#0f172a">
                          حماية وأمان
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                          توفير أقصى درجات السلامة للأثاث ضد الخدوش والتلف
                        </Typography>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ScrollReveal direction="up" delay={0.25}>
                    <Card
                      sx={{
                        bgcolor: '#f8fafc',
                        height: '100%',
                        p: 2,
                        borderRadius: 4,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          borderColor: 'secondary.light',
                          boxShadow: '0 10px 20px rgba(99,102,241,0.06)'
                        }
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 3,
                            bgcolor: 'secondary.lighter',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                            color: 'secondary.main'
                          }}
                        >
                          <Clock size={28} variant="Bulk" />
                        </Box>
                        <Typography variant="h3" color="secondary.main" fontWeight={800}>
                          24/7
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={700} mt={1} color="#0f172a">
                          خدمة متواصلة
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                          جاهزون لنقل عفشك في أي وقت طوال اليوم والأسبوع
                        </Typography>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── 3. SERVICES ─────────────────────────────────────── */}
      <Box sx={{ py: 12, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
        <Container maxWidth="lg">
          <ScrollReveal direction="up">
            <Box textAlign="center" mb={8}>
              <Box sx={{ display: 'inline-block', bgcolor: 'rgba(234,179,8,0.08)', px: 2.5, py: 0.6, borderRadius: 10, mb: 2 }}>
                <Typography variant="caption" color="#eab308" fontWeight={800} sx={{ letterSpacing: 1 }}>
                  خدماتنا المتميزة
                </Typography>
              </Box>
              <Typography variant="h2" fontWeight={800} color="#0f172a" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                أفضل حلول نقل العفش المتكاملة بالكويت
              </Typography>
            </Box>
          </ScrollReveal>
          <Grid container spacing={4}>
            {services.map((service, idx) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <ScrollReveal direction="up" delay={idx * 0.1}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        borderColor: '#eab308',
                        boxShadow: '0 20px 25px -5px rgba(234,179,8,0.1), 0 10px 10px -5px rgba(234,179,8,0.04)'
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      {service.image && (
                        <CardMedia
                          component="img"
                          height="220"
                          image={service.image}
                          alt={service.title}
                          sx={{ transition: 'transform 0.5s', '&:hover': { transform: 'scale(1.08)' } }}
                        />
                      )}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          bgcolor: '#eab308',
                          color: '#0f172a',
                          px: 2,
                          py: 0.5,
                          borderRadius: 10,
                          fontSize: '0.75rem',
                          fontWeight: 800
                        }}
                      >
                        سريع وآمن
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h4" fontWeight={800} gutterBottom color="#0f172a" sx={{ fontSize: '1.25rem' }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
                        {service.short_description}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 3, pt: 0, borderTop: '1px solid #f1f5f9' }}>
                      <Button
                        component={Link}
                        href={`/services/${service.slug}`}
                        variant="text"
                        color="primary"
                        endIcon={<ArrowRight size={16} />}
                        sx={{ fontWeight: 800, p: 0, mt: 2, color: '#eab308', '&:hover': { gap: 1, color: '#ca8a04' } }}
                      >
                        اقرأ المزيد
                      </Button>
                    </Box>
                  </Card>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── 4. WHY US ───────────────────────────────────────── */}
      <Box sx={{ py: 12, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <ScrollReveal direction="fade">
            <Box textAlign="center" mb={8}>
              <Box sx={{ display: 'inline-block', bgcolor: 'rgba(234,179,8,0.08)', px: 2.5, py: 0.6, borderRadius: 10, mb: 2 }}>
                <Typography variant="caption" color="#eab308" fontWeight={800} sx={{ letterSpacing: 1 }}>
                  مميزاتنا
                </Typography>
              </Box>
              <Typography variant="h2" fontWeight={800} color="#0f172a" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                لماذا تختار شركة الحور لنقل العفش؟
              </Typography>
            </Box>
          </ScrollReveal>
          <Grid container spacing={4}>
            {[
              {
                icon: <TruckFast size={32} variant="Bulk" />,
                title: 'سيارات نقل مخصصة ومقفلة',
                desc: 'لحماية الأثاث من الغبار، الأتربة، والأمطار في شوارع الكويت.'
              },
              {
                icon: <ShieldSecurity size={32} variant="Bulk" />,
                title: 'نجار فك وتركيب غرف نوم',
                desc: 'نجارون محترفون لفك غرف ايكيا، ميداس، وغرف النوم الصينية والوطنية بدقة.'
              },
              {
                icon: <Clock size={32} variant="Bulk" />,
                title: 'التزام تام بالمواعيد',
                desc: 'نصلك في الوقت المتفق عليه لنوفر وقتك ونضمن سرعة إنجاز المعاملة.'
              },
              {
                icon: <Like1 size={32} variant="Bulk" />,
                title: 'أسعار مناسبة ومنافسة',
                desc: 'نقدم لك أفضل خدمات نقل العفش في الكويت بأرخص الأسعار المناسبة لجميع الفئات.'
              }
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <ScrollReveal direction="zoom" delay={idx * 0.12}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 4,
                      border: '1px solid #f1f5f9',
                      bgcolor: '#f8fafc',
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: '#ffffff', borderColor: '#eab308', boxShadow: '0 10px 30px rgba(234,179,8,0.05)' }
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: 'rgba(234,179,8,0.08)',
                        color: '#eab308',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="h5" fontWeight={800} mb={1.5} color="#1e293b">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ px: 1, lineHeight: 1.6 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── 5. GALLERY ──────────────────────────────────────── */}
      <Box sx={{ py: 12, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
        <Container maxWidth="lg">
          <ScrollReveal direction="up">
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={6}>
              <Box>
                <Box sx={{ display: 'inline-block', bgcolor: 'rgba(234,179,8,0.08)', px: 2, py: 0.5, borderRadius: 1.5, mb: 2 }}>
                  <Typography variant="caption" color="#eab308" fontWeight={800} sx={{ letterSpacing: 1 }}>
                    معرض أعمالنا
                  </Typography>
                </Box>
                <Typography variant="h2" fontWeight={800} color="#0f172a" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                  شاهد خدماتنا على أرض الواقع
                </Typography>
              </Box>
              <Button
                component={Link}
                href="/gallery"
                variant="outlined"
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 700,
                  color: '#eab308',
                  borderColor: '#eab308',
                  '&:hover': { borderColor: '#ca8a04', bgcolor: 'rgba(234,179,8,0.04)' }
                }}
              >
                عرض المعرض بالكامل
              </Button>
            </Box>
          </ScrollReveal>
          <Grid container spacing={3}>
            {gallery.slice(0, 6).map((img, idx) => (
              <Grid item xs={12} sm={6} md={4} key={img.id}>
                <ScrollReveal direction="up" delay={idx * 0.08}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                      transition: 'all 0.3s',
                      '&:hover': { transform: 'translateY(-4px)', borderColor: '#eab308', boxShadow: '0 12px 24px rgba(234,179,8,0.08)' }
                    }}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height="240"
                        image={img.image}
                        alt={img.title}
                        sx={{ transition: 'transform 0.5s', '&:hover': { transform: 'scale(1.08)' } }}
                      />
                    </Box>
                    <Box p={2.5} textAlign="center" bgcolor="background.paper">
                      <Typography variant="subtitle1" fontWeight={700} color="#1e293b">
                        {img.title}
                      </Typography>
                    </Box>
                  </Card>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── 6. TESTIMONIALS ─────────────────────────────────── */}
      <Box sx={{ py: 12, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <ScrollReveal direction="up">
            <Box textAlign="center" mb={8}>
              <Box sx={{ display: 'inline-block', bgcolor: 'rgba(234,179,8,0.08)', px: 2, py: 0.5, borderRadius: 1.5, mb: 2 }}>
                <Typography variant="caption" color="#eab308" fontWeight={800}>
                  آراء العملاء
                </Typography>
              </Box>
              <Typography variant="h2" fontWeight={800} color="#0f172a" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                ماذا يقول عملائنا في الكويت عن خدمتنا؟
              </Typography>
            </Box>
          </ScrollReveal>
          <Grid container spacing={4}>
            {testimonials.map((test, idx) => (
              <Grid item xs={12} sm={6} md={3} key={test.id}>
                <ScrollReveal direction="up" delay={idx * 0.1}>
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: '#f8fafc',
                      p: 2,
                      borderRadius: 4,
                      border: '1px solid #f1f5f9',
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: '#ffffff', borderColor: '#eab308', boxShadow: '0 10px 25px rgba(234,179,8,0.05)' }
                    }}
                  >
                    <CardContent>
                      <Rating value={test.rating} readOnly size="small" sx={{ mb: 2 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                        sx={{ fontStyle: 'italic', lineHeight: 1.7, minHeight: 80 }}
                      >
                        &ldquo;{test.comment}&rdquo;
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2} mt={3} sx={{ borderTop: '1px solid #f1f5f9', pt: 2 }}>
                        {test.image && (
                          <Box component="img" src={test.image} sx={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                        )}
                        <Box>
                          <Typography variant="subtitle2" fontWeight={800} color="#1e293b">
                            {test.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {test.job_title}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── 7. ARTICLES ─────────────────────────────────────── */}
      <Box sx={{ py: 12, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
        <Container maxWidth="lg">
          <ScrollReveal direction="up">
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={6}>
              <Box>
                <Box sx={{ display: 'inline-block', bgcolor: 'rgba(234,179,8,0.08)', px: 2, py: 0.5, borderRadius: 1.5, mb: 2 }}>
                  <Typography variant="caption" color="#eab308" fontWeight={800}>
                    المدونة والحديث
                  </Typography>
                </Box>
                <Typography variant="h2" fontWeight={800} color="#0f172a" sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                  نصائح وأخبار نقل العفش
                </Typography>
              </Box>
              <Button
                component={Link}
                href="/blog"
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 700,
                  color: '#eab308',
                  borderColor: '#eab308',
                  '&:hover': { borderColor: '#ca8a04', bgcolor: 'rgba(234,179,8,0.04)' }
                }}
              >
                زيارة المدونة
              </Button>
            </Box>
          </ScrollReveal>
          <Grid container spacing={4}>
            {articles.map((art, idx) => (
              <Grid item xs={12} md={4} key={art.id}>
                <ScrollReveal direction="up" delay={idx * 0.12}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                      transition: 'all 0.3s',
                      '&:hover': { transform: 'translateY(-6px)', borderColor: '#eab308', boxShadow: '0 15px 30px rgba(234,179,8,0.08)' }
                    }}
                  >
                    {art.image && <CardMedia component="img" height="200" image={art.image} alt={art.title} />}
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h4" fontWeight={800} gutterBottom color="#0f172a" sx={{ fontSize: '1.2rem', lineHeight: 1.4 }}>
                        {art.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}
                      >
                        {art.excerpt}
                      </Typography>
                    </CardContent>
                    <Box p={3} pt={0} sx={{ borderTop: '1px solid #f1f5f9' }}>
                      <Button
                        component={Link}
                        href={`/blog/${art.slug}`}
                        variant="text"
                        sx={{ fontWeight: 800, p: 0, mt: 2, color: '#eab308', '&:hover': { color: '#ca8a04' } }}
                      >
                        اقرأ المقال كاملاً
                      </Button>
                    </Box>
                  </Card>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── 8. CTA + CONTACT FORM ───────────────────────────── */}
      <Box id="contact-form" sx={{ py: 12, bgcolor: '#0f172a', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            left: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <ScrollReveal direction="left">
                <Typography
                  variant="h2"
                  fontWeight={900}
                  color="#facc15"
                  sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.2 }}
                  gutterBottom
                >
                  هل تبحث عن خدمات نقل أثاث سريعة واحترافية بالكويت؟
                </Typography>
                <Typography variant="body1" sx={{ color: 'grey.400', mb: 5, lineHeight: 1.8, fontSize: '1.05rem' }}>
                  قم بملء النموذج وسيقوم فريقنا بالتواصل معك هاتفياً أو عبر واتساب خلال دقائق معدودة لتزويدك بالتكلفة الإجمالية المناسبة
                  وحجز موعد النقل.
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2.5}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(250,204,21,0.15)', borderRadius: '50%', display: 'flex', color: '#facc15' }}>
                    <CallCalling size={32} variant="Bulk" />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="grey.400">
                      رقم الهاتف الساخن
                    </Typography>
                    <Typography
                      variant="h3"
                      fontWeight={800}
                      component="a"
                      href={`tel:${settings.phone}`}
                      sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: '#facc15' } }}
                    >
                      {settings.phone}
                    </Typography>
                  </Box>
                </Stack>
              </ScrollReveal>
            </Grid>

            <Grid item xs={12} md={6}>
              <ScrollReveal direction="right">
                <Card
                  sx={{
                    borderRadius: 4,
                    p: 3,
                    border: '1px solid rgba(255,255,255,0.08)',
                    bgcolor: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(16px)'
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h4" fontWeight={800} mb={3.5} color="white" align="center">
                      اطلب تسعيرة النقل الآن
                    </Typography>
                    {formSuccess && (
                      <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                        تم إرسال طلبك بنجاح! سنتواصل معك قريباً جداً.
                      </Alert>
                    )}
                    {formError && (
                      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
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
                        sx={{
                          mb: 2.5,
                          '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2.5, color: 'white' },
                          '& .MuiInputLabel-root': { color: 'grey.500' }
                        }}
                      />

                      <TextField
                        fullWidth
                        name="phone"
                        label="رقم الهاتف (الخلوي)"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                        sx={{
                          mb: 2.5,
                          '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2.5, color: 'white' },
                          '& .MuiInputLabel-root': { color: 'grey.500' }
                        }}
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
                        sx={{
                          mb: 2.5,
                          '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2.5, color: 'white' },
                          '& .MuiInputLabel-root': { color: 'grey.500' }
                        }}
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
                        sx={{
                          mb: 3.5,
                          '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2.5, color: 'white' },
                          '& .MuiInputLabel-root': { color: 'grey.500' }
                        }}
                      />

                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={formSubmitting}
                        sx={{
                          py: 1.8,
                          fontWeight: 800,
                          borderRadius: 2.5,
                          fontSize: '1rem',
                          color: '#0f172a',
                          background: 'linear-gradient(135deg,#facc15,#eab308)',
                          boxShadow: '0 8px 24px rgba(234,179,8,0.3)',
                          '&:hover': { transform: 'translateY(-2px)', background: 'linear-gradient(135deg,#fde047,#ca8a04)' },
                          transition: 'all 0.3s'
                        }}
                      >
                        {formSubmitting ? <CircularProgress size={24} color="inherit" /> : 'إرسال طلب النقل'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

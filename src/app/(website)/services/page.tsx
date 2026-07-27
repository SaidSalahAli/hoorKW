'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Link from 'next/link';
import ScrollReveal from 'components/ScrollReveal';

import { ArrowRight, Gallery } from '@wandersonalwes/iconsax-react';
import { publicApiClient } from 'lib/apiClient';

// ==============================|| PUBLIC SERVICES PAGE ||============================== //

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

const PER_PAGE = 6;

const DEFAULT_SERVICES = [
  {
    id: 1,
    title: 'نقل عفش وتغليف منازل وفلل',
    slug: 'house-moving',
    short_description:
      'خدمة نقل أثاث شاملة لجميع الغرف والأجهزة الكهربائية والستائر مع التغليف والفك والتركيب الاحترافي بجميع مناطق الكويت.',
    image: '/assets/images/home/hero.png'
  },
  {
    id: 2,
    title: 'نجار فك وتركيب غرف نوم',
    slug: 'bedroom-assembly',
    short_description:
      'نجارون متخصصون لفك وتركيب جميع أنواع غرف النوم الإيكيا والميداس والغرف الصينية والأوروبية بدقة عالية وبدون أي خدوش.',
    image: '/assets/images/home/hero.png'
  },
  {
    id: 3,
    title: 'تغليف العفش بالأبلز والكرتون المضلع',
    slug: 'furniture-packing',
    short_description: 'تغليف آمن ومحكم لجميع قطع الأثاث والزجاج والتحف والأدوات المنزلية للحماية التامة أثناء التحميل والنقل.',
    image: '/assets/images/home/hero.png'
  },
  {
    id: 4,
    title: 'نقل عفش هاف لوري وسيارات مقفلة',
    slug: 'haf-lorry-moving',
    short_description: 'أسطول سيارات نقل حديثة ومقفلة مجهزة لنقل العفش بأمان وسرعة فائقة بين كافة مناطق ومحافظات الكويت على مدار 24 ساعة.',
    image: '/assets/images/home/hero.png'
  },
  {
    id: 5,
    title: 'نقل أثاث المكاتب والشركات',
    slug: 'office-moving',
    short_description: 'خدمات نقل مكتبية سريعة ومنظمة تضمن استمرارية أعمال شركتك ونقل الأجهزة والمكاتب والملفات بمرونة واحترافية.',
    image: '/assets/images/home/hero.png'
  },
  {
    id: 6,
    title: 'ونش رفع أثاث للأدوار العليا',
    slug: 'winch-furniture-lifting',
    short_description: 'ونش رفع الأثاث الهيدروليكي للقطع الثقيلة والكبيرة للأدوار العليا في الأبراج والمباني السكنية بكل سهولة وأمان.',
    image: '/assets/images/home/hero.png'
  }
];

export default function PublicServicesPage() {
  const [services, setServices] = useState<any[]>(DEFAULT_SERVICES);
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, per_page: PER_PAGE, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(PER_PAGE)
      });
      const res = await publicApiClient.get(`/api/services?${params.toString()}`);
      if (res.data.data && res.data.data.length > 0) {
        setServices(res.data.data);
        if (res.data.meta) {
          setMeta(res.data.meta);
        }
      } else if (initialLoaded) {
        setServices([]);
      }
      setInitialLoaded(true);
    } catch (err: any) {
      console.error('Error loading services:', err);
      setError('فشل في تحميل الخدمات. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  }, [page, initialLoaded]);

  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
              خدماتنا لنقل العفش والأثاث
            </Typography>
            <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 400, maxWidth: 720, mx: 'auto', lineHeight: 1.7 }}>
              نوفر خدمات نقل وتعبئة وتغليف وتخزين متكاملة لجميع الاحتياجات السكنية والتجارية في دولة الكويت
            </Typography>
          </ScrollReveal>
        </Container>
      </Box>

      {/* Services List Content */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={44} sx={{ color: '#eab308' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        ) : services.length === 0 ? (
          <Box py={8} textAlign="center">
            <Typography color="text.secondary">لا توجد خدمات متاحة حالياً.</Typography>
          </Box>
        ) : (
          <>
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
                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          borderColor: '#eab308',
                          boxShadow: '0 20px 25px -5px rgba(234,179,8,0.1), 0 10px 10px -5px rgba(234,179,8,0.04)'
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', height: 220, overflow: 'hidden', bgcolor: 'action.hover' }}>
                        {service.image ? (
                          <CardMedia
                            component="img"
                            height="100%"
                            image={service.image}
                            alt={service.title}
                            loading="lazy"
                            decoding="async"
                            sx={{
                              objectFit: 'cover',
                              transition: 'transform 0.5s ease',
                              '&:hover': { transform: 'scale(1.08)' }
                            }}
                          />
                        ) : (
                          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                            <Gallery size={44} color="#ccc" />
                          </Box>
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
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 1 }}>
                          {service.short_description}
                        </Typography>
                      </CardContent>
                      <Box sx={{ p: 3, pt: 0, borderTop: '1px solid #f1f5f9' }}>
                        <Link href={`/services/${service.slug}`} passHref legacyBehavior>
                          <Button
                            variant="text"
                            endIcon={<ArrowRight size={16} />}
                            sx={{
                              fontWeight: 800,
                              p: 0,
                              mt: 2,
                              color: '#eab308',
                              '&:hover': { gap: 1, color: '#ca8a04', bgcolor: 'transparent' },
                              '&:focus, &:focus-visible, &:active, &.Mui-focusVisible': {
                                outline: 'none !important',
                                boxShadow: 'none !important',
                                border: 'none !important',
                                bgcolor: 'transparent'
                              },
                              WebkitTapHighlightColor: 'transparent',
                              transition: 'all 0.2s'
                            }}
                          >
                            تفاصيل الخدمة وحجز موعد
                          </Button>
                        </Link>
                      </Box>
                    </Card>
                  </ScrollReveal>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {meta.last_page > 1 && (
              <Box mt={8} display="flex" flexDirection="column" alignItems="center" gap={1.5}>
                <Pagination
                  count={meta.last_page}
                  page={meta.current_page}
                  onChange={handlePageChange}
                  siblingCount={1}
                  boundaryCount={1}
                  renderItem={(item) => (
                    <PaginationItem
                      {...item}
                      sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                        '&.Mui-selected': {
                          bgcolor: '#eab308',
                          color: '#0f172a',
                          '&:hover': { bgcolor: '#ca8a04' }
                        },
                        '&:hover': { borderColor: '#eab308', color: '#eab308' }
                      }}
                    />
                  )}
                />
                <Typography variant="caption" color="text.secondary">
                  عرض {meta.from ?? ((meta.current_page - 1) * meta.per_page + 1)} –{' '}
                  {meta.to ?? Math.min(meta.current_page * meta.per_page, meta.total)} من أصل {meta.total} خدمة
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

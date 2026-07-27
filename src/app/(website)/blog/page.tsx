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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Link from 'next/link';
import ScrollReveal from 'components/ScrollReveal';

import { SearchNormal1, Gallery } from '@wandersonalwes/iconsax-react';
import { publicApiClient as apiClient } from 'lib/apiClient';

// ==============================|| PUBLIC BLOG PAGE ||============================== //

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

const PER_PAGE = 6;

export default function PublicBlogPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ current_page: 1, last_page: 1, per_page: PER_PAGE, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(PER_PAGE)
      });
      if (debouncedSearch) params.set('search', debouncedSearch);

      const res = await apiClient.get(`/api/articles?${params.toString()}`);
      setArticles(res.data.data || []);
      if (res.data.meta) {
        setMeta(res.data.meta);
      }
    } catch (err: any) {
      setError(err.message || 'خطأ في تحميل المقالات. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

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
              مدونة الحور لنقل العفش
            </Typography>
            <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 400, maxWidth: 720, mx: 'auto', lineHeight: 1.7 }}>
              نصائح عملية وإرشادات لتسهيل عملية نقل الأثاث وتعبئته وتخزينه بأمان
            </Typography>
          </ScrollReveal>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        {/* Search */}
        <Box mb={7} display="flex" justifyContent="center">
          <ScrollReveal direction="fade" style={{ width: '100%', maxWidth: 500 }}>
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن نصائح أو مواضيع النقل..."
              sx={{
                width: '100%',
                bgcolor: 'background.paper',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  '&.Mui-focused fieldset': {
                    borderColor: '#eab308'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ pl: 1 }}>
                    <SearchNormal1 size={20} color="#eab308" />
                  </InputAdornment>
                )
              }}
            />
          </ScrollReveal>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={44} sx={{ color: '#eab308' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: 2.5 }}>
            {error}
          </Alert>
        ) : articles.length === 0 ? (
          <Box py={8} textAlign="center">
            <Typography color="text.secondary">لا توجد مقالات منشورة حالياً تطابق بحثك.</Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={4}>
              {articles.map((art, idx) => (
                <Grid item xs={12} sm={6} md={4} key={art.id}>
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
                          transform: 'translateY(-6px)',
                          borderColor: '#eab308',
                          boxShadow: '0 20px 25px -5px rgba(234,179,8,0.1)'
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden', bgcolor: 'action.hover' }}>
                        {art.image ? (
                          <CardMedia
                            component="img"
                            height="100%"
                            image={art.image}
                            alt={art.title}
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
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography variant="h4" fontWeight={800} color="#0f172a" gutterBottom sx={{ fontSize: '1.2rem', lineHeight: 1.45 }}>
                          {art.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.7 }}
                        >
                          {art.excerpt}
                        </Typography>
                      </CardContent>
                      <Box
                        sx={{
                          p: 3,
                          pt: 0,
                          borderTop: '1px solid #f1f5f9',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Link href={`/blog/${art.slug}`} passHref legacyBehavior>
                          <Button
                            variant="text"
                            sx={{
                              fontWeight: 800,
                              p: 0,
                              color: '#eab308',
                              '&:hover': { color: '#ca8a04', bgcolor: 'transparent' },
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
                            اقرأ المزيد
                          </Button>
                        </Link>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          {new Date(art.published_at || art.created_at).toLocaleDateString('ar-KW')}
                        </Typography>
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
                      {...item as any}
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
                  {meta.to ?? Math.min(meta.current_page * meta.per_page, meta.total)} من أصل {meta.total} مقالة
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

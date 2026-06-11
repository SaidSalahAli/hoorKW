'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import ScrollReveal from 'components/ScrollReveal';

import { publicApiClient as apiClient } from 'lib/apiClient';

// ==============================|| ARTICLE DETAILS PAGE ||============================== //

interface ArticleDetailsProps {
  params: Promise<{ slug: string }>;
}

export default function ArticleDetailsPage({ params }: ArticleDetailsProps) {
  const [slug, setSlug] = useState<string | null>(null);
  const [article, setArticle] = useState<any | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    async function loadArticle() {
      try {
        const res = await apiClient.get(`/api/articles/slug/${slug}`);
        setArticle(res.data.data);

        // Fetch related articles (latest 3 posts)
        const relRes = await apiClient.get('/api/articles?per_page=3&status=published');
        setRelated(relRes.data.data.filter((a: any) => a.slug !== slug));
      } catch (err: any) {
        setError(err.message || 'المقال المطلوب غير موجود.');
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={44} sx={{ color: '#eab308' }} />
      </Box>
    );
  }

  if (error || !article) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error || 'المقال المطلوب غير متوفر حالياً.'}
        </Alert>
        <Link href="/blog" passHref legacyBehavior>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#eab308',
              color: '#0f172a',
              fontWeight: 800,
              '&:hover': { bgcolor: '#ca8a04' },
              '&:focus, &:focus-visible, &:active': {
                outline: 'none !important',
                boxShadow: 'none !important',
                border: 'none !important'
              },
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            العودة للمقالات
          </Button>
        </Link>
      </Container>
    );
  }

  // Schema Markup (Article Schema)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.published_at || article.created_at,
    author: {
      '@type': 'Organization',
      name: 'الحور لنقل العفش'
    }
  };

  return (
    <Box>
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header Banner */}
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
              <Link href="/blog" passHref legacyBehavior>
                <Box
                  component="a"
                  sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: '#facc15' }, transition: 'color 0.2s' }}
                >
                  المدونة
                </Box>
              </Link>
              <span>/</span>
              <Typography variant="caption" sx={{ color: '#facc15', fontWeight: 700 }}>
                {article.title}
              </Typography>
            </Stack>
            <Typography variant="h1" fontWeight={900} sx={{ fontSize: { xs: '2.2rem', md: '3.2rem' } }}>
              {article.title}
            </Typography>
            <Stack direction="row" spacing={2} mt={2} color="grey.400" fontSize="0.875rem">
              <span>تاريخ النشر: {new Date(article.published_at || article.created_at).toLocaleDateString('ar-KW')}</span>
              <span>•</span>
              <span>الزيارات: {article.views} مشاهدة</span>
            </Stack>
          </ScrollReveal>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Grid container spacing={6}>
          {/* Article Contents */}
          <Grid item xs={12} md={8}>
            <ScrollReveal direction="left">
              {article.image && (
                <Box
                  component="img"
                  src={article.image}
                  alt={article.title}
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
              <Typography
                variant="subtitle1"
                sx={{
                  fontStyle: 'italic',
                  borderRight: '4px solid',
                  borderColor: '#eab308',
                  pr: 2.5,
                  mb: 4,
                  color: 'text.secondary',
                  fontSize: '1.15rem',
                  lineHeight: 1.85
                }}
              >
                {article.excerpt}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.95, fontSize: '1.08rem', color: 'text.primary' }}>
                {article.content}
              </Typography>
            </ScrollReveal>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <ScrollReveal direction="right">
              {/* Related Posts */}
              <Card sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 4, mb: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                <Typography variant="h4" fontWeight={850} color="#0f172a" gutterBottom mb={3.5} sx={{ fontSize: '1.3rem' }}>
                  مواضيع ذات صلة
                </Typography>
                <Stack spacing={3}>
                  {related.map((rel) => (
                    <Box key={rel.id} sx={{ pb: 2.5, borderBottom: '1px solid #f1f5f9', '&:last-child': { pb: 0, borderBottom: 'none' } }}>
                      <Link href={`/blog/${rel.slug}`} passHref legacyBehavior>
                        <Box
                          component="a"
                          sx={{
                            color: '#0f172a',
                            textDecoration: 'none',
                            '&:hover': { color: '#eab308' },
                            display: 'block',
                            fontWeight: 700,
                            fontSize: '1.02rem',
                            lineHeight: 1.45,
                            transition: 'color 0.2s',
                            mb: 1
                          }}
                        >
                          {rel.title}
                        </Box>
                      </Link>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {new Date(rel.published_at || rel.created_at).toLocaleDateString('ar-KW')}
                      </Typography>
                    </Box>
                  ))}
                  {related.length === 0 && <Typography color="text.secondary">لا توجد مقالات مقترحة حالياً.</Typography>}
                </Stack>
              </Card>

              {/* Sidebar CTA Card */}
              <Card
                sx={{
                  p: 4.5,
                  bgcolor: '#0f172a',
                  color: 'white',
                  borderRadius: 4,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Glowing decor */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(250,204,21,0.07) 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }}
                />

                <Typography variant="h4" fontWeight={900} color="#facc15" mb={2} sx={{ fontSize: '1.5rem' }}>
                  هل تحتاج إلى نقل عفش؟
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 4, lineHeight: 1.7 }}>
                  تواصل معنا الآن للحصول على أفضل خدمات نقل الأثاث في الكويت وبأفضل الأسعار.
                </Typography>
                <Link href="/request-service" passHref legacyBehavior>
                  <Button
                    variant="contained"
                    fullWidth
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
                    طلب تسعيرة النقل
                  </Button>
                </Link>
              </Card>
            </ScrollReveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

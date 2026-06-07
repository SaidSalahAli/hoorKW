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
        <CircularProgress />
      </Box>
    );
  }

  if (error || !article) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'المقال المطلوب غير متوفر حالياً.'}
        </Alert>
        <Link href="/blog" passHref legacyBehavior>
          <Button variant="contained" color="primary">العودة للمقالات</Button>
        </Link>
      </Container>
    );
  }

  // Schema Markup (Article Schema)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.excerpt,
    'image': article.image,
    'datePublished': article.created_at,
    'author': {
      '@type': 'Organization',
      'name': 'حور لنقل العفش'
    }
  };

  return (
    <Box>
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header Banner */}
      <Box sx={{ bgcolor: '#0f172a', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={1} alignItems="center" mb={1} color="grey.400" fontSize="0.875rem">
            <Link href="/" passHref legacyBehavior><Box component="a" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'white' } }}>الرئيسية</Box></Link>
            <span>/</span>
            <Link href="/blog" passHref legacyBehavior><Box component="a" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'white' } }}>المدونة</Box></Link>
            <span>/</span>
            <Typography variant="caption" color="white">{article.title}</Typography>
          </Stack>
          <Typography variant="h1" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}>
            {article.title}
          </Typography>
          <Stack direction="row" spacing={2} mt={2} color="grey.400" fontSize="0.875rem">
            <span>تاريخ النشر: {new Date(article.created_at).toLocaleDateString('ar-KW')}</span>
            <span>•</span>
            <span>الزيارات: {article.views} مشاهدة</span>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={5}>
          {/* Article Contents */}
          <Grid item xs={12} md={8}>
            {article.image && (
              <Box
                component="img"
                src={article.image}
                alt={article.title}
                sx={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 4, mb: 4 }}
              />
            )}
            <Typography variant="subtitle1" sx={{ fontStyle: 'italic', borderRight: '4px solid', borderColor: 'primary.main', pr: 2, mb: 4, color: 'text.secondary', fontSize: '1.1rem', lineHeight: 1.8 }}>
              {article.excerpt}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, fontSize: '1.05rem', color: 'text.primary' }}>
              {article.content}
            </Typography>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 4 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom mb={3}>
                مواضيع ذات صلة
              </Typography>
              <Stack spacing={3}>
                {related.map((rel) => (
                  <Box key={rel.id}>
                    <Link href={`/blog/${rel.slug}`} passHref legacyBehavior>
                      <Box component="a" sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'primary.main' }, display: 'block', fontWeight: 600 }}>
                        {rel.title}
                      </Box>
                    </Link>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(rel.created_at).toLocaleDateString('ar-KW')}
                    </Typography>
                  </Box>
                ))}
                {related.length === 0 && (
                  <Typography color="text.secondary">لا توجد مقالات مقترحة حالياً.</Typography>
                )}
              </Stack>
            </Card>

            <Card sx={{ p: 4, bgcolor: '#0f172a', color: 'white', borderRadius: 3, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700} mb={2}>
                هل تحتاج إلى نقل عفش؟
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                تواصل معنا الآن للحصول على أفضل خدمات نقل الأثاث في الكويت.
              </Typography>
              <Link href="/request-service" passHref legacyBehavior>
                <Button variant="contained" color="primary" fullWidth sx={{ py: 1.2, fontWeight: 700 }}>
                  طلب تسعيرة النقل
                </Button>
              </Link>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

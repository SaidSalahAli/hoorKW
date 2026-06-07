'use client';

import React, { useState, useEffect } from 'react';
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
import Link from 'next/link';

import { SearchNormal1, Gallery } from '@wandersonalwes/iconsax-react';
import { publicApiClient as apiClient } from 'lib/apiClient';

// ==============================|| PUBLIC BLOG PAGE ||============================== //

export default function PublicBlogPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadArticles() {
      try {
        const url = searchQuery ? `/api/articles?status=published&search=${encodeURIComponent(searchQuery)}` : '/api/articles?status=published';
        const res = await apiClient.get(url);
        setArticles(res.data.data || []);
      } catch (err: any) {
        setError(err.message || 'خطأ في تحميل المقالات. يرجى المحاولة لاحقاً.');
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, [searchQuery]);

  return (
    <Box>
      {/* Banner */}
      <Box sx={{ bgcolor: '#0f172a', color: 'white', py: 8, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h1" fontWeight={800} gutterBottom>
            مدونة حور لنقل العفش
          </Typography>
          <Typography variant="h5" color="grey.400" fontWeight={400}>
            نصائح عملية وإرشادات لتسهيل عملية نقل الأثاث وتعبئته وتخزينه بأمان
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        {/* Search */}
        <Box mb={6} display="flex" justifyContent="center">
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن نصائح أو مواضيع النقل..."
            sx={{ maxWidth: 500, width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchNormal1 size={20} />
                </InputAdornment>
              )
            }}
          />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : articles.length === 0 ? (
          <Box py={8} textAlign="center">
            <Typography color="text.secondary">لا توجد مقالات منشورة حالياً تطابق بحثك.</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {articles.map((art) => (
              <Grid item xs={12} sm={6} md={4} key={art.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'translateY(-5px)' }
                  }}
                >
                  <Box sx={{ position: 'relative', height: 200, bgcolor: 'action.hover' }}>
                    {art.image ? (
                      <CardMedia component="img" height="100%" image={art.image} alt={art.title} sx={{ objectFit: 'cover' }} />
                    ) : (
                      <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                        <Gallery size={44} color="#ccc" />
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h4" fontWeight={700} gutterBottom sx={{ fontSize: '1.25rem', lineHeight: 1.4 }}>
                      {art.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.7, mb: 3 }}>
                      {art.excerpt}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 3, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href={`/blog/${art.slug}`} passHref legacyBehavior>
                      <Button variant="text" color="primary" sx={{ fontWeight: 700, p: 0 }}>
                        اقرأ المزيد
                      </Button>
                    </Link>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(art.created_at).toLocaleDateString('ar-KW')}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

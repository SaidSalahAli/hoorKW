import React from 'react';
import { Metadata } from 'next';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Link from 'next/link';

import { publicApiClient as apiClient } from 'lib/apiClient';
import ArticleDetailsClient from './ArticleDetailsClient';

// ==============================|| ARTICLE DETAILS PAGE (SERVER) ||============================== //

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await apiClient.get(`/api/articles/slug/${slug}`);
    const article = res.data.data;
    return {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt,
      openGraph: {
        title: article.meta_title || article.title,
        description: article.meta_description || article.excerpt,
        images: article.image ? [{ url: article.image }] : []
      }
    };
  } catch {
    return {
      title: 'المقال غير موجود | الحور لنقل العفش',
      description: 'المقال المطلوب غير متوفر حالياً.'
    };
  }
}

export default async function ArticleDetailsPage({ params }: Props) {
  const { slug } = await params;
  let article: any = null;
  let related: any[] = [];
  let error: string | null = null;

  try {
    const res = await apiClient.get(`/api/articles/slug/${slug}`);
    article = res.data.data;

    // Fetch related articles (latest 3 posts)
    const relRes = await apiClient.get('/api/articles?per_page=3&status=published');
    related = relRes.data.data.filter((a: any) => a.slug !== slug);
  } catch (err: any) {
    error = err.message || 'المقال المطلوب غير موجود.';
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

  return <ArticleDetailsClient article={article} related={related} />;
}

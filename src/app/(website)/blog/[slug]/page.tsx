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

async function fetchArticleBySlugOrSearch(slugParam: string) {
  const decoded = decodeURIComponent(slugParam);
  let article: any = null;

  // 1. Try slug endpoint (decoded)
  try {
    const res = await apiClient.get(`/api/articles/slug/${decoded}`);
    if (res.data?.data) article = res.data.data;
  } catch {}

  // 2. Try slug endpoint (raw)
  if (!article) {
    try {
      const res = await apiClient.get(`/api/articles/slug/${slugParam}`);
      if (res.data?.data) article = res.data.data;
    } catch {}
  }

  // 3. Fallback: Search by title / text query if slug is Arabic title
  if (!article) {
    try {
      const cleanSearch = decoded.replace(/-/g, ' ');
      const searchRes = await apiClient.get(`/api/articles?search=${encodeURIComponent(cleanSearch)}`);
      const items = searchRes.data?.data || [];
      if (items.length > 0) {
        article = items[0];
      }
    } catch {}
  }

  return article;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await fetchArticleBySlugOrSearch(slug);
    if (!article) throw new Error('Not found');

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
  const decodedSlug = decodeURIComponent(slug);
  let article: any = null;
  let related: any[] = [];
  let error: string | null = null;

  try {
    article = await fetchArticleBySlugOrSearch(slug);

    if (!article) {
      error = 'المقال المطلوب غير متوفر أو غير منشور حالياً.';
    } else {
      // Fetch related articles (latest 3 posts)
      const relRes = await apiClient.get('/api/articles?per_page=3&status=published');
      related = (relRes.data?.data || []).filter(
        (a: any) => a.slug !== decodedSlug && a.slug !== slug && a.id !== article?.id
      );
    }
  } catch (err: any) {
    error = err.message || 'المقال المطلوب غير موجود أو غير منشور حالياً.';
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

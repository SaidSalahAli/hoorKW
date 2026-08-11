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
  const canonicalUrl = `https://elhoormoving.com/blog/${slug}`;

  try {
    const article = await fetchArticleBySlugOrSearch(slug);
    if (!article) throw new Error('Not found');

    const title = article.meta_title || `${article.title} | مدونة الحور لنقل العفش`;
    const description = article.meta_description || article.excerpt;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'ar-KW': canonicalUrl,
          'x-default': canonicalUrl
        }
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'الحور لنقل العفش',
        locale: 'ar_KW',
        type: 'article',
        publishedTime: article.published_at || article.created_at,
        images: article.image ? [{ url: article.image }] : []
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description
      }
    };
  } catch {
    return {
      title: 'المقال غير موجود | الحور لنقل العفش',
      description: 'المقال المطلوب غير متوفر حالياً.',
      alternates: {
        canonical: canonicalUrl
      }
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

  const articleCanonical = `https://elhoormoving.com/blog/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${articleCanonical}#article`,
        headline: article.title,
        description: article.excerpt,
        image: article.image || 'https://elhoormoving.com/assets/images/home/hero.png',
        datePublished: article.published_at || article.created_at,
        dateModified: article.updated_at || article.published_at || article.created_at,
        publisher: { '@id': 'https://elhoormoving.com/#organization' },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': articleCanonical
        },
        inLanguage: 'ar-KW'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${articleCanonical}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: 'https://elhoormoving.com'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'المدونة',
            item: 'https://elhoormoving.com/blog'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: articleCanonical
          }
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleDetailsClient article={article} related={related} />
    </>
  );
}

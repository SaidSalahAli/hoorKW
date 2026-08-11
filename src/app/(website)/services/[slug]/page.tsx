import React from 'react';
import { Metadata } from 'next';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Link from 'next/link';

import { publicApiClient as apiClient } from 'lib/apiClient';
import ServiceDetailsClient from './ServiceDetailsClient';

// ==============================|| SERVICE DETAILS PAGE (SERVER) ||============================== //

interface Props {
  params: Promise<{ slug: string }>;
}

async function fetchServiceBySlugOrSearch(slugParam: string) {
  const decoded = decodeURIComponent(slugParam);
  let service: any = null;

  // 1. Try slug endpoint (decoded)
  try {
    const res = await apiClient.get(`/api/services/slug/${decoded}`);
    if (res.data?.data) service = res.data.data;
  } catch {}

  // 2. Try slug endpoint (raw)
  if (!service) {
    try {
      const res = await apiClient.get(`/api/services/slug/${slugParam}`);
      if (res.data?.data) service = res.data.data;
    } catch {}
  }

  // 3. Fallback: Search by title / text query if slug is Arabic title
  if (!service) {
    try {
      const cleanSearch = decoded.replace(/-/g, ' ');
      const searchRes = await apiClient.get(`/api/services?search=${encodeURIComponent(cleanSearch)}`);
      const items = searchRes.data?.data || [];
      if (items.length > 0) {
        service = items[0];
      }
    } catch {}
  }

  return service;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonicalUrl = `https://elhoormoving.com/services/${slug}`;

  try {
    const service = await fetchServiceBySlugOrSearch(slug);
    if (!service) throw new Error('Not found');

    const title = service.meta_title || `${service.title} | شركة الحور لنقل العفش بالكويت`;
    const description = service.meta_description || service.short_description;

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
        type: 'website',
        images: service.image ? [{ url: service.image }] : []
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description
      }
    };
  } catch {
    return {
      title: 'الخدمة غير موجودة | الحور لنقل العفش',
      description: 'الخدمة المطلوبة غير متوفرة حالياً.',
      alternates: {
        canonical: canonicalUrl
      }
    };
  }
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { slug } = await params;
  let service: any = null;
  let error: string | null = null;

  try {
    service = await fetchServiceBySlugOrSearch(slug);
    if (!service) {
      error = 'الخدمة المطلوبة غير متوفرة حالياً.';
    }
  } catch (err: any) {
    error = err.message || 'الخدمة المطلوبة غير موجودة.';
  }

  if (error || !service) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error || 'الخدمة المطلوبة غير متوفرة حالياً.'}
        </Alert>
        <Link href="/services" passHref legacyBehavior>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#eab308',
              color: '#0f172a',
              fontWeight: 700,
              '&:hover': { bgcolor: '#ca8a04' },
              '&:focus, &:focus-visible, &:active': {
                outline: 'none !important',
                boxShadow: 'none !important',
                border: 'none !important'
              },
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            العودة لكل الخدمات
          </Button>
        </Link>
      </Container>
    );
  }

  const serviceCanonical = `https://elhoormoving.com/services/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${serviceCanonical}#service`,
        name: service.title,
        description: service.short_description || service.description,
        provider: { '@id': 'https://elhoormoving.com/#organization' },
        areaServed: { '@type': 'Country', name: 'الكويت' },
        url: serviceCanonical,
        image: service.image || 'https://elhoormoving.com/assets/images/home/hero.png'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${serviceCanonical}#breadcrumb`,
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
            name: 'الخدمات',
            item: 'https://elhoormoving.com/services'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: service.title,
            item: serviceCanonical
          }
        ]
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ServiceDetailsClient service={service} />
    </>
  );
}

import { MetadataRoute } from 'next';

// ==============================|| SITEMAP.XML ||============================== //

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://elhoormoving.com';

const apiBase = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://api.elhoormoving.com/api/public'
).replace(/\/+$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ==============================|| STATIC PAGES ||============================== //

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/services`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/gallery`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/request-service`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  // ==============================|| DYNAMIC PAGES ||============================== //

  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const [servicesRes, articlesRes] = await Promise.all([
      fetch(
        `${apiBase}/services?status=active&per_page=500`,
        {
          cache: 'no-store',
        }
      ),

      fetch(
        `${apiBase}/articles?status=published&per_page=500`,
        {
          cache: 'no-store',
        }
      ),
    ]);

    // ==============================|| SERVICES ||============================== //

    if (servicesRes.ok) {
      const servicesData = await servicesRes.json();
      const services = servicesData?.data || [];

      dynamicPages.push(
        ...services
          .filter((service: any) => service?.slug)
          .map((service: any) => ({
            url: `${siteUrl}/services/${service.slug}`,
            lastModified: service.updated_at
              ? new Date(service.updated_at)
              : service.created_at
                ? new Date(service.created_at)
                : undefined,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          }))
      );
    }

    // ==============================|| BLOG ARTICLES ||============================== //

    if (articlesRes.ok) {
      const articlesData = await articlesRes.json();
      const articles = articlesData?.data || [];

      dynamicPages.push(
        ...articles
          .filter((article: any) => article?.slug)
          .map((article: any) => ({
            url: `${siteUrl}/blog/${article.slug}`,
            lastModified: article.updated_at
              ? new Date(article.updated_at)
              : article.created_at
                ? new Date(article.created_at)
                : undefined,
            changeFrequency: 'daily' as const,
            priority: 0.8,
          }))
      );
    }
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  // ==============================|| FINAL SITEMAP ||============================== //

  return [...staticPages, ...dynamicPages];
}
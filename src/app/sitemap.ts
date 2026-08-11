import { MetadataRoute } from 'next';

// ==============================|| SITEMAP.XML ||============================== //

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elhoormoving.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${siteUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7
    },
    {
      url: `${siteUrl}/request-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9
    }
  ];

  // Dynamic pages: fetch services and blog articles
  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const rawApi = process.env.NEXT_PUBLIC_API_URL || 'https://api.elhoormoving.com';
    const apiBase = rawApi.replace(/\/+$/, '').replace(/\/api\/public\/?$/, '');

    const [servicesRes, articlesRes] = await Promise.allSettled([
      fetch(`${apiBase}/api/services?status=active&per_page=100`, { next: { revalidate: 3600 } }),
      fetch(`${apiBase}/api/articles?status=published&per_page=100`, { next: { revalidate: 3600 } })
    ]);

    if (servicesRes.status === 'fulfilled' && servicesRes.value.ok) {
      const servicesData = await servicesRes.value.json();
      const services = servicesData?.data || [];
      dynamicPages.push(
        ...services.map((service: any) => ({
          url: `${siteUrl}/services/${service.slug}`,
          lastModified: new Date(service.updated_at || service.created_at || new Date()),
          changeFrequency: 'monthly' as const,
          priority: 0.8
        }))
      );
    }

    if (articlesRes.status === 'fulfilled' && articlesRes.value.ok) {
      const articlesData = await articlesRes.value.json();
      const articles = articlesData?.data || [];
      dynamicPages.push(
        ...articles.map((article: any) => ({
          url: `${siteUrl}/blog/${article.slug}`,
          lastModified: new Date(article.updated_at || article.created_at || new Date()),
          changeFrequency: 'monthly' as const,
          priority: 0.7
        }))
      );
    }
  } catch {
    // Silently fail — static pages will still be in sitemap
  }

  return [...staticPages, ...dynamicPages];
}

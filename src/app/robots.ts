import { MetadataRoute } from 'next';

// ==============================|| ROBOTS.TXT ||============================== //

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://elhoormoving.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login']
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}

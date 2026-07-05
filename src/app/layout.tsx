import type { Metadata, Viewport } from 'next';

import './globals.css';

// project-imports
import ProviderWrapper from './ProviderWrapper';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0f172a'
};

export const metadata: Metadata = {
  title: {
    default: 'الحور لنقل العفش | أفضل شركة نقل عفش وأثاث بالكويت 24 ساعة',
    template: '%s | الحور لنقل العفش'
  },
  description: 'شركة الحور لنقل العفش والأثاث بجميع مناطق الكويت. أفضل خدمات فك، تركيب وتغليف الأثاث بأقل الأسعار وبأيدي نجارين فنيين.',
  keywords: [
    'نقل عفش',
    'نقل اثاث',
    'شركة نقل عفش الكويت',
    'نقل عفش الكويت',
    'الحور لنقل العفش',
    'فك وتركيب اثاث',
    'نقل عفش هاف لوري',
    'نقل عفش رخيص',
    'نقل عفش حولي',
    'نقل عفش السالمية',
    'نقل عفش الفروانية',
    'نقل عفش الاحمدي',
    'نقل عفش الجهراء'
  ],
  metadataBase: new URL('https://elhoormoving.com'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'الحور لنقل العفش | أفضل شركة نقل عفش وأثاث بالكويت 24 ساعة',
    description: 'شركة الحور لنقل العفش والأثاث بجميع مناطق الكويت. أفضل خدمات فك، تركيب وتغليف الأثاث بأقل الأسعار وبأيدي نجارين فنيين.',
    url: 'https://elhoormoving.com',
    siteName: 'الحور لنقل العفش',
    locale: 'ar_KW',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الحور لنقل العفش | أفضل شركة نقل عفش وأثاث بالكويت 24 ساعة',
    description: 'شركة الحور لنقل العفش والأثاث بجميع مناطق الكويت. أفضل خدمات فك، تركيب وتغليف الأثاث بأقل الأسعار وبأيدي نجارين فنيين.'
  },
  verification: {
    google: 'e-6o7oBNo1x_wDGtppGvKaBwwxzfuWSkoBUgx2znQhY'
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MovingCompany',
  name: 'شركة الحور لنقل العفش والأثاث بالكويت',
  image: 'https://elhoormoving.com/assets/images/home/hero.png',
  '@id': 'https://elhoormoving.com/#organization',
  url: 'https://elhoormoving.com',
  telephone: '+96512345678',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'جميع مناطق الكويت',
    addressLocality: 'الكويت',
    addressRegion: 'الكويت',
    postalCode: '13000',
    addressCountry: 'KW'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 29.3759,
    longitude: 47.9774
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59'
  },
  areaServed: ['الكويت', 'حولي', 'السالمية', 'الفروانية', 'الأحمدي', 'الجهراء', 'مبارك الكبير', 'العاصمة'],
  sameAs: [
    'https://www.facebook.com/elhoormoving',
    'https://www.instagram.com/elhoormoving',
    'https://twitter.com/elhoormoving',
    'https://www.youtube.com/@elhoormoving',
    'https://www.linkedin.com/company/elhoormoving'
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}

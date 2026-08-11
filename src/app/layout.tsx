import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

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
    canonical: 'https://elhoormoving.com',
    languages: {
      'ar-KW': 'https://elhoormoving.com',
      'x-default': 'https://elhoormoving.com'
    }
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
  '@graph': [
    {
      '@type': 'MovingCompany',
      '@id': 'https://elhoormoving.com/#organization',
      name: 'شركة الحور لنقل العفش والأثاث بالكويت',
      url: 'https://elhoormoving.com',
      image: 'https://elhoormoving.com/assets/images/home/hero.png',
      logo: 'https://elhoormoving.com/assets/images/home/elhoor-yellow_white_slogan.png',
      telephone: '+965 96512345678',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'جميع مناطق دولة الكويت',
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
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'الكويت' },
        { '@type': 'AdministrativeArea', name: 'حولي' },
        { '@type': 'AdministrativeArea', name: 'السالمية' },
        { '@type': 'AdministrativeArea', name: 'الفروانية' },
        { '@type': 'AdministrativeArea', name: 'الأحمدي' },
        { '@type': 'AdministrativeArea', name: 'الجهراء' },
        { '@type': 'AdministrativeArea', name: 'مبارك الكبير' },
        { '@type': 'AdministrativeArea', name: 'العاصمة' }
      ],
      sameAs: [
        'https://www.facebook.com/elhoormoving',
        'https://www.instagram.com/elhoormoving',
        'https://twitter.com/elhoormoving',
        'https://www.youtube.com/@elhoormoving',
        'https://www.linkedin.com/company/elhoormoving'
      ]
    },
    {
      '@type': 'WebSite',
      '@id': 'https://elhoormoving.com/#website',
      url: 'https://elhoormoving.com',
      name: 'شركة الحور لنقل العفش',
      publisher: { '@id': 'https://elhoormoving.com/#organization' },
      inLanguage: 'ar-KW'
    }
  ]
};

const GTM_ID = 'GTM-WZDMNT8R';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <link rel="preconnect" href="https://api.elhoormoving.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.elhoormoving.com" />

        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');`
          }}
        />
        {/* End Google Tag Manager */}

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
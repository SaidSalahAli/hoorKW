import type { Metadata } from 'next';

import './globals.css';

// project-imports
import ProviderWrapper from './ProviderWrapper';

export const metadata: Metadata = {
  title: {
    default: 'الحور لنقل العفش | شركة نقل عفش وأثاث بالكويت',
    template: '%s | الحور لنقل العفش'
  },
  description:
    'شركة الحور لنقل العفش والأثاث بجميع مناطق الكويت. أفضل خدمات نقل الأثاث، فك وتثبيت غرف النوم، التعبئة والتغليف بأقل الأسعار وبأيدي نجارين فنيين مدربين.',
  keywords: [
    'نقل عفش',
    'نقل اثاث',
    'شركة نقل عفش الكويت',
    'نقل عفش الكويت',
    'الحور لنقل العفش',
    'فك وتركيب اثاث',
    'نقل عفش هاف لوري',
    'نقل عفش رخيص'
  ],
  metadataBase: new URL('https://elhoormoving.com'),
  openGraph: {
    title: 'الحور لنقل العفش | شركة نقل عفش وأثاث بالكويت',
    description:
      'شركة الحور لنقل العفش والأثاث بجميع مناطق الكويت. أفضل خدمات نقل الأثاث، فك وتثبيت غرف النوم، التعبئة والتغليف بأقل الأسعار.',
    url: 'https://elhoormoving.com',
    siteName: 'الحور لنقل العفش',
    locale: 'ar_KW',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'الحور لنقل العفش | شركة نقل عفش وأثاث بالكويت',
    description:
      'شركة الحور لنقل العفش والأثاث بجميع مناطق الكويت. أفضل خدمات نقل الأثاث، فك وتثبيت غرف النوم، التعبئة والتغليف بأقل الأسعار.'
  },
  verification: {
    google: 'e-6o7oBNo1x_wDGtppGvKaBwwxzfuWSkoBUgx2znQhY'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}

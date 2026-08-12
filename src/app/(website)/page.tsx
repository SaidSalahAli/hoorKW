import type { Metadata } from 'next';
import HomeClient from './HomeClient';

// ==============================|| HOMEPAGE (SERVER) ||============================== //

export const metadata: Metadata = {
  title: 'شركة الحور لنقل وتغليف الأثاث | أفضل شركة نقل عفش بالكويت 24 ساعة',
  description:
    'شركة الحور لنقل العفش والأثاث في جميع مناطق دولة الكويت. خدمات فك وتغليف ونقل هيدروليكي بأفضل الأسعار وأعلى مستويات الأمان.',
  keywords: [
    'شركة الحور لنقل العفش',
    'الحور لنقل الاثاث',
    'نقل عفش الكويت',
    'نقل اثاث حولي',
    'نقل عفش السالمية',
    'فك وتركيب اثاث'
  ],
  alternates: {
    canonical: 'https://elhoormoving.com/',
    languages: {
      'ar-KW': 'https://elhoormoving.com/',
      'x-default': 'https://elhoormoving.com/'
    }
  },
  openGraph: {
    title: 'شركة الحور لنقل وتغليف الأثاث | أفضل شركة نقل عفش بالكويت 24 ساعة',
    description:
      'شركة الحور لنقل العفش والأثاث في جميع مناطق دولة الكويت. خدمات فك وتغليف ونقل هيدروليكي بأفضل الأسعار وأعلى مستويات الأمان.',
    url: 'https://elhoormoving.com/',
    siteName: 'شركة الحور لنقل العفش',
    locale: 'ar_KW',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'شركة الحور لنقل وتغليف الأثاث | أفضل شركة نقل عفش بالكويت 24 ساعة',
    description:
      'شركة الحور لنقل العفش والأثاث في جميع مناطق دولة الكويت. خدمات فك وتغليف ونقل هيدروليكي بأفضل الأسعار وأعلى مستويات الأمان.'
  }
};

export default function HomePage() {
  return <HomeClient />;
}


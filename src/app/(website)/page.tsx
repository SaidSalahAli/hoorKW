import type { Metadata } from 'next';
import HomeClient from './HomeClient';

// ==============================|| HOMEPAGE (SERVER) ||============================== //

export const metadata: Metadata = {
  title: 'الحور لنقل العفش | أفضل شركة نقل عفش وأثاث بالكويت 24 ساعة',
  description: 'شركة الحور لنقل العفش والأثاث بجميع مناطق الكويت. أفضل خدمات فك، تركيب وتغليف الأثاث بأقل الأسعار وبأيدي نجارين فنيين محترفين.',
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
  }
};

export default function HomePage() {
  return <HomeClient />;
}

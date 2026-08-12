import type { Metadata } from 'next';
import RequestServiceClient from './RequestServiceClient';

// ==============================|| REQUEST SERVICE PAGE (SERVER) ||============================== //

export const metadata: Metadata = {
  title: 'طلب تسعيرة نقل عفش مجانية | شركة الحور لنقل الأثاث',
  description: 'احصل على عرض سعر سريع ومجاني لنقل وتغليف العفش والأثاث في أي مكان بالكويت من شركة الحور.',
  alternates: {
    canonical: 'https://elhoormoving.com/request-service',
    languages: {
      'ar-KW': 'https://elhoormoving.com/request-service',
      'x-default': 'https://elhoormoving.com/request-service'
    }
  },
  openGraph: {
    title: 'طلب تسعيرة نقل عفش مجانية | شركة الحور لنقل الأثاث',
    description: 'احصل على عرض سعر سريع ومجاني لنقل وتغليف العفش والأثاث في أي مكان بالكويت من شركة الحور.',
    url: 'https://elhoormoving.com/request-service',
    siteName: 'شركة الحور لنقل العفش',
    locale: 'ar_KW',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'طلب تسعيرة نقل عفش مجانية | شركة الحور لنقل الأثاث',
    description: 'احصل على عرض سعر سريع ومجاني لنقل وتغليف العفش والأثاث في أي مكان بالكويت من شركة الحور.'
  }
};

export default function RequestServicePage() {
  return <RequestServiceClient />;
}


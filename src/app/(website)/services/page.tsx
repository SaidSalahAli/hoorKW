import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

// ==============================|| SERVICES PAGE (SERVER) ||============================== //

export const metadata: Metadata = {
  title: 'خدمات نقل العفش والأثاث في الكويت | شركة الحور',
  description: 'قائمة شاملة بخدمات نقل الأثاث، فك وتركيب غرف النوم، التغليف بالكرتون والبابلز، ونقل الهوري والمكاتب بجميع مناطق الكويت.',
  alternates: {
    canonical: 'https://elhoormoving.com/services',
    languages: {
      'ar-KW': 'https://elhoormoving.com/services',
      'x-default': 'https://elhoormoving.com/services'
    }
  },
  openGraph: {
    title: 'خدمات نقل العفش والأثاث في الكويت | شركة الحور',
    description: 'قائمة شاملة بخدمات نقل الأثاث، فك وتركيب غرف النوم، التغليف بالكرتون والبابلز، ونقل الهوري والمكاتب بجميع مناطق الكويت.',
    url: 'https://elhoormoving.com/services',
    siteName: 'الحور لنقل العفش',
    locale: 'ar_KW',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'خدمات نقل العفش والأثاث في الكويت | شركة الحور',
    description: 'قائمة شاملة بخدمات نقل الأثاث، فك وتركيب غرف النوم، التغليف بالكرتون والبابلز، ونقل الهوري والمكاتب بجميع مناطق الكويت.'
  }
};

export default function ServicesPage() {
  return <ServicesClient />;
}

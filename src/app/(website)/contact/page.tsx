import type { Metadata } from 'next';
import ContactClient from './ContactClient';

// ==============================|| CONTACT US PAGE (SERVER) ||============================== //

export const metadata: Metadata = {
  title: 'اتصل بنا | شركة الحور لنقل العفش والأثاث بالكويت',
  description: 'تواصل معنا مباشرة عبر الهاتف أو الواتساب على مدار 24 ساعة للحصول على أفضل تسعيرة لنقل العفش والأثاث بكافة مناطق الكويت.',
  alternates: {
    canonical: 'https://elhoormoving.com/contact',
    languages: {
      'ar-KW': 'https://elhoormoving.com/contact',
      'x-default': 'https://elhoormoving.com/contact'
    }
  },
  openGraph: {
    title: 'اتصل بنا | شركة الحور لنقل العفش والأثاث بالكويت',
    description: 'تواصل معنا مباشرة عبر الهاتف أو الواتساب على مدار 24 ساعة للحصول على أفضل تسعيرة لنقل العفش والأثاث بكافة مناطق الكويت.',
    url: 'https://elhoormoving.com/contact',
    siteName: 'الحور لنقل العفش',
    locale: 'ar_KW',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'اتصل بنا | شركة الحور لنقل العفش والأثاث بالكويت',
    description: 'تواصل معنا مباشرة عبر الهاتف أو الواتساب على مدار 24 ساعة للحصول على أفضل تسعيرة لنقل العفش والأثاث بكافة مناطق الكويت.'
  }
};

export default function ContactPage() {
  return <ContactClient />;
}

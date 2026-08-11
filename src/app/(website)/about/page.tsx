import type { Metadata } from 'next';
import AboutClient from './AboutClient';

// ==============================|| ABOUT US PAGE (SERVER) ||============================== //

export const metadata: Metadata = {
  title: 'من نحن | شركة الحور لنقل العفش والأثاث بالكويت',
  description: 'تعرف على شركة الحور لنقل العفش بالأرقام والخبرة طويلة الأمد في فك، تركيب وتغليف الأثاث بكافة مناطق دولة الكويت.',
  alternates: {
    canonical: 'https://elhoormoving.com/about',
    languages: {
      'ar-KW': 'https://elhoormoving.com/about',
      'x-default': 'https://elhoormoving.com/about'
    }
  },
  openGraph: {
    title: 'من نحن | شركة الحور لنقل العفش والأثاث بالكويت',
    description: 'تعرف على شركة الحور لنقل العفش بالأرقام والخبرة طويلة الأمد في فك، تركيب وتغليف الأثاث بكافة مناطق دولة الكويت.',
    url: 'https://elhoormoving.com/about',
    siteName: 'الحور لنقل العفش',
    locale: 'ar_KW',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'من نحن | شركة الحور لنقل العفش والأثاث بالكويت',
    description: 'تعرف على شركة الحور لنقل العفش بالأرقام والخبرة طويلة الأمد في فك، تركيب وتغليف الأثاث بكافة مناطق دولة الكويت.'
  }
};

export default function AboutPage() {
  return <AboutClient />;
}

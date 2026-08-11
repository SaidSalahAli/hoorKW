import type { Metadata } from 'next';
import BlogClient from './BlogClient';

// ==============================|| BLOG PAGE (SERVER) ||============================== //

export const metadata: Metadata = {
  title: 'مدونة نقل العفش والأثاث في الكويت | نصائح وإرشادات - شركة الحور',
  description: 'مقالات ونصائح وإرشادات متخصصة حول أفضل طرق نقل وتغليف وتخزين الأثاث في الكويت وكيفية اختيار شركة النقل المناسبة.',
  alternates: {
    canonical: 'https://elhoormoving.com/blog',
    languages: {
      'ar-KW': 'https://elhoormoving.com/blog',
      'x-default': 'https://elhoormoving.com/blog'
    }
  },
  openGraph: {
    title: 'مدونة نقل العفش والأثاث في الكويت | نصائح وإرشادات - شركة الحور',
    description: 'مقالات ونصائح وإرشادات متخصصة حول أفضل طرق نقل وتغليف وتخزين الأثاث في الكويت وكيفية اختيار شركة النقل المناسبة.',
    url: 'https://elhoormoving.com/blog',
    siteName: 'الحور لنقل العفش',
    locale: 'ar_KW',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مدونة نقل العفش والأثاث في الكويت | نصائح وإرشادات - شركة الحور',
    description: 'مقالات ونصائح وإرشادات متخصصة حول أفضل طرق نقل وتغليف وتخزين الأثاث في الكويت وكيفية اختيار شركة النقل المناسبة.'
  }
};

export default function BlogPage() {
  return <BlogClient />;
}

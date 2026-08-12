import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

// ==============================|| GALLERY PAGE (SERVER) ||============================== //

export const metadata: Metadata = {
  title: 'معرض الأعمال والخدمات | شركة الحور لنقل العفش',
  description: 'شاهد صور ومعرض أعمال شركة الحور لنقل وتغليف الأثاث والفك والتركيب على أرض الواقع في الكويت.',
  alternates: {
    canonical: 'https://elhoormoving.com/gallery',
    languages: {
      'ar-KW': 'https://elhoormoving.com/gallery',
      'x-default': 'https://elhoormoving.com/gallery'
    }
  },
  openGraph: {
    title: 'معرض الأعمال والخدمات | شركة الحور لنقل العفش',
    description: 'شاهد صور ومعرض أعمال شركة الحور لنقل وتغليف الأثاث والفك والتركيب على أرض الواقع في الكويت.',
    url: 'https://elhoormoving.com/gallery',
    siteName: 'شركة الحور لنقل العفش',
    locale: 'ar_KW',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'معرض الأعمال والخدمات | شركة الحور لنقل العفش',
    description: 'شاهد صور ومعرض أعمال شركة الحور لنقل وتغليف الأثاث والفك والتركيب على أرض الواقع في الكويت.'
  }
};

export default function GalleryPage() {
  return <GalleryClient />;
}


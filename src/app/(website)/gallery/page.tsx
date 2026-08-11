import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

// ==============================|| GALLERY PAGE (SERVER) ||============================== //

export const metadata: Metadata = {
  title: 'معرض الصور وأعمال شركة الحور لنقل العفش بالكويت',
  description: 'شاهد صوراً حية لعمليات نقل العفش وتغليف الأثاث وفك وتركيب غرف النوم التي قمنا بها لعملائنا في مختلف مناطق الكويت.',
  alternates: {
    canonical: 'https://elhoormoving.com/gallery',
    languages: {
      'ar-KW': 'https://elhoormoving.com/gallery',
      'x-default': 'https://elhoormoving.com/gallery'
    }
  },
  openGraph: {
    title: 'معرض الصور وأعمال شركة الحور لنقل العفش بالكويت',
    description: 'شاهد صوراً حية لعمليات نقل العفش وتغليف الأثاث وفك وتركيب غرف النوم التي قمنا بها لعملائنا في مختلف مناطق الكويت.',
    url: 'https://elhoormoving.com/gallery',
    siteName: 'الحور لنقل العفش',
    locale: 'ar_KW',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'معرض الصور وأعمال شركة الحور لنقل العفش بالكويت',
    description: 'شاهد صوراً حية لعمليات نقل العفش وتغليف الأثاث وفك وتركيب غرف النوم التي قمنا بها لعملائنا في مختلف مناطق الكويت.'
  }
};

export default function GalleryPage() {
  return <GalleryClient />;
}

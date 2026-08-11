import type { Metadata } from 'next';
import RequestServiceClient from './RequestServiceClient';

// ==============================|| REQUEST SERVICE PAGE (SERVER) ||============================== //

export const metadata: Metadata = {
  title: 'طلب تسعيرة نقل عفش أونلاين | شركة الحور بالكويت',
  description: 'احصل على تسعيرة فورية ومجانية لنقل وتغليف عفشك بجميع مناطق الكويت. نصلك أينما كنت بأقل تكلفة وأسرع وقت.',
  alternates: {
    canonical: 'https://elhoormoving.com/request-service',
    languages: {
      'ar-KW': 'https://elhoormoving.com/request-service',
      'x-default': 'https://elhoormoving.com/request-service'
    }
  },
  openGraph: {
    title: 'طلب تسعيرة نقل عفش أونلاين | شركة الحور بالكويت',
    description: 'احصل على تسعيرة فورية ومجانية لنقل وتغليف عفشك بجميع مناطق الكويت. نصلك أينما كنت بأقل تكلفة وأسرع وقت.',
    url: 'https://elhoormoving.com/request-service',
    siteName: 'الحور لنقل العفش',
    locale: 'ar_KW',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'طلب تسعيرة نقل عفش أونلاين | شركة الحور بالكويت',
    description: 'احصل على تسعيرة فورية ومجانية لنقل وتغليف عفشك بجميع مناطق الكويت. نصلك أينما كنت بأقل تكلفة وأسرع وقت.'
  }
};

export default function RequestServicePage() {
  return <RequestServiceClient />;
}

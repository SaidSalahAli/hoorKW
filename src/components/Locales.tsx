import { ReactNode, useEffect, useState } from 'react';

// third-party
import { IntlProvider, MessageFormatElement } from 'react-intl';

// project-imports
import useConfig from 'hooks/useConfig';
import arMessages from 'utils/locales/ar.json';

// types
import { I18n } from 'types/config';

// load locales files
function loadLocaleData(locale: I18n) {
  switch (locale) {
    case 'fr':
      return import('utils/locales/fr.json');
    case 'ro':
      return import('utils/locales/ro.json');
    case 'zh':
      return import('utils/locales/zh.json');
    case 'en':
      return import('utils/locales/en.json');
    case 'ar':
    default:
      return import('utils/locales/ar.json');
  }
}

// ==============================|| LOCALIZATION ||============================== //

interface Props {
  children: ReactNode;
}

export default function Locales({ children }: Props) {
  const { i18n } = useConfig();

  const [messages, setMessages] = useState<Record<string, string> | Record<string, MessageFormatElement[]> | undefined>(
    arMessages as any
  );

  useEffect(() => {
    loadLocaleData(i18n).then((d: { default: Record<string, string> | Record<string, MessageFormatElement[]> | undefined }) => {
      setMessages(d.default);
    });
  }, [i18n]);

  return (
    <IntlProvider locale={i18n || 'ar'} defaultLocale="ar" messages={messages || (arMessages as any)}>
      {children}
    </IntlProvider>
  );
}


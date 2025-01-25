import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import EN from './en.json';
import FR from './fr.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      EN: { translation: EN },
      FR: { translation: FR }
    },
    lng: 'FR',
    fallbackLng: 'FR',
    interpolation: { escapeValue: false }
  });

export default i18n;

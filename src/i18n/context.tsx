import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from './translations';
import { translations } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['fr'];
  formatPrice: (amount: number) => string;
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('velenora_lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('velenora_lang', lang);
  };

  const isRtl = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    if (isRtl) {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }
  }, [language, isRtl]);

  const formatPrice = (amount: number): string => {
    const formatted = new Intl.NumberFormat(language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-DZ' : 'en-DZ').format(amount);
    if (language === 'ar') {
      return `${formatted} د.ج`;
    }
    return `${formatted} DZD`;
  };

  const t = translations[language] || translations.fr;

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, formatPrice, isRtl }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

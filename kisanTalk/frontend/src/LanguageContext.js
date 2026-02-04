import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from './languages';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('kisanTalkLanguage');
    return saved || null; // null means show selection modal
  });

  useEffect(() => {
    if (language) {
      localStorage.setItem('kisanTalkLanguage', language);
    }
  }, [language]);

  const t = (key) => {
    if (!language) return key;
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

/**
 * Open Location Number Platform — Language Context Provider.
 * 
 * Purpose:
 *   Manages Multilingual i18n language state (English, Hindi, Spanish, French, Arabic, Bengali)
 *   with persistence in localStorage and automatic RTL support for Arabic.
 * 
 * Related Files:
 *   - frontend/src/context/translations.js: Full translation dictionaries.
 *   - frontend/src/components/Navbar.jsx: Renders language switcher dropdown.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, TRANSLATIONS } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('oln_language');
    return saved && TRANSLATIONS[saved] ? saved : 'en';
  });

  useEffect(() => {
    const activeLangConfig = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', activeLangConfig.dir);
    localStorage.setItem('oln_language', lang);
  }, [lang]);

  const setLanguage = (code) => {
    if (TRANSLATIONS[code]) {
      setLangState(code);
    }
  };

  // Helper translation lookup function
  const t = (key) => {
    const currentDict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    if (currentDict[key]) return currentDict[key];
    // Fallback to English
    if (TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

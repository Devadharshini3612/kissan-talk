import React from 'react';
import { languages } from '../languages';
import { useLanguage } from '../LanguageContext';
import '../styles/LanguageSelector.css';

const LanguageSelector = () => {
  const { setLanguage } = useLanguage();

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className="language-selector-overlay">
      <div className="language-selector-modal">
        <h1>🌍 Select Your Language</h1>
        <p>Choose your preferred language to continue</p>
        
        <div className="language-grid">
          {Object.entries(languages).map(([code, { name, flag }]) => (
            <button
              key={code}
              className="language-option"
              onClick={() => handleLanguageSelect(code)}
            >
              <span className="flag">{flag}</span>
              <span className="lang-name">{name}</span>
            </button>
          ))}
        </div>
        
        <p className="language-hint">💡 You can change the language anytime from the top menu</p>
      </div>
    </div>
  );
};

export default LanguageSelector;

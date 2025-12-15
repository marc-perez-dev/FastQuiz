import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-1 items-center bg-stone-100 rounded-lg p-1 border border-stone-200">
      <button 
        onClick={() => changeLanguage('es')} 
        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
          i18n.resolvedLanguage === 'es' 
            ? 'bg-white text-stone-900 shadow-sm' 
            : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        ES
      </button>
      <button 
        onClick={() => changeLanguage('en')} 
        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
          i18n.resolvedLanguage === 'en' 
            ? 'bg-white text-stone-900 shadow-sm' 
            : 'text-stone-500 hover:text-stone-900'
        }`}
      >
        EN
      </button>
    </div>
  );
};

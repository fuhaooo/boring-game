"use client";

import React from "react";
import { useLanguage } from "~~/hooks/useLanguage";
import { Language } from "~~/utils/i18n";

interface LanguageSwitchProps {
  className?: string;
}

export const LanguageSwitch: React.FC<LanguageSwitchProps> = ({
  className = "",
}) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage: Language = language === "en" ? "zh" : "en";
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`btn btn-ghost btn-sm text-sm font-medium hover:bg-gradient-nav hover:text-white transition-all duration-200 ${className}`}
      title={`Current: ${language === "en" ? "English" : "中文"}, Click to switch`}
    >
      <span className="flex items-center gap-1">
        {language === "en" ? (
          <>
            🇺🇸 <span className="hidden sm:inline">EN</span>
          </>
        ) : (
          <>
            🇨🇳 <span className="hidden sm:inline">中文</span>
          </>
        )}
      </span>
    </button>
  );
};

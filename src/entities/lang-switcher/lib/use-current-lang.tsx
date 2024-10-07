import { useAuth } from '@/app/providers/auth-provider';
import type { AuthContextType } from '@/app/providers/auth-provider/lib/auth-context';
import { type LanguageDictionary, languagesDic } from '@/shared/constants/global';
import { CourseTranslationsLanguage, UserRoleType } from '@/types/types.generated';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useCurrentLang = (): LanguageDictionary => {
  const { user } = useAuth() as AuthContextType;
  const { i18n } = useTranslation();

  const currentLang = useMemo((): LanguageDictionary => {
    const storedLang = localStorage.getItem('language');
    let currentLangValue: string;

    if (storedLang) {
      currentLangValue = storedLang;
    } else if (location.pathname === '/' || user?.role === UserRoleType.Mentor) {
      currentLangValue = CourseTranslationsLanguage.En;
    } else {
      currentLangValue = CourseTranslationsLanguage.Kr;
    }

    let currentLang = languagesDic.find((lang) => lang.value === currentLangValue);

    if (!currentLang) {
      currentLang =
        languagesDic.find((lang) => lang.value === CourseTranslationsLanguage.En) ||
        languagesDic[0];
    }

    if (!storedLang) {
      i18n.changeLanguage(currentLang.value);
    }

    return currentLang;
  }, [localStorage.getItem('language')]);

  return currentLang;
};

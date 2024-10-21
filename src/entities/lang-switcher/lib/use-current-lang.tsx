import { useAuth } from '@/app/providers/auth-provider';
import type { AuthContextType } from '@/app/providers/auth-provider/lib/auth-context';
import {
  type LanguageDictionary,
  languagesDic,
  setItemToLocalStorage,
} from '@/shared/constants/global';
import { CourseTranslationsLanguage, UserRoleType } from '@/types/types.generated';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

export const useCurrentLang = (): LanguageDictionary => {
  const { user } = useAuth() as AuthContextType;
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();

  const currentLang = useMemo((): LanguageDictionary => {
    const storedLang = localStorage.getItem('language')?.toLowerCase();
    const langParam = searchParams.get('lang')?.toLowerCase() as CourseTranslationsLanguage;

    if (langParam) {
      localStorage.removeItem('language');
      localStorage.removeItem('currency');
    }

    let currentLangValue: string;

    if (
      [
        CourseTranslationsLanguage.Kr,
        CourseTranslationsLanguage.Cn,
        CourseTranslationsLanguage.En,
      ].includes(langParam)
    ) {
      currentLangValue = langParam;
    } else if (storedLang) {
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

    setItemToLocalStorage('language', currentLang.value);

    if (langParam || !storedLang) {
      i18n.changeLanguage(currentLang.value);
    }

    return currentLang;
  }, [localStorage.getItem('language')]);

  return currentLang;
};

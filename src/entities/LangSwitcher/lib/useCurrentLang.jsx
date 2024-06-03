import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/app/providers/AuthProvider';
import { Language, Roles, languagesDic } from 'src/shared/constants/global';

export const useCurrentLang = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();

  const currentLang = useMemo(() => {
    const currentLangValue = localStorage.getItem('language')
      ? localStorage.getItem('language')
      : location.pathname === '/' || user.role === Roles.MENTOR
        ? Language.EN
        : Language.KR;

    const currentLang = languagesDic.find(
      (lang) => lang.value === currentLangValue,
    );

    // i18n.changeLanguage(currentLang.value);
    i18n.on('languageChanged', () => {
      i18n.setDefaultNamespace(currentLang.value);
    });
    localStorage.setItem('language', currentLang.value);

    return currentLang;
  }, [localStorage.getItem('language')]);

  return currentLang;
};

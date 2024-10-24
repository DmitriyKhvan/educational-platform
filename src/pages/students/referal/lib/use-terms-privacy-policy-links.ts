import { CourseTranslationsLanguage } from '@/types/types.generated';
import { useTranslation } from 'react-i18next';

const termsAndCondition = {
  [CourseTranslationsLanguage.En]: 'https://www.naonow.com/terms-and-conditions',
  [CourseTranslationsLanguage.Kr]: 'https://www.naonow.kr/terms-conditions',
  [CourseTranslationsLanguage.Cn]: 'https://www.naonow.com/terms-conditions-zh-tw',
};

const privacyPolicy = {
  [CourseTranslationsLanguage.En]: 'https://www.naonow.com/privacy-policy',
  [CourseTranslationsLanguage.Kr]: 'https://www.naonow.kr/privacy-policy',
  [CourseTranslationsLanguage.Cn]: 'https://www.naonow.com/privacy-policy-zh-tw',
};

export const useTermsPrivacyPolicyLinks = () => {
  const [_, i18n] = useTranslation();

  return {
    termsAndConditionUrl: termsAndCondition[i18n.language as CourseTranslationsLanguage],
    privacyPolicyUrl: privacyPolicy[i18n.language as CourseTranslationsLanguage],
  };
};

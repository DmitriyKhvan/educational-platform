import i18next from 'i18next';

import {
  availabilityCh,
  commonCh,
  dashboardCh,
  feedbackCh,
  lessonsCh,
  modalsCh,
  notificationsCh,
  onboardingCh,
  profileCh,
  purchaseCh,
  referCh,
  sidebarCh,
  studentMentorCh,
  translationsCh,
  trialCh,
} from '@/shared/assets/lang/ch';
import {
  availabilityEn,
  commonEn,
  dashboardEn,
  feedbackEn,
  lessonsEn,
  modalsEn,
  notificationsEn,
  onboardingEn,
  profileEn,
  purchaseEn,
  referEn,
  sidebarEn,
  studentMentorEn,
  translationsEn,
  trialEn,
} from '@/shared/assets/lang/en';
import {
  availabilityKr,
  commonKr,
  dashboardKr,
  feedbackKr,
  lessonsKr,
  modalsKr,
  notificationsKr,
  onboardingKr,
  profileKr,
  purchaseKr,
  referKr,
  sidebarKr,
  studentMentorKr,
  translationsKr,
  trialKr,
} from '@/shared/assets/lang/kr';
import { CourseTranslationsLanguage } from '@/types/types.generated';


type SupportedLanguages = 'en' | 'kr' | 'cn';
const supportedLanguages: SupportedLanguages[] = [CourseTranslationsLanguage.En, CourseTranslationsLanguage.Kr, CourseTranslationsLanguage.Cn];

let lng = localStorage.getItem('language') ?? CourseTranslationsLanguage.En;
if (!supportedLanguages.includes(lng as SupportedLanguages)) {
  lng = CourseTranslationsLanguage.En;
}
i18next.init({
  interpolation: { escapeValue: false },
  lng,
  resources: {
    en: {
      common: commonEn,
      sidebar: sidebarEn,
      lessons: lessonsEn,
      dashboard: dashboardEn,
      modals: modalsEn,
      studentMentor: studentMentorEn,
      availability: availabilityEn,
      refer: referEn,
      profile: profileEn,
      onboarding: onboardingEn,
      translations: translationsEn,
      purchase: purchaseEn,
      trial: trialEn,
      notifications: notificationsEn,
      feedback: feedbackEn,
    },
    kr: {
      common: commonKr,
      sidebar: sidebarKr,
      lessons: lessonsKr,
      dashboard: dashboardKr,
      modals: modalsKr,
      studentMentor: studentMentorKr,
      availability: availabilityKr,
      refer: referKr,
      profile: profileKr,
      onboarding: onboardingKr,
      translations: translationsKr,
      purchase: purchaseKr,
      trial: trialKr,
      notifications: notificationsKr,
      feedback: feedbackKr,
    },
    cn: {
      common: commonCh,
      sidebar: sidebarCh,
      lessons: lessonsCh,
      dashboard: dashboardCh,
      modals: modalsCh,
      studentMentor: studentMentorCh,
      availability: availabilityCh,
      refer: referCh,
      profile: profileCh,
      onboarding: onboardingCh,
      translations: translationsCh,
      purchase: purchaseCh,
      trial: trialCh,
      notifications: notificationsCh,
      feedback: feedbackCh,
    },
  },
});

export default i18next;

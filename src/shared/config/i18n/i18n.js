import i18next from 'i18next';

import {
  availabilityCh,
  commonCh,
  dashboardCh,
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
} from 'src/shared/assets/lang/ch';
import {
  availabilityEn,
  commonEn,
  dashboardEn,
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
} from 'src/shared/assets/lang/en';
import {
  availabilityKr,
  commonKr,
  dashboardKr,
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
} from 'src/shared/assets/lang/kr';

import { Language } from 'src/shared/constants/global';

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng:
    localStorage.getItem('language') === Language.KR
      ? Language.KR
      : localStorage.getItem('language') === Language.CH
        ? Language.CH
        : Language.EN, // language to use
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
    },
  },
});

export default i18next;

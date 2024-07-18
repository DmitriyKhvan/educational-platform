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
  feedbackCh,
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
  feedbackEn,
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
  feedbackKr,
} from 'src/shared/assets/lang/kr';

import { Language } from 'src/shared/constants/global';

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: localStorage.getItem('language')
    ? localStorage.getItem('language')
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

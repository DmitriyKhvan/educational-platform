// import timezones from 'timezones-list';
import { enUS, ko, zhTW } from 'date-fns/locale';
import { getData } from 'country-list';
import { format, utcToZonedTime } from 'date-fns-tz';
import { useTranslation } from 'react-i18next';
import * as flags from 'src/assets/flags';
// import { useMemo } from 'react';

export const genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'nonbinary' },
];

export const useGenderDic = () => {
  const { t } = useTranslation('profile');

  const genders = [
    { label: t('male'), value: 'male' },
    { label: t('female'), value: 'female' },
    { label: 'Non-binary', value: 'nonbinary' },
  ];

  return genders;
};

export const phoneCodes = [
  {
    code: '+1',
    flag: flags.ca,
    iso: 'CA',
    mask: '(###)###-####',
    name: 'Canada',
  },
  {
    code: '+62',
    flag: flags.id,
    iso: 'ID',
    mask: '##-###-##',
    name: 'Indonesia',
  },
  {
    code: '+33',
    flag: flags.fr,
    iso: 'FR',
    mask: '(###)###-###',
    name: 'France',
  },
  {
    code: '+81',
    flag: flags.jp,
    iso: 'JP',
    mask: '(###)###-###',
    name: 'Japan',
  },
  {
    code: '+82',
    flag: flags.kr,
    iso: 'KR',
    mask: '##-####-####',
    name: 'Korea, Republic of South Korea',
  },
  {
    code: '+60',
    flag: flags.my,
    iso: 'MY',
    mask: '#-###-###',
    name: 'Malaysia',
  },
  {
    code: '+52',
    flag: flags.mx,
    iso: 'MX',
    mask: '##-##-####',
    name: 'Mexico',
  },
  {
    code: '+63',
    flag: flags.ph,
    iso: 'PH',
    mask: '(###)###-####',
    name: 'Philippines',
  },
  {
    code: '+66',
    flag: flags.th,
    iso: 'TH',
    mask: '##-###-###',
    name: 'Thailand',
  },
  {
    code: '+1',
    flag: flags.us,
    iso: 'US',
    mask: '(###)###-####',
    name: 'United States',
  },
  {
    code: '+84',
    flag: flags.vn,
    iso: 'VN',
    mask: '##-####-###',
    name: 'Vietnam',
  },
  {
    name: 'Taiwan',
    code: '+886',
    iso: 'TW',
    flag: flags.tw,
    mask: '#-####-####',
  },
];

export const timezoneOptions = [
  {
    label: 'Asia/Seoul',
    value: 'Asia/Seoul',
  },
  {
    label: 'Asia/Taipei',
    value: 'Asia/Taipei',
  },
  {
    label: 'Pacific/Midway',
    value: 'Pacific/Midway',
  },
  {
    label: 'Pacific/Pago_Pago',
    value: 'Pacific/Pago_Pago',
  },
  {
    label: 'Pacific/Honolulu',
    value: 'Pacific/Honolulu',
  },
  {
    label: 'America/Anchorage',
    value: 'America/Anchorage',
  },
  {
    label: 'America/Vancouver',
    value: 'America/Vancouver',
  },
  {
    label: 'America/Los_Angeles',
    value: 'America/Los_Angeles',
  },
  {
    label: 'America/Tijuana',
    value: 'America/Tijuana',
  },
  {
    label: 'America/Edmonton',
    value: 'America/Edmonton',
  },
  {
    label: 'America/Denver',
    value: 'America/Denver',
  },
  {
    label: 'America/Phoenix',
    value: 'America/Phoenix',
  },
  {
    label: 'America/Mazatlan',
    value: 'America/Mazatlan',
  },
  {
    label: 'America/Winnipeg',
    value: 'America/Winnipeg',
  },
  {
    label: 'America/Regina',
    value: 'America/Regina',
  },
  {
    label: 'America/Chicago',
    value: 'America/Chicago',
  },
  {
    label: 'America/Mexico_City',
    value: 'America/Mexico_City',
  },
  {
    label: 'America/Guatemala',
    value: 'America/Guatemala',
  },
  {
    label: 'America/El_Salvador',
    value: 'America/El_Salvador',
  },
  {
    label: 'America/Managua',
    value: 'America/Managua',
  },
  {
    label: 'America/Costa_Rica',
    value: 'America/Costa_Rica',
  },
  {
    label: 'America/Montreal',
    value: 'America/Montreal',
  },
  {
    label: 'America/New_York',
    value: 'America/New_York',
  },
  {
    label: 'America/Indianapolis',
    value: 'America/Indianapolis',
  },
  {
    label: 'America/Panama',
    value: 'America/Panama',
  },
  {
    label: 'America/Bogota',
    value: 'America/Bogota',
  },
  {
    label: 'America/Lima',
    value: 'America/Lima',
  },
  {
    label: 'America/Halifax',
    value: 'America/Halifax',
  },
  {
    label: 'America/Puerto_Rico',
    value: 'America/Puerto_Rico',
  },
  {
    label: 'America/Caracas',
    value: 'America/Caracas',
  },
  {
    label: 'America/Santiago',
    value: 'America/Santiago',
  },
  {
    label: 'America/St_Johns',
    value: 'America/St_Johns',
  },
  {
    label: 'America/Montevideo',
    value: 'America/Montevideo',
  },
  {
    label: 'America/Araguaina',
    value: 'America/Araguaina',
  },
  {
    label: 'America/Argentina/Buenos_Aires',
    value: 'America/Argentina/Buenos_Aires',
  },
  {
    label: 'America/Godthab',
    value: 'America/Godthab',
  },
  {
    label: 'America/Sao_Paulo',
    value: 'America/Sao_Paulo',
  },
  {
    label: 'Atlantic/Azores',
    value: 'Atlantic/Azores',
  },
  {
    label: 'Canada/Atlantic',
    value: 'Canada/Atlantic',
  },
  {
    label: 'Atlantic/Cape_Verde',
    value: 'Atlantic/Cape_Verde',
  },
  {
    label: 'UTC',
    value: 'UTC',
  },
  {
    label: 'Etc/Greenwich',
    value: 'Etc/Greenwich',
  },
  {
    label: 'Europe/Belgrade',
    value: 'Europe/Belgrade',
  },
  {
    label: 'Atlantic/Reykjavik',
    value: 'Atlantic/Reykjavik',
  },
  {
    label: 'Europe/Dublin',
    value: 'Europe/Dublin',
  },
  {
    label: 'Europe/London',
    value: 'Europe/London',
  },
  {
    label: 'Europe/Lisbon',
    value: 'Europe/Lisbon',
  },
  {
    label: 'Africa/Casablanca',
    value: 'Africa/Casablanca',
  },
  {
    label: 'Africa/Nouakchott',
    value: 'Africa/Nouakchott',
  },
  {
    label: 'Europe/Oslo',
    value: 'Europe/Oslo',
  },
  {
    label: 'Europe/Copenhagen',
    value: 'Europe/Copenhagen',
  },
  {
    label: 'Europe/Brussels',
    value: 'Europe/Brussels',
  },
  {
    label: 'Europe/Berlin',
    value: 'Europe/Berlin',
  },
  {
    label: 'Europe/Helsinki',
    value: 'Europe/Helsinki',
  },
  {
    label: 'Europe/Amsterdam',
    value: 'Europe/Amsterdam',
  },
  {
    label: 'Europe/Rome',
    value: 'Europe/Rome',
  },
  {
    label: 'Europe/Stockholm',
    value: 'Europe/Stockholm',
  },
  {
    label: 'Europe/Vienna',
    value: 'Europe/Vienna',
  },
  {
    label: 'Europe/Luxembourg',
    value: 'Europe/Luxembourg',
  },
  {
    label: 'Europe/Paris',
    value: 'Europe/Paris',
  },
  {
    label: 'Europe/Zurich',
    value: 'Europe/Zurich',
  },
  {
    label: 'Europe/Madrid',
    value: 'Europe/Madrid',
  },
  {
    label: 'Africa/Bangui',
    value: 'Africa/Bangui',
  },
  {
    label: 'Africa/Algiers',
    value: 'Africa/Algiers',
  },
  {
    label: 'Africa/Tunis',
    value: 'Africa/Tunis',
  },
  {
    label: 'Africa/Harare',
    value: 'Africa/Harare',
  },
  {
    label: 'Africa/Nairobi',
    value: 'Africa/Nairobi',
  },
  {
    label: 'Europe/Warsaw',
    value: 'Europe/Warsaw',
  },
  {
    label: 'Europe/Prague',
    value: 'Europe/Prague',
  },
  {
    label: 'Europe/Budapest',
    value: 'Europe/Budapest',
  },
  {
    label: 'Europe/Sofia',
    value: 'Europe/Sofia',
  },
  {
    label: 'Europe/Istanbul',
    value: 'Europe/Istanbul',
  },
  {
    label: 'Europe/Athens',
    value: 'Europe/Athens',
  },
  {
    label: 'Europe/Bucharest',
    value: 'Europe/Bucharest',
  },
  {
    label: 'Asia/Nicosia',
    value: 'Asia/Nicosia',
  },
  {
    label: 'Asia/Beirut',
    value: 'Asia/Beirut',
  },
  {
    label: 'Asia/Damascus',
    value: 'Asia/Damascus',
  },
  {
    label: 'Asia/Jerusalem',
    value: 'Asia/Jerusalem',
  },
  {
    label: 'Asia/Amman',
    value: 'Asia/Amman',
  },
  {
    label: 'Africa/Tripoli',
    value: 'Africa/Tripoli',
  },
  {
    label: 'Africa/Cairo',
    value: 'Africa/Cairo',
  },
  {
    label: 'Africa/Johannesburg',
    value: 'Africa/Johannesburg',
  },
  {
    label: 'Europe/Moscow',
    value: 'Europe/Moscow',
  },
  {
    label: 'Asia/Baghdad',
    value: 'Asia/Baghdad',
  },
  {
    label: 'Asia/Kuwait',
    value: 'Asia/Kuwait',
  },
  {
    label: 'Asia/Riyadh',
    value: 'Asia/Riyadh',
  },
  {
    label: 'Asia/Bahrain',
    value: 'Asia/Bahrain',
  },
  {
    label: 'Asia/Qatar',
    value: 'Asia/Qatar',
  },
  {
    label: 'Asia/Aden',
    value: 'Asia/Aden',
  },
  {
    label: 'Asia/Tehran',
    value: 'Asia/Tehran',
  },
  {
    label: 'Africa/Khartoum',
    value: 'Africa/Khartoum',
  },
  {
    label: 'Africa/Djibouti',
    value: 'Africa/Djibouti',
  },
  {
    label: 'Africa/Mogadishu',
    value: 'Africa/Mogadishu',
  },
  {
    label: 'Asia/Dubai',
    value: 'Asia/Dubai',
  },
  {
    label: 'Asia/Muscat',
    value: 'Asia/Muscat',
  },
  {
    label: 'Asia/Baku',
    value: 'Asia/Baku',
  },
  {
    label: 'Asia/Kabul',
    value: 'Asia/Kabul',
  },
  {
    label: 'Asia/Yekaterinburg',
    value: 'Asia/Yekaterinburg',
  },
  {
    label: 'Asia/Tashkent',
    value: 'Asia/Tashkent',
  },
  {
    label: 'Asia/Calcutta',
    value: 'Asia/Calcutta',
  },
  {
    label: 'Asia/Kathmandu',
    value: 'Asia/Kathmandu',
  },
  {
    label: 'Asia/Novosibirsk',
    value: 'Asia/Novosibirsk',
  },
  {
    label: 'Asia/Almaty',
    value: 'Asia/Almaty',
  },
  {
    label: 'Asia/Dacca',
    value: 'Asia/Dacca',
  },
  {
    label: 'Asia/Krasnoyarsk',
    value: 'Asia/Krasnoyarsk',
  },
  {
    label: 'Asia/Dhaka',
    value: 'Asia/Dhaka',
  },
  {
    label: 'Asia/Bangkok',
    value: 'Asia/Bangkok',
  },
  {
    label: 'Asia/Saigon',
    value: 'Asia/Saigon',
  },
  {
    label: 'Asia/Jakarta',
    value: 'Asia/Jakarta',
  },
  {
    label: 'Asia/Irkutsk',
    value: 'Asia/Irkutsk',
  },
  {
    label: 'Asia/Shanghai',
    value: 'Asia/Shanghai',
  },
  {
    label: 'Asia/Hong_Kong',
    value: 'Asia/Hong_Kong',
  },
  {
    label: 'Asia/Kuala_Lumpur',
    value: 'Asia/Kuala_Lumpur',
  },
  {
    label: 'Asia/Singapore',
    value: 'Asia/Singapore',
  },
  {
    label: 'Australia/Perth',
    value: 'Australia/Perth',
  },
  {
    label: 'Asia/Yakutsk',
    value: 'Asia/Yakutsk',
  },
  {
    label: 'Asia/Tokyo',
    value: 'Asia/Tokyo',
  },
  {
    label: 'Australia/Darwin',
    value: 'Australia/Darwin',
  },
  {
    label: 'Australia/Adelaide',
    value: 'Australia/Adelaide',
  },
  {
    label: 'Asia/Vladivostok',
    value: 'Asia/Vladivostok',
  },
  {
    label: 'Pacific/Port_Moresby',
    value: 'Pacific/Port_Moresby',
  },
  {
    label: 'Australia/Brisbane',
    value: 'Australia/Brisbane',
  },
  {
    label: 'Australia/Sydney',
    value: 'Australia/Sydney',
  },
  {
    label: 'Australia/Hobart',
    value: 'Australia/Hobart',
  },
  {
    label: 'Asia/Magadan',
    value: 'Asia/Magadan',
  },
  {
    label: 'Pacific/Noumea',
    value: 'Pacific/Noumea',
  },
  {
    label: 'Asia/Kamchatka',
    value: 'Asia/Kamchatka',
  },
  {
    label: 'Pacific/Fiji',
    value: 'Pacific/Fiji',
  },
  {
    label: 'Pacific/Auckland',
    value: 'Pacific/Auckland',
  },
  {
    label: 'Asia/Kolkata',
    value: 'Asia/Kolkata',
  },
  {
    label: 'America/Tegucigalpa',
    value: 'America/Tegucigalpa',
  },
  {
    label: 'Pacific/Apia',
    value: 'Pacific/Apia',
  },
];

export const timezoneWithTimeOptions = timezoneOptions.map((timezone) => {
  const time = format(utcToZonedTime(new Date(), timezone.value), 'HH:mm a', {
    timeZone: timezone.value,
  });

  return {
    ...timezone,
    label: `${timezone.value} (${time})`,
  };
});

export const countries = getData().map((country) => {
  return {
    label: country.name,
    value: country.name,
  };
});

export const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export const DAY = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const cancel_lesson_reasons_student = [
  { label: 'cancel_reason_1', value: 1 },
  { label: 'cancel_reason_2', value: 2 },
  { label: 'cancel_reason_3', value: 3 },
  { label: 'cancel_reason_4', value: 4 },
  { label: 'cancel_reason_5', value: 5 },
  { label: 'cancel_reason_6', value: 6 },
  { label: 'cancel_reason_7', value: 7 },
  { label: 'cancel_reason_8', value: 8 },
  { label: 'cancel_reason_9', value: 9 },
];

export const cancel_lesson_reasons_tutor = [
  { label: 'cancel_reason_2', value: 1 },
  { label: 'cancel_reason_3', value: 2 },
  { label: 'cancel_reason_4', value: 3 },
  { label: 'cancel_reason_10', value: 4 },
  { label: 'cancel_reason_9', value: 5 },
];

export const getAvatarName = (firstname, lastname) => {
  return `${(firstname || '').charAt(0).toUpperCase()}${(lastname || '')
    .charAt(0)
    .toUpperCase()}`;
};

export const getAbbrName = (firstname, lastname) => {
  return `${firstname} ${(lastname || '').charAt(0).toUpperCase()}.`;
};

export const filterLessonsByStatus = (status, appointments) => {
  const today = new Date();
  return appointments
    .filter((apt) => {
      const date = new Date(apt.start_at);
      if (status === 'upcoming')
        return (
          apt.students[0]?.GroupStudent?.approved &&
          !apt.completed &&
          date >= today
        );
      if (status === 'past') return date < today;
    })
    .map((apt) => {
      let lessonDate = new Date(apt.start_at);
      return {
        id: apt.id,
        studentId: apt.students[0].id,
        first_name: apt.students[0].user.first_name,
        last_name: apt.students[0].user.last_name,
        lessonDate: lessonDate.toLocaleString(),
        lessonType: apt.lesson.type,
        level: apt.students[0].level,
        img: apt.students[0].user.avatar,
        students: apt.students,
        student: apt.students[0],
        completed: apt.completed,
        tutor: apt.tutor
          ? getAbbrName(apt.tutor.user?.first_name, apt.tutor.user?.last_name)
          : getAbbrName(apt.first_name, apt.last_name),
        lesson_topic: apt.lesson_topic,
        last_part_lesson: apt.last_part_lesson,
        group_student: apt.GroupStudent,
        feedbacks: apt.students[0]?.feedbacks || [],
      };
    });
};

export const getItemToLocalStorage = (key, devaultValue) =>
  localStorage.getItem(key) || devaultValue;
export const setItemToLocalStorage = (key, value) =>
  localStorage.setItem(key, value);

export const getTimezoneValue = (timezone) => {
  let offsetstring = timezone.replace(/utc/i, '').split(':');

  try {
    let result = offsetstring[0] * 60 + (offsetstring[1] || 0);
    return result;
  } catch (e) {
    console.error('Converting Error:', e);
    return 0;
  }
};

export const feedbackURL = process.env.REACT_APP_FEEDBACK_URL;
export const gameLinkURL = process.env.REACT_APP_GAME_URL;
export const classMaterialURL = process.env.REACT_APP_CLASS_MATERIAL_URL;

export const NOTIFICATION_LIMIT = 5;
export const WEEKS_IN_MONTH = 4;
export const MAX_MODIFY_COUNT = 3;

export const cancellationArr = [
  'reason_1',
  'reason_2',
  'reason_3',
  'reason_4',
  'reason_5',
  'reason_6',
  'reason_7',
];

export const Roles = {
  MENTOR: 'mentor',
  STUDENT: 'student',
};

export const LessonsStatusType = {
  SCHEDULED: 'scheduled',
  RESCHEDULED: 'rescheduled',
  APPROVED: 'approved',
  IN_PROGRESS: 'in_progress',
  CANCELED: 'canceled',
  COMPLETED: 'completed',
  PAID: 'paid',
};

export const LangLevelType = {
  PRE_LEVEL: 'Pre-level 1',
  LEVEL_1: 'Level 1',
  LEVEL_2: 'Level 2',
  LEVEL_3: 'Level 3',
  LEVEL_4: 'Level 4',
  LEVEL_5: 'Level 5',
};

export const ModalType = {
  CANCEL: 'cancel',
  RESCHEDULE: 'reschedule',
};

export const YOUTUBE_EMBED = 'https://www.youtube.com/embed';
export const VIMEO_EMBED = 'https://player.vimeo.com/video';
export const Host = {
  YOUTUBE: 'www.youtube.com',
  VIMEO: 'vimeo.com',
};

export const DiscountType = {
  FIXED: 'fixed',
  PERCENT: 'percent',
};

export const Language = {
  EN: 'en',
  KR: 'kr',
  CH: 'cn',
};

export const localeDic = {
  [Language.EN]: enUS,
  [Language.KR]: ko,
  [Language.CH]: zhTW,
};

export const CalendarView = {
  DAY_VIEW: 'timeGridDay',
  WEEK_VIEW: 'timeGridWeek',
  MONTH_VIEW: 'dayGridMonth',
};

export const MentorAvailabilityType = {
  ONLY_REGULAR: 'only_regular',
  ONLY_TRIAL: 'only_trial',
  REGULAR_AND_TRIAL: 'regular_and_trial',
};

export const COURSE_COLORS = {
  PURPLE: 'purple',
  ORANGE: 'orange',
  BLUE: 'blue',
  PINK: 'pink',
  BROWN: 'brown',
  YELLOW: 'yellow',
  TEAL: 'teal',
  RED: 'red',
  GRAY: 'gray',
  GREEN: 'green',
};

export const courseColorsDict = {
  [COURSE_COLORS.PURPLE]: {
    event: 'text-color-purple bg-color-purple border-l-color-purple',
    indicator: 'bg-color-purple',
  },
  [COURSE_COLORS.ORANGE]: {
    event: 'text-[#FF9335] bg-[#FF9335] border-l-[#FF9335]',
    indicator: 'bg-[#FF9335]',
  },
  [COURSE_COLORS.BLUE]: {
    event: 'text-[#19BBFE] bg-[#19BBFE] border-l-[#19BBFE]',
    indicator: 'bg-[#19BBFE]',
  },
  [COURSE_COLORS.PINK]: {
    event: 'text-pink-500 bg-pink-500 border-l-pink-500',
    indicator: 'bg-pink-500',
  },
  [COURSE_COLORS.RED]: {
    event: 'text-red-600 bg-red-600 border-l-red-600',
    indicator: 'bg-red-600',
  },
  [COURSE_COLORS.BROWN]: {
    event: 'text-yellow-900 bg-yellow-900 border-l-yellow-900',
    indicator: 'bg-yellow-900',
  },
  [COURSE_COLORS.YELLOW]: {
    event: 'text-yellow-300 bg-yellow-300 border-l-yellow-300',
    indicator: 'bg-yellow-300',
  },
  [COURSE_COLORS.TEAL]: {
    event: 'text-teal-600 bg-teal-600 border-l-teal-600',
    indicator: 'bg-teal-600',
  },
  [COURSE_COLORS.GRAY]: {
    event: 'text-gray-300 bg-gray-300 border-l-gray-300',
    indicator: 'bg-gray-300',
  },
  [COURSE_COLORS.GREEN]: {
    event: 'text-[#00D986] bg-[#00D986] border-l-[#00D986]',
    indicator: 'bg-[#00D986]',
  },
};

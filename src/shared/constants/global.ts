import * as flags from '@/shared/assets/images/flags';
import { CourseTranslationsLanguage, Currency, type LessonStatusType, type MentorReview } from '@/types/types.generated';
import { getData } from 'country-list';
import { format, toZonedTime } from 'date-fns-tz';
import { enUS, ko, zhTW } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface Gender {
  label: string;
  value: 'male' | 'female' | 'nonbinary';
}

export const genders: Gender[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'nonbinary' },
];

export const useGenderDic = (): Gender[] => {
  const { t } = useTranslation('profile');

  const genders: Gender[] = [
    { label: t('male'), value: 'male' },
    { label: t('female'), value: 'female' },
    { label: 'Non-binary', value: 'nonbinary' },
  ];

  return genders;
};

export interface PhoneCode {
  code: string;
  flag: string;
  iso: string;
  mask: string;
  name: string;
}

export const phoneCodes: PhoneCode[] = [
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

interface TimezoneOption {
  label: string;
  value: string;
}

export const timezoneOptions: TimezoneOption[] = [
  { label: 'Asia/Seoul', value: 'Asia/Seoul' },
  { label: 'Asia/Taipei', value: 'Asia/Taipei' },
  { label: 'Pacific/Midway', value: 'Pacific/Midway' },
  { label: 'Pacific/Pago_Pago', value: 'Pacific/Pago_Pago' },
  { label: 'Pacific/Honolulu', value: 'Pacific/Honolulu' },
  { label: 'America/Anchorage', value: 'America/Anchorage' },
  { label: 'America/Vancouver', value: 'America/Vancouver' },
  { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
  { label: 'America/Tijuana', value: 'America/Tijuana' },
  { label: 'America/Edmonton', value: 'America/Edmonton' },
  { label: 'America/Denver', value: 'America/Denver' },
  { label: 'America/Phoenix', value: 'America/Phoenix' },
  { label: 'America/Mazatlan', value: 'America/Mazatlan' },
  { label: 'America/Winnipeg', value: 'America/Winnipeg' },
  { label: 'America/Regina', value: 'America/Regina' },
  { label: 'America/Chicago', value: 'America/Chicago' },
  { label: 'America/Mexico_City', value: 'America/Mexico_City' },
  { label: 'America/Guatemala', value: 'America/Guatemala' },
  { label: 'America/El_Salvador', value: 'America/El_Salvador' },
  { label: 'America/Managua', value: 'America/Managua' },
  { label: 'America/Costa_Rica', value: 'America/Costa_Rica' },
  { label: 'America/Montreal', value: 'America/Montreal' },
  { label: 'America/New_York', value: 'America/New_York' },
  { label: 'America/Indianapolis', value: 'America/Indianapolis' },
  { label: 'America/Panama', value: 'America/Panama' },
  { label: 'America/Bogota', value: 'America/Bogota' },
  { label: 'America/Lima', value: 'America/Lima' },
  { label: 'America/Halifax', value: 'America/Halifax' },
  { label: 'America/Puerto_Rico', value: 'America/Puerto_Rico' },
  { label: 'America/Caracas', value: 'America/Caracas' },
  { label: 'America/Santiago', value: 'America/Santiago' },
  { label: 'America/St_Johns', value: 'America/St_Johns' },
  { label: 'America/Montevideo', value: 'America/Montevideo' },
  { label: 'America/Araguaina', value: 'America/Araguaina' },
  {
    label: 'America/Argentina/Buenos_Aires',
    value: 'America/Argentina/Buenos_Aires',
  },
  { label: 'America/Godthab', value: 'America/Godthab' },
  { label: 'America/Sao_Paulo', value: 'America/Sao_Paulo' },
  { label: 'Atlantic/Azores', value: 'Atlantic/Azores' },
  { label: 'Canada/Atlantic', value: 'Canada/Atlantic' },
  { label: 'Atlantic/Cape_Verde', value: 'Atlantic/Cape_Verde' },
  { label: 'UTC', value: 'UTC' },
  { label: 'Etc/Greenwich', value: 'Etc/Greenwich' },
  { label: 'Europe/Belgrade', value: 'Europe/Belgrade' },
  { label: 'Atlantic/Reykjavik', value: 'Atlantic/Reykjavik' },
  { label: 'Europe/Dublin', value: 'Europe/Dublin' },
  { label: 'Europe/London', value: 'Europe/London' },
  { label: 'Europe/Lisbon', value: 'Europe/Lisbon' },
  { label: 'Africa/Casablanca', value: 'Africa/Casablanca' },
  { label: 'Africa/Nouakchott', value: 'Africa/Nouakchott' },
  { label: 'Europe/Oslo', value: 'Europe/Oslo' },
  { label: 'Europe/Copenhagen', value: 'Europe/Copenhagen' },
  { label: 'Europe/Brussels', value: 'Europe/Brussels' },
  { label: 'Europe/Berlin', value: 'Europe/Berlin' },
  { label: 'Europe/Helsinki', value: 'Europe/Helsinki' },
  { label: 'Europe/Amsterdam', value: 'Europe/Amsterdam' },
  { label: 'Europe/Rome', value: 'Europe/Rome' },
  { label: 'Europe/Stockholm', value: 'Europe/Stockholm' },
  { label: 'Europe/Vienna', value: 'Europe/Vienna' },
  { label: 'Europe/Luxembourg', value: 'Europe/Luxembourg' },
  { label: 'Europe/Paris', value: 'Europe/Paris' },
  { label: 'Europe/Zurich', value: 'Europe/Zurich' },
  { label: 'Europe/Madrid', value: 'Europe/Madrid' },
  { label: 'Africa/Bangui', value: 'Africa/Bangui' },
  { label: 'Africa/Algiers', value: 'Africa/Algiers' },
  { label: 'Africa/Tunis', value: 'Africa/Tunis' },
  { label: 'Africa/Harare', value: 'Africa/Harare' },
  { label: 'Africa/Nairobi', value: 'Africa/Nairobi' },
  { label: 'Europe/Warsaw', value: 'Europe/Warsaw' },
  { label: 'Europe/Prague', value: 'Europe/Prague' },
  { label: 'Europe/Budapest', value: 'Europe/Budapest' },
  { label: 'Europe/Sofia', value: 'Europe/Sofia' },
  { label: 'Europe/Istanbul', value: 'Europe/Istanbul' },
  { label: 'Europe/Athens', value: 'Europe/Athens' },
  { label: 'Europe/Bucharest', value: 'Europe/Bucharest' },
  { label: 'Asia/Nicosia', value: 'Asia/Nicosia' },
  { label: 'Asia/Beirut', value: 'Asia/Beirut' },
  { label: 'Asia/Damascus', value: 'Asia/Damascus' },
  { label: 'Asia/Jerusalem', value: 'Asia/Jerusalem' },
  { label: 'Asia/Amman', value: 'Asia/Amman' },
  { label: 'Africa/Tripoli', value: 'Africa/Tripoli' },
  { label: 'Africa/Cairo', value: 'Africa/Cairo' },
  { label: 'Africa/Johannesburg', value: 'Africa/Johannesburg' },
  { label: 'Europe/Moscow', value: 'Europe/Moscow' },
  { label: 'Asia/Baghdad', value: 'Asia/Baghdad' },
  { label: 'Asia/Kuwait', value: 'Asia/Kuwait' },
  { label: 'Asia/Riyadh', value: 'Asia/Riyadh' },
  { label: 'Asia/Bahrain', value: 'Asia/Bahrain' },
  { label: 'Asia/Qatar', value: 'Asia/Qatar' },
  { label: 'Asia/Aden', value: 'Asia/Aden' },
  { label: 'Asia/Tehran', value: 'Asia/Tehran' },
  { label: 'Africa/Khartoum', value: 'Africa/Khartoum' },
  { label: 'Africa/Djibouti', value: 'Africa/Djibouti' },
  { label: 'Africa/Mogadishu', value: 'Africa/Mogadishu' },
  { label: 'Asia/Dubai', value: 'Asia/Dubai' },
  { label: 'Asia/Muscat', value: 'Asia/Muscat' },
  { label: 'Asia/Baku', value: 'Asia/Baku' },
  { label: 'Asia/Kabul', value: 'Asia/Kabul' },
  { label: 'Asia/Yekaterinburg', value: 'Asia/Yekaterinburg' },
  { label: 'Asia/Tashkent', value: 'Asia/Tashkent' },
  { label: 'Asia/Calcutta', value: 'Asia/Calcutta' },
  { label: 'Asia/Kathmandu', value: 'Asia/Kathmandu' },
  { label: 'Asia/Novosibirsk', value: 'Asia/Novosibirsk' },
  { label: 'Asia/Almaty', value: 'Asia/Almaty' },
  { label: 'Asia/Dacca', value: 'Asia/Dacca' },
  { label: 'Asia/Krasnoyarsk', value: 'Asia/Krasnoyarsk' },
  { label: 'Asia/Dhaka', value: 'Asia/Dhaka' },
  { label: 'Asia/Bangkok', value: 'Asia/Bangkok' },
  { label: 'Asia/Saigon', value: 'Asia/Saigon' },
  { label: 'Asia/Jakarta', value: 'Asia/Jakarta' },
  { label: 'Asia/Irkutsk', value: 'Asia/Irkutsk' },
  { label: 'Asia/Shanghai', value: 'Asia/Shanghai' },
  { label: 'Asia/Hong_Kong', value: 'Asia/Hong_Kong' },
  { label: 'Asia/Kuala_Lumpur', value: 'Asia/Kuala_Lumpur' },
  { label: 'Asia/Singapore', value: 'Asia/Singapore' },
  { label: 'Australia/Perth', value: 'Australia/Perth' },
  { label: 'Asia/Yakutsk', value: 'Asia/Yakutsk' },
  { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
  { label: 'Australia/Darwin', value: 'Australia/Darwin' },
  { label: 'Australia/Adelaide', value: 'Australia/Adelaide' },
  { label: 'Asia/Vladivostok', value: 'Asia/Vladivostok' },
  { label: 'Pacific/Port_Moresby', value: 'Pacific/Port_Moresby' },
  { label: 'Australia/Brisbane', value: 'Australia/Brisbane' },
  { label: 'Australia/Sydney', value: 'Australia/Sydney' },
  { label: 'Australia/Hobart', value: 'Australia/Hobart' },
  { label: 'Asia/Magadan', value: 'Asia/Magadan' },
  { label: 'Pacific/Noumea', value: 'Pacific/Noumea' },
  { label: 'Asia/Kamchatka', value: 'Asia/Kamchatka' },
  { label: 'Pacific/Fiji', value: 'Pacific/Fiji' },
  { label: 'Pacific/Auckland', value: 'Pacific/Auckland' },
  { label: 'Asia/Kolkata', value: 'Asia/Kolkata' },
  { label: 'America/Tegucigalpa', value: 'America/Tegucigalpa' },
  { label: 'Pacific/Apia', value: 'Pacific/Apia' },
];

export const timezoneWithTimeOptions: TimezoneOption[] = timezoneOptions.map((timezone) => {
  const time = format(toZonedTime(new Date(), timezone.value), 'HH:mm a', {
    timeZone: timezone.value,
  });

  return {
    ...timezone,
    label: `${timezone.value} (${time})`,
  };
});

interface Country {
  label: string;
  value: string;
}

export const countries: Country[] = getData().map((country) => {
  return {
    label: country.name,
    value: country.name,
  };
});

export const DAY: string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const getItemToLocalStorage = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);

  if (!item) {
    return defaultValue;
  }

  try {
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error parsing JSON from localStorage for key "${key}":`, error);
    return defaultValue;
  }
};

export const setItemToLocalStorage = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const feedbackURL = process.env.REACT_APP_FEEDBACK_URL || '';
export const gameLinkURL = process.env.REACT_APP_GAME_URL || '';
export const classMaterialURL = process.env.REACT_APP_CLASS_MATERIAL_URL || '';

export const NOTIFICATION_LIMIT = 5;
export const WEEKS_IN_MONTH = 4;
export const MAX_MODIFY_COUNT = 3;
export const HOURS_IN_WEEK = 168;

export const cancellationArr: string[] = [
  'reason_1',
  'reason_2',
  'reason_3',
  'reason_4',
  'reason_5',
  'reason_6',
  'reason_7',
];


// UserRoleType
// export const Roles = {
//   MENTOR: 'mentor',
//   STUDENT: 'student',
// } as const;


// export const LessonsStatusType = {
//   SCHEDULED: 'scheduled',
//   RESCHEDULED: 'rescheduled',
//   APPROVED: 'approved',
//   IN_PROGRESS: 'in_progress',
//   CANCELED: 'canceled',
//   COMPLETED: 'completed',
//   PAID: 'paid',
// } as const;

export type LessonsStatusType = (typeof LessonStatusType)[keyof typeof LessonStatusType];

export const LangLevelType = {
  PRE_LEVEL: 'Pre-level 1',
  LEVEL_1: 'Level 1',
  LEVEL_2: 'Level 2',
  LEVEL_3: 'Level 3',
  LEVEL_4: 'Level 4',
  LEVEL_5: 'Level 5',
} as const;

export type LangLevelType = (typeof LangLevelType)[keyof typeof LangLevelType];

export const ModalType = {
  CANCEL: 'cancel',
  RESCHEDULE: 'reschedule',
} as const;

export type ModalType = (typeof ModalType)[keyof typeof ModalType];

export const YOUTUBE_EMBED = 'https://www.youtube.com/embed';
export const VIMEO_EMBED = 'https://player.vimeo.com/video';

export const Host = {
  YOUTUBE: 'www.youtube.com',
  VIMEO: 'vimeo.com',
} as const;

export const DiscountType = {
  FIXED: 'fixed',
  PERCENT: 'percent',
} as const;

export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];

//CourseTranslationsLanguage
// export const Language = {
//   EN: 'en',
//   KR: 'kr',
//   CH: 'cn',
// } as const;

export type LanguageType = (typeof CourseTranslationsLanguage)[keyof typeof CourseTranslationsLanguage];


//Currency
export const Currencies = {
  USD: 'USD',
  KRW: 'KRW',
  TWD: 'TWD',
} as const;

type CurrencyType = (typeof Currencies)[keyof typeof Currencies];

export interface LanguageDictionary {
  label: string;
  value: LanguageType;
}

export const languagesDic: LanguageDictionary[] = [
  {
    label: 'english',
    value: CourseTranslationsLanguage.En,
  },
  {
    label: 'korean',
    value: CourseTranslationsLanguage.Kr,
  },
  {
    label: 'chinese',
    value: CourseTranslationsLanguage.Cn,
  },
];

export interface CurrencyDictionary {
  label: string;
  value: CurrencyType;
  locales: string;
  active: boolean;
}

export const currenciesDic: CurrencyDictionary[] = [
  {
    label: `${Currency.Usd} ($)`,
    value: Currencies.USD,
    locales: 'en-US',
    active: true,
  },
  {
    label: `${Currency.Krw} (₩)`,
    value: Currencies.KRW,
    locales: 'ko-KR',
    active: true,
  },
  {
    label: `${Currency.Twd} ($)`,
    value: Currencies.TWD,
    locales: 'zh-TW',
    active: true,
  },
];

export const localeDic = {
  [CourseTranslationsLanguage.En]: enUS,
  [CourseTranslationsLanguage.Kr]: ko,
  [CourseTranslationsLanguage.Cn]: zhTW,
} as const;

export type CalendarViewType = 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth';

export const CalendarView = {
  DAY_VIEW: 'timeGridDay',
  WEEK_VIEW: 'timeGridWeek',
  MONTH_VIEW: 'dayGridMonth',
} as const;

// export type MentorAvailabilityType = 'only_regular' | 'only_trial';

// export const MentorAvailabilityType = {
//   ONLY_REGULAR: 'only_regular',
//   ONLY_TRIAL: 'only_trial',
//   REGULAR_AND_TRIAL: 'regular_and_trial',
// } as const;
export type CourseColorType =
  | 'purple'
  | 'orange'
  | 'blue'
  | 'pink'
  | 'brown'
  | 'yellow'
  | 'teal'
  | 'red'
  | 'gray'
  | 'green';

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
} as const;

export const courseColorsDict: Record<CourseColorType, { event: string; indicator: string }> = {
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

type OverviewField = {
  value: OverviewGradeType;
  label: OverviewGradeType;
};

export type MentorOverviewFieldValue = keyof Omit<
  MentorReview,
  '__typename' | 'id' | 'lesson' | 'mentor' | 'student' | 'vocabularies' | 'homeworks'
>;

export const overviewFieldsDic: {
  value: MentorOverviewFieldValue;
  label: string;
}[] = [
  { value: 'fluency', label: 'fluency' },
  { value: 'pronunciation', label: 'pronunciation' },
  { value: 'vocabulary', label: 'vocabulary' },
  { value: 'reading', label: 'reading' },
  { value: 'expressions', label: 'expressions' },
  { value: 'confidence', label: 'confidence' },
  { value: 'listening', label: 'listening' },
];

export const OverviewGrade = {
  INSUFFICIENT: 'insufficient',
  BASIC: 'basic',
  FAIR: 'fair',
  GOOD: 'good',
  GREAT: 'great',
  EXCELLENT: 'excellent',
} as const;

type OverviewGradeType = (typeof OverviewGrade)[keyof typeof OverviewGrade];

export const overviewGradeDic: OverviewField[] = [
  { label: OverviewGrade.INSUFFICIENT, value: OverviewGrade.INSUFFICIENT },
  { label: OverviewGrade.BASIC, value: OverviewGrade.BASIC },
  { label: OverviewGrade.FAIR, value: OverviewGrade.FAIR },
  { label: OverviewGrade.GOOD, value: OverviewGrade.GOOD },
  { label: OverviewGrade.GREAT, value: OverviewGrade.GREAT },
  { label: OverviewGrade.EXCELLENT, value: OverviewGrade.EXCELLENT },
];

// import timezones from 'timezones-list';
import { getData } from 'country-list';
import { useTranslation } from 'react-i18next';
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

export const pronouns = [
  { label: 'He/Him/His', value: 'male' },
  { label: 'She/Her/Hers', value: 'female' },
  { label: 'They/Them/Theirs', value: 'transgender' },
  { label: 'She and/or He', value: 'nonbinary' },
  { label: 'Other', value: 'other' },
];

// export const timezoneOptions = timezones.map(({ label, tzCode }) => {
//   return {
//     label,
//     value: tzCode,
//   };
// });

export const timezoneOptions = [
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
    label: 'Asia/Taipei',
    value: 'Asia/Taipei',
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
    label: 'Asia/Seoul',
    value: 'Asia/Seoul',
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

export const LANGUAGES = [
  { label: 'english', value: 'english' },
  { label: 'spanish', value: 'spanish' },
];

export const languageLevels = [
  { label: 'beginner', value: 'beginner' },
  { label: 'intermediate', value: 'intermediate' },
  { label: 'fluent', value: 'fluent' },
];

// export const countries = [
//   { label: 'united_states', value: 'usa' },
//   { label: 'korea', value: 'korea' },
//   { label: 'Afghanistan', value: 'Afghanistan' },
//   { label: 'Ã…land Islands', value: 'Ã…land Islands' },
//   { label: 'Albania', value: 'Albania' },
//   { label: 'Algeria', value: 'Algeria' },
//   { label: 'American Samoa', value: 'American Samoa' },
//   { label: 'Andorra', value: 'Andorra' },
//   { label: 'Angola', value: 'Angola' },
//   { label: 'Anguilla', value: 'Anguilla' },
//   { label: 'Antarctica', value: 'Antarctica' },
//   { label: 'Antigua and Barbuda', value: 'Antigua and Barbuda' },
//   { label: 'Argentina', value: 'Argentina' },
//   { label: 'Armenia', value: 'Armenia' },
//   { label: 'Aruba', value: 'Aruba' },
//   { label: 'Australia', value: 'Australia' },
//   { label: 'Austria', value: 'Austria' },
//   { label: 'Azerbaijan', value: 'Azerbaijan' },
//   { label: 'Bahamas', value: 'Bahamas' },
//   { label: 'Bahrain', value: 'Bahrain' },
//   { label: 'Bangladesh', value: 'Bangladesh' },
//   { label: 'Barbados', value: 'Barbados' },
//   { label: 'Belarus', value: 'Belarus' },
//   { label: 'Belgium', value: 'Belgium' },
//   { label: 'Belize', value: 'Belize' },
//   { label: 'Benin', value: 'Benin' },
//   { label: 'Bermuda', value: 'Bermuda' },
//   { label: 'Bhutan', value: 'Bhutan' },
//   { label: 'Bolivia', value: 'Bolivia' },
//   { label: 'Bonaire', value: 'Bonaire' },
//   { label: 'Bosnia and Herzegovina', value: 'Bosnia and Herzegovina' },
//   { label: 'Botswana', value: 'Botswana' },
//   { label: 'Bouvet Island', value: 'Bouvet Island' },
//   { label: 'Brazil', value: 'Brazil' },
//   {
//     label: 'British Indian Ocean Territory',
//     value: 'British Indian Ocean Territory',
//   },
//   { label: 'Brunei Darussalam', value: 'Brunei Darussalam' },
//   { label: 'Bulgaria', value: 'Bulgaria' },
//   { label: 'Burkina Faso', value: 'Burkina Faso' },
//   { label: 'Burundi', value: 'Burundi' },
//   { label: 'Cambodia', value: 'Cambodia' },
//   { label: 'Cameroon', value: 'Cameroon' },
//   { label: 'Canada', value: 'Canada' },
//   { label: 'Cape Verde', value: 'Cape Verde' },
//   { label: 'Cayman Islands', value: 'Cayman Islands' },
//   { label: 'Central African Republic', value: 'Central African Republic' },
//   { label: 'Chad', value: 'Chad' },
//   { label: 'Chile', value: 'Chile' },
//   { label: 'China', value: 'China' },
//   { label: 'Christmas Island', value: 'Christmas Island' },
//   { label: 'Cocos (Keeling) Islands', value: 'Cocos (Keeling) Islands' },
//   { label: 'Colombia', value: 'Colombia' },
//   { label: 'Comoros', value: 'Comoros' },
//   { label: 'Congo', value: 'Congo' },
//   { label: 'Congo', value: 'Congo' },
//   { label: 'Cook Islands', value: 'Cook Islands' },
//   { label: 'Costa Rica', value: 'Costa Rica' },
//   { label: "CÃ´te d'Ivoire", value: "CÃ´te d'Ivoire" },
//   { label: 'Croatia', value: 'Croatia' },
//   { label: 'Cuba', value: 'Cuba' },
//   { label: 'CuraÃ§ao', value: 'CuraÃ§ao' },
//   { label: 'Cyprus', value: 'Cyprus' },
//   { label: 'Czech Republic', value: 'Czech Republic' },
//   { label: 'Denmark', value: 'Denmark' },
//   { label: 'Djibouti', value: 'Djibouti' },
//   { label: 'Dominica', value: 'Dominica' },
//   { label: 'Dominican Republic', value: 'Dominican Republic' },
//   { label: 'Ecuador', value: 'Ecuador' },
//   { label: 'Egypt', value: 'Egypt' },
//   { label: 'El Salvador', value: 'El Salvador' },
//   { label: 'Equatorial Guinea', value: 'Equatorial Guinea' },
//   { label: 'Eritrea', value: 'Eritrea' },
//   { label: 'Estonia', value: 'Estonia' },
//   { label: 'Ethiopia', value: 'Ethiopia' },
//   {
//     label: 'Falkland Islands (Malvinas)',
//     value: 'Falkland Islands (Malvinas)',
//   },
//   { label: 'Faroe Islands', value: 'Faroe Islands' },
//   { label: 'Fiji', value: 'Fiji' },
//   { label: 'Finland', value: 'Finland' },
//   { label: 'France', value: 'France' },
//   { label: 'French Guiana', value: 'French Guiana' },
//   { label: 'French Polynesia', value: 'French Polynesia' },
//   {
//     label: 'French Southern Territories',
//     value: 'French Southern Territories',
//   },
//   { label: 'Gabon', value: 'Gabon' },
//   { label: 'Gambia', value: 'Gambia' },
//   { label: 'Georgia', value: 'Georgia' },
//   { label: 'Germany', value: 'Germany' },
//   { label: 'Ghana', value: 'Ghana' },
//   { label: 'Gibraltar', value: 'Gibraltar' },
//   { label: 'Greece', value: 'Greece' },
//   { label: 'Greenland', value: 'Greenland' },
//   { label: 'Grenada', value: 'Grenada' },
//   { label: 'Guadeloupe', value: 'Guadeloupe' },
//   { label: 'Guam', value: 'Guam' },
//   { label: 'Guatemala', value: 'Guatemala' },
//   { label: 'Guernsey', value: 'Guernsey' },
//   { label: 'Guinea', value: 'Guinea' },
//   { label: 'Guinea-Bissau', value: 'Guinea-Bissau' },
//   { label: 'Guyana', value: 'Guyana' },
//   { label: 'Haiti', value: 'Haiti' },
//   {
//     label: 'Heard Island and McDonald Islands',
//     value: 'Heard Island and McDonald Islands',
//   },
//   {
//     label: 'Holy See (Vatican City State)',
//     value: 'Holy See (Vatican City State)',
//   },
//   { label: 'Honduras', value: 'Honduras' },
//   { label: 'Hong Kong', value: 'Hong Kong' },
//   { label: 'Hungary', value: 'Hungary' },
//   { label: 'Iceland', value: 'Iceland' },
//   { label: 'India', value: 'India' },
//   { label: 'Indonesia', value: 'Indonesia' },
//   { label: 'Iran', value: 'Iran' },
//   { label: 'Iraq', value: 'Iraq' },
//   { label: 'Ireland', value: 'Ireland' },
//   { label: 'Isle of Man', value: 'Isle of Man' },
//   { label: 'Israel', value: 'Israel' },
//   { label: 'Italy', value: 'Italy' },
//   { label: 'Jamaica', value: 'Jamaica' },
//   { label: 'Japan', value: 'Japan' },
//   { label: 'Jersey', value: 'Jersey' },
//   { label: 'Jordan', value: 'Jordan' },
//   { label: 'Kazakhstan', value: 'Kazakhstan' },
//   { label: 'Kenya', value: 'Kenya' },
//   { label: 'Kiribati', value: 'Kiribati' },
//   { label: 'Korea', value: 'Korea' },
//   { label: 'Kuwait', value: 'Kuwait' },
//   { label: 'Kyrgyzstan', value: 'Kyrgyzstan' },
//   {
//     label: "Lao People's Democratic Republic",
//     value: "Lao People's Democratic Republic",
//   },
//   { label: 'Latvia', value: 'Latvia' },
//   { label: 'Lebanon', value: 'Lebanon' },
//   { label: 'Lesotho', value: 'Lesotho' },
//   { label: 'Liberia', value: 'Liberia' },
//   { label: 'Libya', value: 'Libya' },
//   { label: 'Liechtenstein', value: 'Liechtenstein' },
//   { label: 'Lithuania', value: 'Lithuania' },
//   { label: 'Luxembourg', value: 'Luxembourg' },
//   { label: 'Macao', value: 'Macao' },
//   { label: 'Macedonia', value: 'Macedonia' },
//   { label: 'Madagascar', value: 'Madagascar' },
//   { label: 'Malawi', value: 'Malawi' },
//   { label: 'Malaysia', value: 'Malaysia' },
//   { label: 'Maldives', value: 'Maldives' },
//   { label: 'Mali', value: 'Mali' },
//   { label: 'Malta', value: 'Malta' },
//   { label: 'Marshall Islands', value: 'Marshall Islands' },
//   { label: 'Martinique', value: 'Martinique' },
//   { label: 'Mauritania', value: 'Mauritania' },
//   { label: 'Mauritius', value: 'Mauritius' },
//   { label: 'Mayotte', value: 'Mayotte' },
//   { label: 'Mexico', value: 'Mexico' },
//   { label: 'Micronesia', value: 'Micronesia' },
//   { label: 'Moldova', value: 'Moldova' },
//   { label: 'Monaco', value: 'Monaco' },
//   { label: 'Mongolia', value: 'Mongolia' },
//   { label: 'Montenegro', value: 'Montenegro' },
//   { label: 'Montserrat', value: 'Montserrat' },
//   { label: 'Morocco', value: 'Morocco' },
//   { label: 'Mozambique', value: 'Mozambique' },
//   { label: 'Myanmar', value: 'Myanmar' },
//   { label: 'Namibia', value: 'Namibia' },
//   { label: 'Nauru', value: 'Nauru' },
//   { label: 'Nepal', value: 'Nepal' },
//   { label: 'Netherlands', value: 'Netherlands' },
//   { label: 'New Caledonia', value: 'New Caledonia' },
//   { label: 'New Zealand', value: 'New Zealand' },
//   { label: 'Nicaragua', value: 'Nicaragua' },
//   { label: 'Niger', value: 'Niger' },
//   { label: 'Nigeria', value: 'Nigeria' },
//   { label: 'Niue', value: 'Niue' },
//   { label: 'Norfolk Island', value: 'Norfolk Island' },
//   { label: 'Northern Mariana Islands', value: 'Northern Mariana Islands' },
//   { label: 'Norway', value: 'Norway' },
//   { label: 'Oman', value: 'Oman' },
//   { label: 'Pakistan', value: 'Pakistan' },
//   { label: 'Palau', value: 'Palau' },
//   { label: 'Palestine', value: 'Palestine' },
//   { label: 'Panama', value: 'Panama' },
//   { label: 'Papua New Guinea', value: 'Papua New Guinea' },
//   { label: 'Paraguay', value: 'Paraguay' },
//   { label: 'Peru', value: 'Peru' },
//   { label: 'Philippines', value: 'Philippines' },
//   { label: 'Pitcairn', value: 'Pitcairn' },
//   { label: 'Poland', value: 'Poland' },
//   { label: 'Portugal', value: 'Portugal' },
//   { label: 'Puerto Rico', value: 'Puerto Rico' },
//   { label: 'Qatar', value: 'Qatar' },
//   { label: 'RÃ©union', value: 'RÃ©union' },
//   { label: 'Romania', value: 'Romania' },
//   { label: 'Russian Federation', value: 'Russian Federation' },
//   { label: 'Rwanda', value: 'Rwanda' },
//   { label: 'Saint BarthÃ©lemy', value: 'Saint BarthÃ©lemy' },
//   { label: 'Saint Helena', value: 'Saint Helena' },
//   { label: 'Saint Kitts and Nevis', value: 'Saint Kitts and Nevis' },
//   { label: 'Saint Lucia', value: 'Saint Lucia' },
//   { label: 'Saint Martin (French part)', value: 'Saint Martin (French part)' },
//   { label: 'Saint Pierre and Miquelon', value: 'Saint Pierre and Miquelon' },
//   {
//     label: 'Saint Vincent and the Grenadines',
//     value: 'Saint Vincent and the Grenadines',
//   },
//   { label: 'Samoa', value: 'Samoa' },
//   { label: 'San Marino', value: 'San Marino' },
//   { label: 'Sao Tome and Principe', value: 'Sao Tome and Principe' },
//   { label: 'Saudi Arabia', value: 'Saudi Arabia' },
//   { label: 'Senegal', value: 'Senegal' },
//   { label: 'Serbia', value: 'Serbia' },
//   { label: 'Seychelles', value: 'Seychelles' },
//   { label: 'Sierra Leone', value: 'Sierra Leone' },
//   { label: 'Singapore', value: 'Singapore' },
//   { label: 'Sint Maarten (Dutch part)', value: 'Sint Maarten (Dutch part)' },
//   { label: 'Slovakia', value: 'Slovakia' },
//   { label: 'Slovenia', value: 'Slovenia' },
//   { label: 'Solomon Islands', value: 'Solomon Islands' },
//   { label: 'Somalia', value: 'Somalia' },
//   { label: 'South Africa', value: 'South Africa' },
//   {
//     label: 'South Georgia and the South Sandwich Islands',
//     value: 'South Georgia and the South Sandwich Islands',
//   },
//   { label: 'South Sudan', value: 'South Sudan' },
//   { label: 'Spain', value: 'Spain' },
//   { label: 'Sri Lanka', value: 'Sri Lanka' },
//   { label: 'Sudan', value: 'Sudan' },
//   { label: 'Suriname', value: 'Suriname' },
//   { label: 'Svalbard and Jan Mayen', value: 'Svalbard and Jan Mayen' },
//   { label: 'Swaziland', value: 'Swaziland' },
//   { label: 'Sweden', value: 'Sweden' },
//   { label: 'Switzerland', value: 'Switzerland' },
//   { label: 'Syrian Arab Republic', value: 'Syrian Arab Republic' },
//   { label: 'Taiwan', value: 'Taiwan' },
//   { label: 'Tajikistan', value: 'Tajikistan' },
//   { label: 'Tanzania', value: 'Tanzania' },
//   { label: 'Thailand', value: 'Thailand' },
//   { label: 'Timor-Leste', value: 'Timor-Leste' },
//   { label: 'Togo', value: 'Togo' },
//   { label: 'Tokelau', value: 'Tokelau' },
//   { label: 'Tonga', value: 'Tonga' },
//   { label: 'Trinidad and Tobago', value: 'Trinidad and Tobago' },
//   { label: 'Tunisia', value: 'Tunisia' },
//   { label: 'Turkey', value: 'Turkey' },
//   { label: 'Turkmenistan', value: 'Turkmenistan' },
//   { label: 'Turks and Caicos Islands', value: 'Turks and Caicos Islands' },
//   { label: 'Tuvalu', value: 'Tuvalu' },
//   { label: 'Uganda', value: 'Uganda' },
//   { label: 'Ukraine', value: 'Ukraine' },
//   { label: 'United Arab Emirates', value: 'United Arab Emirates' },
//   { label: 'United Kingdom', value: 'United Kingdom' },
//   {
//     label: 'United States Minor Outlying Islands',
//     value: 'United States Minor Outlying Islands',
//   },
//   { label: 'Uruguay', value: 'Uruguay' },
//   { label: 'Uzbekistan', value: 'Uzbekistan' },
//   { label: 'Vanuatu', value: 'Vanuatu' },
//   { label: 'Venezuela', value: 'Venezuela' },
//   { label: 'Viet Nam', value: 'Viet Nam' },
//   { label: 'Virgin Islands', value: 'Virgin Islands' },
//   { label: 'Virgin Islands', value: 'Virgin Islands' },
//   { label: 'Wallis and Futuna', value: 'Wallis and Futuna' },
//   { label: 'Western Sahara', value: 'Western Sahara' },
//   { label: 'Yemen', value: 'Yemen' },
//   { label: 'Zambia', value: 'Zambia' },
//   { label: 'Zimbabwe', value: 'Zimbabwe' },
//   { label: '', value: '' },
// ];

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

export const course_options = [
  { label: '1-on-1', value: '1-on-1' },
  { label: 'Group Lesson', value: 'group' },
];
export const courses = [
  { value: 'english', package: 'english', label: 'english', options: [0, 1] },
  { value: 'writing', package: 'writing', label: 'writing', options: [0, 1] },
];

export const class_durations = ['30min', '60min'];

export const class_types = ['1-on-1', 'group'];

export const subscription_periods = [
  '1month',
  '3months',
  '6months',
  '12months',
];

export const currencies = ['$', '₩'];

export const introsteps = [
  'dress_smart',
  'brand_yourself',
  'smile_look_camera',
  'speak_ca',
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

export const cancellationArr = [
  'Need to reschedule the lesson',
  'Not prepared for the lesson',
  'Urgent personal matter',
  'Technical or internet connection issues',
  'Health related matter',
  'Tutor has not confirmed the lesson',
  'I do not like the matched tutor',
  'Other',
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

export const ModalType = {
  CANCEL: 'cancel',
  RESCHEDULE: 'reschedule',
};

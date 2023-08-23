import timezones from 'timezones-list';
import { getData } from 'country-list';

export const genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'non-binary' },
];

export const pronouns = [
  { label: 'He/Him/His', value: 'male' },
  { label: 'She/Her/Hers', value: 'female' },
  { label: 'They/Them/Theirs', value: 'transgender' },
  { label: 'She and/or He', value: 'non-binary' },
  { label: 'Other', value: 'other' },
];

// export const timezones = [
//   { label: '(UTC-05:00) Eastern Time (US & Canada)', value: 'UTC-4' },
//   { label: '(UTC-06:00) Central Time (US & Canada)', value: 'UTC-6' },
//   { label: '(UTC-07:00) Mountain Time (US & Canada)', value: 'UTC-6' },
//   { label: '(UTC-08:00) Pacific Time (US & Canada)', value: 'UTC-8' },
//   { label: '(UTC+09:00) Seoul', value: 'UTC+9' },
//   { label: '(UTC-12:00) International Date Line West', value: 'UTC-12' },
//   { label: '(UTC-11:00) Midway Island, Samoa', value: 'UTC-11' },
//   { label: '(UTC-10:00) Hawaii', value: 'UTC-10' },
//   { label: '(UTC-09:00) Alaska', value: 'UTC-9' },
//   { label: '(UTC-04:00) Caracas, La Paz', value: 'UTC-4' },
//   { label: '(UTC-03:00) Buenos Aires, Georgetown', value: 'UTC-3' },
//   { label: '(UTC-02:00) Mid-Atlantic', value: 'UTC-2' },
//   { label: '(UTC-01:00) Cape Verde Is.', value: 'UTC-1' },
//   {
//     label:
//       '(UTC+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
//     value: 'UTC+0',
//   },
//   {
//     label: '(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
//     value: 'UTC+1',
//   },
//   { label: '(UTC+02:00) Athens, Bucharest, Istanbul', value: 'UTC+2' },
//   { label: '(UTC+03:00) Kuwait, Riyadh, Baghdad', value: 'UTC+3' },
//   { label: '(UTC+03:30) Tehran', value: 'UTC+03:30' },
//   { label: '(UTC+04:00) Abu Dhabi, Muscat', value: 'UTC+4' },
//   { label: '(UTC+04:30) Kabul', value: 'UTC+04:30' },
//   { label: '(UTC+05:00) Yekaterinburg', value: 'UTC+5' },
//   {
//     label: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
//     value: 'UTC+05:30',
//   },
//   { label: '(UTC+05:45) Kathmandu', value: 'UTC+05:45' },
//   { label: '(UTC+06:00) Almaty, Novosibirsk', value: 'UTC+6' },
//   { label: '(UTC+06:30) Yangon (Rangoon)', value: 'UTC+06:30' },
//   { label: '(UTC+07:00) Bangkok, Hanoi, Jakarta', value: 'UTC+7' },
//   {
//     label: '(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
//     value: 'UTC+8',
//   },
//   { label: '(UTC+09:30) Adelaide', value: 'UTC+09:30' },
//   { label: '(UTC+10:00) Brisbane', value: 'UTC+10' },
//   { label: '(UTC+11:00) Magadan, Solomon Is., New Caledonia', value: 'UTC+11' },
//   { label: '(UTC+12:00) Auckland, Wellington', value: 'UTC+12' },
//   { label: '(UTC+12:00) Fiji, Kamchatka, Marshall Is.', value: 'UTC+12' },
//   { label: "(UTC+13:00) Nuku'alofa", value: 'UTC+13' },
// ];

export const timezoneOptions = timezones.map(({ label, tzCode }) => {
  return {
    label,
    value: tzCode,
  };
});

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

export const ROLES = {
  MENTOR: 'mentor',
  STUDENT: 'student',
};

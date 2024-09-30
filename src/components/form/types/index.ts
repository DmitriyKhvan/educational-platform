export interface PhoneNumberFieldForm {
  koreanEquivalent?: string | null;
  gender?: string | null;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  phoneNumberWithoutCode: string;
  address?: string | null;
  timeZone: string;
  country?: string | null;
  password: string;
  email: string;
}

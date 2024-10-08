import { MyDrawer } from '@/components/drawer';
import MyDropdownMenu from '@/components/dropdown-menu';
import Button from '@/components/form/button/button';
import InputField from '@/components/form/input-field';
import { PhoneCodeListModal } from '@/components/onboarding/phone-code-list-modal';
import { type PhoneCode, phoneCodes } from '@/shared/constants/global';
import { type ReactNode, useEffect, useState } from 'react';
import type {
  UseFormRegister,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import ReactInputMask from 'react-input-mask';
import { useMediaQuery } from 'react-responsive';
import type { PhoneNumberFieldForm } from './types';

interface PhoneNumberFieldProps {
  register: UseFormRegister<PhoneNumberFieldForm>;
  resetField: UseFormResetField<PhoneNumberFieldForm>;
  setValue: UseFormSetValue<PhoneNumberFieldForm>;
  watch: UseFormWatch<PhoneNumberFieldForm>;

  defaultNumber?: string;
  disabled?: boolean;
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  register,
  resetField,
  setValue,
  watch,
  defaultNumber,
  disabled,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const [country, setCountry] = useState<PhoneCode>(
    phoneCodes.find((p) => defaultNumber?.startsWith(p?.code)) ?? phoneCodes[4],
  );

  const numberWithoutCode = watch('phoneNumberWithoutCode');

  useEffect(() => {
    if (country?.code && numberWithoutCode) {
      setValue('phoneNumber', `${country.code}${numberWithoutCode.replace(/[-()]/g, '')}`);
    }
  }, [country, numberWithoutCode, setValue]);

  const [isDefaultNumInit, setIsDefaultNumInit] = useState(false);

  useEffect(() => {
    if (!isDefaultNumInit && defaultNumber) {
      const phoneCode = phoneCodes.find((p) => defaultNumber.startsWith(p?.code));
      if (!phoneCode) return;
      if (country.code !== phoneCode.code) {
        setCountry(phoneCode);
        return;
      }

      const formatToMask = (defaultNumber: string) => {
        let i = 0;
        const numWithoutCode = defaultNumber?.replace(phoneCode.code, '');
        return country?.mask?.replace(/#/g, () => numWithoutCode[i++]);
      };

      setValue('phoneNumberWithoutCode', formatToMask(defaultNumber));
      setIsDefaultNumInit(true);
    }
  }, [defaultNumber, country, setValue, isDefaultNumInit]);

  const [t] = useTranslation(['onboarding', 'common', 'translations']);

  return (
    <div>
      <label
        className="flex mb-[10px] font-semibold text-[15px] leading-5 tracking-[-0.2px]"
        htmlFor="phoneNumberWithoutCode"
      >
        {t('phone_number', { ns: 'common' })}
      </label>
      <div className="flex items-center justify-between gap-2">
        {disabled ? (
          <Button
            disabled={disabled}
            theme="clear"
            className="min-w-[103px] py-[14px] pl-3 pr-2 rounded-lg border border-color-border-grey select-none"
          >
            <div className="flex items-center justify-between gap-2">
              <img className="w-[22px] grayscale" src={country?.flag} alt={country?.name} />
              <span className="text-sm font-medium">{country?.code}</span>
              <MdOutlineKeyboardArrowDown className="w-4" />
            </div>
          </Button>
        ) : isMobile ? (
          <MyDrawer
            button={
              <Button
                theme="clear"
                className="min-w-[103px] py-[14px] pl-3 pr-2 rounded-lg border border-color-border-grey select-none cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <img className="w-[22px]" src={country?.flag} alt={country?.name} />
                  <span className="text-sm font-medium">{country?.code}</span>
                  <MdOutlineKeyboardArrowDown className="w-4" />
                </div>
              </Button>
            }
          >
            <PhoneCodeListModal
              setCountry={setCountry}
              currentCountry={country}
              resetField={resetField}
            />
          </MyDrawer>
        ) : (
          <MyDropdownMenu
            button={
              <Button
                theme="clear"
                className="min-w-[103px] py-[14px] pl-3 pr-2 rounded-lg border border-color-border-grey select-none cursor-pointer"
              >
                <span className="flex items-center justify-between gap-2">
                  <img className="w-[22px]" src={country?.flag} alt={country?.name} />
                  <span className="text-sm font-medium">{country?.code}</span>
                  <MdOutlineKeyboardArrowDown className="w-4" />
                </span>
              </Button>
            }
          >
            <PhoneCodeListModal
              setCountry={setCountry}
              currentCountry={country}
              resetField={resetField}
            />
          </MyDropdownMenu>
        )}

        {country?.mask && (
          <ReactInputMask
            id="phoneNumberWithoutCode"
            mask={country?.mask?.replace(/#/g, '9')}
            maskChar="X"
            className="w-full"
            placeholder={country?.mask?.replace(/#/g, 'X')}
            disabled={disabled}
            {...register('phoneNumberWithoutCode', {
              required: !disabled
                ? t('required_phone_number', {
                    ns: 'translations',
                  })
                : false,
              pattern: !disabled
                ? {
                    value: new RegExp(
                      country?.mask?.replace(/[()#]/g, (match) => {
                        if (match === '(') return '\\(';
                        if (match === ')') return '\\)';
                        if (match === '#') return '\\d';
                        return match;
                      }),
                    ),
                    message: t('invalid_phone_number', {
                      ns: 'onboarding',
                    }),
                  }
                : undefined,
            })}
          >
            {
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              ((inputProps: any) => (
                <InputField {...inputProps} disabled={disabled} />
              )) as unknown as ReactNode
            }
          </ReactInputMask>
        )}

        <input type="hidden" {...register('phoneNumber')} />
      </div>
    </div>
  );
};

export default PhoneNumberField;

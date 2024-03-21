import React from 'react';

import CheckboxField from '../Form/CheckboxField';
import { phoneCodes } from 'src/constants/global';

export const PhoneCodeListModal = ({
  setCountry,
  currentCountry,
  resetField,
}) => {
  const setCountryHandler = (country) => {
    resetField('phoneNumberWithoutCode');
    resetField('phoneNumber');
    setCountry(country);
  };

  return (
    <ul className="h-[268px] overflow-auto px-6">
      {phoneCodes.map((country, index) => {
        return (
          <li key={country.iso}>
            <label className="flex items-center justify-between gap-3 py-4">
              <img className="w-[22px]" src={country.flag} alt={country.name} />
              <span className="grow text-[15px] font-medium">{`${country.name} (${country.code})`}</span>
              <CheckboxField
                type="radio"
                name="phoneCode"
                onChange={() => setCountryHandler(country)}
                checked={currentCountry.iso === country.iso}
              />
            </label>
            {index !== phoneCodes.length - 1 && <div className="divider"></div>}
          </li>
        );
      })}
    </ul>
  );
};

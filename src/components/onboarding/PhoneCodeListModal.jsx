import React from 'react';
import countries from 'countries-phone-masks';
import { AsYouType } from 'libphonenumber-js';

import CheckboxField from '../Form/CheckboxField';

export const PhoneCodeListModal = ({
  setCountry,
  currentCountry,
  resetField,
}) => {
  const setCountryHandler = (country) => {
    resetField('phoneNumber');
    setCountry(country);
  };

  console.log('PhoneNumber', new AsYouType('UZ').getTemplate());

  return (
    <ul className="h-[268px] overflow-auto px-6">
      {countries.map((country, index) => {
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
            {index !== countries.length - 1 && <div className="divider"></div>}
          </li>
        );
      })}
    </ul>
  );
};

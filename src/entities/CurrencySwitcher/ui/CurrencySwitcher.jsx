import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';
import { useAuth } from 'src/app/providers/AuthProvider';
import { useCurrency } from 'src/app/providers/CurrencyProvider';
import MyDropdownMenu from 'src/components/DropdownMenu';
import Button from 'src/components/Form/Button';
import CheckboxField from 'src/components/Form/CheckboxField';
import { UPDATE_USER } from 'src/shared/apollo/mutations/user/updateUser';
import { currenciesDic } from 'src/shared/constants/global';
import notify from 'src/shared/utils/notify';

export const CurrencySwitcher = () => {
  const { user } = useAuth();
  const { curCurrency, setCurCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [updateUser] = useMutation(UPDATE_USER);

  const onChangeCurrency = (currency) => {
    updateUser({
      variables: {
        id: parseInt(user?.id),
        data: {
          paymentCurrency: currency.value.toLowerCase(),
        },
      },
      onCompleted: () => {
        setOpen(false);
        setCurCurrency(currency);
        localStorage.setItem('currency', currency.value);
      },
      onError: (error) => {
        notify(error.message, 'error');
      },
    });
  };

  return (
    <MyDropdownMenu
      open={open}
      setOpen={setOpen}
      button={
        <Button
          theme="clear"
          className="flex justify-between items-center gap-3 w-full border border-gray-200"
        >
          <span className="grow text-left">{curCurrency?.label}</span>
          {open ? <FaAngleUp /> : <FaAngleDown />}
        </Button>
      }
    >
      <ul className="w-[200px]">
        {currenciesDic.map((currency) => {
          return (
            <li
              key={currency.value}
              className="border-b border-color-border-grey last:border-b-0"
            >
              <label className="flex items-center justify-between gap-3 p-4 cursor-pointer ">
                <span className="text-sm font-medium text-color-dark-purple">
                  {currency.label}
                </span>
                <CheckboxField
                  onChange={() => onChangeCurrency(currency)}
                  type="radio"
                  name="currency"
                  checked={currency.value === curCurrency.value}
                />
              </label>
            </li>
          );
        })}
      </ul>
    </MyDropdownMenu>
  );
};

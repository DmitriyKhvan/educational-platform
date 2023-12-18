import React, { useState } from 'react';
import CheckboxField from '../Form/CheckboxField';
import Button from '../Form/Button';
import { useTranslation } from 'react-i18next';

export const TermsConditionsModal = ({
  submitStripe,
  setIsOpenTermsConditions,
}) => {
  const [agree, setAgree] = useState(false);
  const [t] = useTranslation(['purchase', 'common']);

  return (
    <div>
      <h3 className="text-[22px] font-bold">
        {t('terms', { ns: 'purchase' })}
      </h3>
      <p className="mt-4 text-[17px] leading-7">
        Please read our{' '}
        <a className="text-color-purple underline underline-offset-2" href="#">
          Terms and Conditions
        </a>{' '}
        before proceeding
      </p>
      <CheckboxField
        className="mt-4 w-[250px]"
        label={`I have read and agree to the Terms and Conditions`}
        onChange={(e) => setAgree(e.target.checked)}
      />

      <Button
        onClick={agree ? submitStripe : undefined}
        className="w-full h-auto p-5 mt-6 mb-3"
        disabled={!agree}
      >
        Accept and Pay
      </Button>
      <Button
        onClick={() => setIsOpenTermsConditions(false)}
        className="w-full h-auto p-5"
        theme="clear"
      >
        {t('cancel', { ns: 'common' })}
      </Button>
    </div>
  );
};

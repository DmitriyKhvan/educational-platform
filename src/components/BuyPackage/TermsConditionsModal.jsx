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
      <p
        className="mt-4 text-[17px] leading-7"
        dangerouslySetInnerHTML={{
          __html: t('terms_link', { ns: 'purchase' }),
        }}
      ></p>
      <CheckboxField
        className="mt-4 w-[250px]"
        label={t('terms_agree')}
        onChange={(e) => setAgree(e.target.checked)}
      />

      <Button
        onClick={agree ? submitStripe : undefined}
        className="w-full h-auto p-5 mt-6 mb-3"
        disabled={!agree}
      >
        {t('accept_pay')}
      </Button>
      <Button
        onClick={() => setIsOpenTermsConditions(false)}
        className="w-full h-auto p-5"
        theme="gray"
      >
        {t('cancel', { ns: 'common' })}
      </Button>
    </div>
  );
};

import Button from '@/components/form/button';
import CheckboxField from '@/components/form/checkbox-field';
import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TermsConditionsModalProps {
  submitStripe: () => void;
  setIsOpenTermsConditions: (isOpen: boolean) => void;
}

export const TermsConditionsModal: React.FC<TermsConditionsModalProps> = ({
  submitStripe,
  setIsOpenTermsConditions,
}) => {
  const [agree, setAgree] = useState(false);
  const { t } = useTranslation(['purchase', 'common']);

  return (
    <div className="w-full max-w-[334px] m-auto">
      <h3 className="text-[22px] font-bold">{t('terms', { ns: 'purchase' })}</h3>
      <p
        className="mt-4 text-[17px] leading-7 break-keep"
        dangerouslySetInnerHTML={{
          __html: t('terms_link', { ns: 'purchase' }),
        }}
      />
      <CheckboxField
        className="mt-4 w-[250px] break-keep"
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

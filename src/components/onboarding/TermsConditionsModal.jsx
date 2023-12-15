import React, { useState } from 'react';
import CheckboxField from '../Form/CheckboxField';
import Button from '../Form/Button';

export const TermsConditionsModal = ({
  submitStripe,
  setIsOpenTermsConditions,
}) => {
  const [agree, setAgree] = useState(false);

  return (
    <div>
      <h3 className="text-[22px] font-bold">Terms and Conditions</h3>
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
        Cancel
      </Button>
    </div>
  );
};

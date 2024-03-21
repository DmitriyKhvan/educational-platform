import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from './Form/Button';

export const ModalPurchase = () => {
  const navigate = useHistory();
  return (
    <div className="w-full max-w-[400px] m-auto text-center">
      <h2 className="mb-4 text-[22px] text-color-dark-purple font-bold">
        Purchase lessons here!
      </h2>
      <p className="mb-6 text-[15px] text-color-dark-purple">
        Start your journey with NaoNow by selecting the package that best suits
        your needs.
      </p>
      <Button
        onClick={() => navigate.push('/purchase')}
        className="w-full h-14"
      >
        Select a package
      </Button>
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Form/Button';
import { useTranslation } from 'react-i18next';

export const ModalPurchase = () => {
  const navigate = useNavigate();
  const [t] = useTranslation('lessons');

  return (
    <div className="w-full max-w-[400px] m-auto text-center">
      <h2 className="mb-4 text-[22px] text-color-dark-purple font-bold">
        {t('purchase_lessons_here')}
      </h2>
      <p className="mb-6 text-[15px] text-color-dark-purple">
        {t('purchase_lessons_here_text')}
      </p>
      <Button onClick={() => navigate('/purchase')} className="w-full h-14">
        {t('select_package')}
      </Button>
    </div>
  );
};

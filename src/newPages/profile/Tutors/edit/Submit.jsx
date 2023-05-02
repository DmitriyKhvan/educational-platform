import React from 'react';
import { useTranslation } from 'react-i18next';

const Submit = () => {
  const [t] = useTranslation('common');
  return <button type="submit">{t('save')}</button>;
};

export default Submit;

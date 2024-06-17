import React, { useState } from 'react';
import { Start } from './Start';
import { Steps } from './Steps';

export const Questionnaire = () => {
  const [page, setPage] = useState('start');

  if (page === 'start') {
    return <Start setPage={setPage} />;
  }

  if (page === 'questionnaire') {
    return <Steps />;
  }
};

import React, { useState } from 'react';
import { Start } from './Start';
import { Questionnaire } from './Questionnaire';

export const Main = () => {
  const [page, setPage] = useState('start');

  if (page === 'start') {
    return <Start setPage={setPage} />;
  }

  if (page === 'questionnaire') {
    return <Questionnaire />;
  }
};

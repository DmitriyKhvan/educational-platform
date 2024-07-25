import React, { useState } from 'react';
import { Start } from './Start';
import { Steps } from './Steps';

export const Questionnaire = () => {
  const questionnaire = JSON.parse(localStorage.getItem('questionnaire'));

  console.log('questionnaire', questionnaire);

  const { page: currentPage } = questionnaire || {};

  const [page, setPage] = useState(currentPage || 'start');
  const [, setCache] = useState(questionnaire || {});

  if (page === 'start') {
    return <Start setPage={setPage} setCache={setCache} />;
  }

  if (page === 'questionnaire') {
    return <Steps setCache={setCache} questionnaire={questionnaire} />;
  }
};

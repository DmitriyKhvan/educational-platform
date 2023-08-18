import { useState } from 'react';

export default function useMultistepForm(steps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  function next() {
    setCurrentStepIndex((i) => (i >= steps.length - 1 ? i : i + 1));
  }

  function back() {
    setCurrentStepIndex((i) => (i <= 0 ? i : i - 1));
  }

  function goTo(index) {
    if (index < 0 || index > steps.length) return;
    setCurrentStepIndex(index);
  }

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    next,
    back,
    goTo,
    isLast: currentStepIndex === steps.length - 1,
    isFirst: currentStepIndex === 0,
    setCurrentStepIndex,
  };
}

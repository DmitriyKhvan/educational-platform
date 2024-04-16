import React from 'react';
import { OnboardingLayout } from 'src/layouts/OnboardingLayout';

import { SelectProfile as SelectProfileComponent } from 'src/components/SelectProfile';

export const SelectProfile = () => {
  return (
    <OnboardingLayout>
      <SelectProfileComponent />
    </OnboardingLayout>
  );
};

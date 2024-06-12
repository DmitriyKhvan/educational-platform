import React, { useState } from 'react';
import { StepIndicator } from './StepIndicator';
import { useForm } from 'react-hook-form';
import { EnergyLevel } from './EnergyLevel';
import Button from 'src/components/Form/Button';

export const Questionnaire = () => {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    // formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    // defaultValues: {
    //   energyLevel: '',
    //   interesets: [],
    //   gender: '',
    //   teachingPersonality: '',
    //   availability: {
    //     time: [],
    //     days: [],
    //   },
    // },
  });

  const onSubmit = (data) => {
    console.log('data', data);
  };

  return (
    <div className="max-w-[400px] mx-auto">
      <StepIndicator step={step} setStep={setStep} />

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <EnergyLevel
            {...register('energyLevel', { required: true })}
            watch={watch}
          />
        )}

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

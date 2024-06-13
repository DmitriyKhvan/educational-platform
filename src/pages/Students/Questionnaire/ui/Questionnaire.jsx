import React, { useState } from 'react';
import { StepIndicator } from './StepIndicator';
import { useForm } from 'react-hook-form';
import { EnergyLevel } from './EnergyLevel';
import Button from 'src/components/Form/Button';
import { Interests } from './Interests';
import { Gender } from './Gender';
import { TeachingPersonality } from './TeachingPersonality';

export const Questionnaire = () => {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    // formState: { errors, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      energyLevel: '',
      interests: [],
      gender: '',
      teachingPersonality: '',
      availability: {
        time: [],
        days: [],
      },
    },
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
            setStep={setStep}
            {...register('energyLevel', { required: true })}
            watch={watch}
          />
        )}

        {step === 2 && (
          <Interests
            setStep={setStep}
            {...register('interests', { required: true })}
            watch={watch}
          />
        )}

        {step === 3 && (
          <Gender
            setStep={setStep}
            {...register('gender', { required: true })}
            watch={watch}
          />
        )}

        {step === 4 && (
          <TeachingPersonality
            setStep={setStep}
            {...register('teachingPersonality', { required: true })}
            watch={watch}
          />
        )}

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

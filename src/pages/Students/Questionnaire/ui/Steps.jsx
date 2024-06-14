import React, { useState } from 'react';
import { StepIndicator } from './StepIndicator';
import { useForm } from 'react-hook-form';
import { EnergyLevel } from './EnergyLevel';
import Button from 'src/components/Form/Button';
import { Interests } from './Interests';
import { Gender } from './Gender';
import { TeachingPersonality } from './TeachingPersonality';
import { Availability } from './Availability';
import { Time } from './Time';
import { Days } from './Days';

export const Steps = () => {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
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

        {step === 5 && (
          <>
            <Availability>
              <Time
                watch={watch}
                {...register('availability.time', {
                  validate: (value) => value.length > 0,
                })}
              />
              <Days
                watch={watch}
                {...register('availability.days', {
                  validate: (value) => value.length > 0,
                })}
              />
            </Availability>

            <Button
              type="submit"
              disabled={!isValid}
              theme="purple"
              className="w-full h-[57px] mt-12"
            >
              Next
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from 'src/components/Form/Button';

import {
  StepIndicator,
  StepWrap,
  EnergyLevel,
  Interests,
  Gender,
  TeachingPersonality,
  Time,
  Days,
} from 'src/entities/Questionnaire';

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
          <StepWrap
            title="What energy level do you prefer in a mentor?"
            subTitle="Select an option"
          >
            <EnergyLevel
              setStep={setStep}
              {...register('energyLevel', { required: true })}
              watch={watch}
            />
          </StepWrap>
        )}

        {step === 2 && (
          <StepWrap
            title=" What are your interests?"
            subTitle="You can select multiple options"
            tag={true}
          >
            <Interests
              setStep={setStep}
              {...register('interests', { required: true })}
              watch={watch}
            />
          </StepWrap>
        )}

        {step === 3 && (
          <StepWrap
            title="Do you have a preference for the gender of your mentor?"
            subTitle="Select an option"
          >
            <Gender
              setStep={setStep}
              {...register('gender', { required: true })}
              watch={watch}
            />
          </StepWrap>
        )}

        {step === 4 && (
          <StepWrap
            title="What teaching personality do you prefer in a mentor?"
            subTitle="You can select multiple options"
            tag={true}
          >
            <TeachingPersonality
              setStep={setStep}
              {...register('teachingPersonality', { required: true })}
              watch={watch}
            />
          </StepWrap>
        )}

        {step === 5 && (
          <>
            <StepWrap
              title="What is your availability?"
              subTitle="Please select as many options as possible"
              tag={true}
            >
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
            </StepWrap>

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

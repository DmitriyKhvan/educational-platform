import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/app/providers/AuthProvider';
import Button from 'src/components/Form/Button';
import ReactLoader from 'src/components/common/Loader';

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
import { CREATE_MATCHING_PROFILE_FOR_STUDENT } from 'src/shared/apollo/mutations/matching/createMatchingProfileForStudent';
import { MATCHING_PROFILE } from 'src/shared/apollo/queries/matching/matchingProfile';
import { getItemToLocalStorage } from 'src/shared/constants/global';
import notify from 'src/shared/utils/notify';

export const Steps = ({ setCache, questionnaire }) => {
  const {
    step: currentStep,
    energy,
    interests,
    gender,
    teachingStyles,
    availabilities,
  } = questionnaire || {};
  const { refetchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(currentStep || 1);
  const navigate = useNavigate();

  const { data: dictionaries } = useQuery(MATCHING_PROFILE);

  const [createMatchingProfileForStudent] = useMutation(
    CREATE_MATCHING_PROFILE_FOR_STUDENT,
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      energy: energy || '',
      interests: interests || [],
      gender: gender || '',
      teachingStyles: teachingStyles || [],
      availabilities: availabilities || {
        time: [],
        days: [],
      },
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const { energy, interests, gender, teachingStyles } = data;

    const availabilities = dictionaries.matchingProfile.availabilities
      .filter((avail) => {
        if (
          data.availabilities.time.length &&
          data.availabilities.days.length
        ) {
          return (
            data.availabilities.time.includes(avail.from) &&
            data.availabilities.days.includes(avail.day)
          );
        } else if (data.availabilities.time.length) {
          return data.availabilities.time.includes(avail.from);
        } else {
          return data.availabilities.days.includes(avail.day);
        }
      })
      .map((avail) => avail.id);

    const dataFilter = {
      studentId: getItemToLocalStorage('studentId'),
      energy,
      interests,
      gender,
      teachingStyles,
      availabilities,
    };

    try {
      const response = await createMatchingProfileForStudent({
        variables: { ...dataFilter },
      });

      if (response) {
        await refetchUser();
        localStorage.removeItem('questionnaire');
        navigate('/mentor-matches-list');
      }
    } catch (error) {
      notify(error.message, 'error');
    }

    setLoading(false);
  };

  useEffect(() => {
    setCache((prev) => {
      localStorage.setItem('questionnaire', JSON.stringify({ ...prev, step }));
      return { ...prev, step };
    });
  }, [step]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'availabilities.days' || name === 'availabilities.time') {
        const [avail, availType] = name.split('.');

        setCache((prev) => {
          localStorage.setItem(
            'questionnaire',
            JSON.stringify({
              ...prev,
              [avail]: {
                ...prev[avail],
                [availType]: value[avail][availType],
              },
            }),
          );
          return {
            ...prev,
            [avail]: {
              ...prev[avail],
              [availType]: value[avail][availType],
            },
          };
        });
      } else {
        setCache((prev) => {
          localStorage.setItem(
            'questionnaire',
            JSON.stringify({ ...prev, [name]: value[name] }),
          );
          return { ...prev, [name]: value[name] };
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      {loading && <ReactLoader />}
      <div className="max-w-[400px] mx-auto">
        <StepIndicator step={step} setStep={setStep} />

        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <StepWrap
              title="What energy level do you prefer in a mentor?"
              subTitle="Select an option"
            >
              <EnergyLevel
                watch={watch}
                {...register('energy', { required: true })}
              />
              <Button
                onClick={() => setStep((step) => step + 1)}
                disabled={watch('energy') ? false : true}
                className="w-full h-[57px] mt-12"
              >
                Next
              </Button>
            </StepWrap>
          )}

          {step === 2 && (
            <StepWrap
              title=" What are your interests?"
              subTitle="You can select multiple options"
              tag={true}
            >
              <Interests
                dictionaries={dictionaries}
                watch={watch}
                {...register('interests', { required: true })}
              />
              <Button
                onClick={() => setStep((step) => step + 1)}
                disabled={watch('interests')?.length ? false : true}
                className="w-full h-[57px] mt-12"
              >
                Next
              </Button>
            </StepWrap>
          )}

          {step === 3 && (
            <StepWrap
              title="Do you have a preference for the gender of your mentor?"
              subTitle="Select an option"
            >
              <div className="space-y-4">
                <Gender
                  {...register('gender', { required: true })}
                  watch={watch}
                />
              </div>
              <Button
                onClick={() => setStep((step) => step + 1)}
                disabled={watch('gender') ? false : true}
                className="w-full h-[57px] mt-12"
              >
                Next
              </Button>
            </StepWrap>
          )}

          {step === 4 && (
            <StepWrap
              title="What teaching personality do you prefer in a mentor?"
              subTitle="You can select multiple options"
              tag={true}
            >
              <TeachingPersonality
                dictionaries={dictionaries}
                {...register('teachingStyles', { required: true })}
                watch={watch}
              />
              <Button
                onClick={() => setStep((step) => step + 1)}
                disabled={watch('teachingStyles')?.length ? false : true}
                className="w-full h-[57px] mt-12"
              >
                Next
              </Button>
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
                  {...register('availabilities.time', {
                    validate: (value) => value.length > 0,
                  })}
                />
                <Days
                  watch={watch}
                  {...register('availabilities.days', {
                    validate: (value) => value.length > 0,
                  })}
                />
              </StepWrap>

              <Button
                type="submit"
                disabled={!isValid}
                className="w-full h-[57px] mt-12"
              >
                Next
              </Button>
            </>
          )}
        </form>
      </div>
    </>
  );
};

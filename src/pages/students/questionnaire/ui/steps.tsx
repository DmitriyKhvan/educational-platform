import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-provider';

import {
  StepIndicator,
  StepWrap,
  EnergyLevel,
  Interests,
  Gender,
  TeachingPersonality,
  Time,
  Days,
} from '@/entities/questionnaire';
import { getItemToLocalStorage } from '@/shared/constants/global';
import notify from '@/shared/utils/notify';
import Button from '@/components/form/button';
import ReactLoader from '@/components/common/loader';
import {
  GenderType,
  type MatchingProfile,
  type MatchingProfileAvailability,
  type Maybe,
  type MutationCreateMatchingProfileForStudentArgs,
} from '@/types/types.generated';
import { useMatchingProfileQuery } from '@/shared/apollo/queries/matching/matchingProfile.generated';
import { useCreateMatchingProfileForStudentMutation } from '@/shared/apollo/mutations/matching/createMatchingProfileForStudent.generated';

export type Questionnaire = {
  energy: MutationCreateMatchingProfileForStudentArgs['energy'];
  interests: MutationCreateMatchingProfileForStudentArgs['interests'];
  gender?: MutationCreateMatchingProfileForStudentArgs['gender'];
  teachingStyles: MutationCreateMatchingProfileForStudentArgs['teachingStyles'];
  availabilities?: {
    time: string[];
    days: string[];
  };
  certifications: string[];
  specializations: string[];
};

type StepProps = {
  setCache: Dispatch<SetStateAction<object>>;
  questionnaire: Questionnaire & { step: number };
};

export const Steps: React.FC<StepProps> = ({ setCache, questionnaire }) => {
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

  const { data: dictionaries } = useMatchingProfileQuery();

  const [createMatchingProfileForStudent] = useCreateMatchingProfileForStudentMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<Questionnaire>({
    mode: 'all',
    defaultValues: {
      energy: energy || '',
      interests: interests || [],
      gender: gender || GenderType.Male,
      teachingStyles: teachingStyles || [],
      availabilities: availabilities || {
        time: [],
        days: [],
      },
    },
  });

  const onSubmit = async (data: Questionnaire) => {
    setLoading(true);
    const { energy, interests, gender, teachingStyles } = data;

    let availabilities: MutationCreateMatchingProfileForStudentArgs['availabilities'] = [];

    if (dictionaries?.matchingProfile?.availabilities) {
      availabilities = dictionaries?.matchingProfile?.availabilities
        .filter((avail: Maybe<MatchingProfileAvailability>) => {
          if (data.availabilities?.time.length && data.availabilities.days.length) {
            return (
              data.availabilities.time.includes(avail?.from ?? '') &&
              data.availabilities.days.includes(avail?.day ?? '')
            );
          }

          if (data.availabilities?.time.length) {
            return data.availabilities.time.includes(avail?.from ?? '');
          }

          return data.availabilities?.days.includes(avail?.day ?? '');
        })
        .map((avail) => avail?.id ?? '');
    }

    const dataFilter = {
      studentId: getItemToLocalStorage('studentId', ''),
      energy,
      interests,
      gender,
      teachingStyles,
      availabilities,
    };

    try {
      const response = await createMatchingProfileForStudent({
        variables: { ...dataFilter, gender: gender || GenderType.Male },
      });

      if (response) {
        await refetchUser();
        localStorage.removeItem('questionnaire');
        navigate('/mentor-matches-list');
      }
    } catch (error) {
      notify((error as Error).message, 'error');
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
        // const [avail, availType] = name.split('.');
        const avail = name.split('.')[0] as 'availabilities';
        const availType = name.split('.')[1] as 'days' | 'time';

        if (avail === 'availabilities') {
          setCache((prev: Questionnaire & { step: number }) => {
            localStorage.setItem(
              'questionnaire',
              JSON.stringify({
                ...prev,
                [avail]: {
                  ...prev[avail],
                  [availType]: value[avail]?.[availType],
                },
              }),
            );
            return {
              ...prev,
              [avail]: {
                ...prev[avail],
                [availType]: value[avail]?.[availType],
              },
            };
          });
        }
      } else {
        setCache((prev) => {
          localStorage.setItem(
            'questionnaire',
            JSON.stringify({
              ...prev,
              [name as keyof Questionnaire]: value[name as keyof Questionnaire],
            }),
          );
          return { ...prev, [name as keyof Questionnaire]: value[name as keyof Questionnaire] };
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
              <EnergyLevel watch={watch} {...register('energy', { required: true })} />
              <Button
                onClick={() => setStep((step) => step + 1)}
                disabled={!watch('energy')}
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
                dictionaries={dictionaries as unknown as { matchingProfile: MatchingProfile }}
                watch={watch}
                {...register('interests', { required: true })}
              />
              <Button
                onClick={() => setStep((step) => step + 1)}
                disabled={!watch('interests')?.length}
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
                <Gender {...register('gender', { required: true })} watch={watch} />
              </div>
              <Button
                onClick={() => setStep((step) => step + 1)}
                disabled={!watch('gender')}
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
                dictionaries={dictionaries as unknown as { matchingProfile: MatchingProfile }}
                {...register('teachingStyles', { required: true })}
                watch={watch}
              />
              <Button
                onClick={() => setStep((step) => step + 1)}
                disabled={!watch('teachingStyles')?.length}
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

              <Button type="submit" disabled={!isValid} className="w-full h-[57px] mt-12">
                Next
              </Button>
            </>
          )}
        </form>
      </div>
    </>
  );
};

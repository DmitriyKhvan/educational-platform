import { useAuth } from '@/app/providers/auth-provider';
import ReactLoader from '@/components/common/loader';
import Button from '@/components/form/button';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Certificate,
  EnergyLevel,
  Interests,
  Specializations,
  TeachingPersonality,
} from '@/entities/questionnaire';

import notify from '@/shared/utils/notify';
import { useUpdateMatchingProfileMutation } from '@/shared/apollo/mutations/matching/updateMatchingProfile.generated';
import { useMatchingProfileQuery } from '@/shared/apollo/queries/matching/matchingProfile.generated';
import { useCreateMatchingProfileForMentorMutation } from '@/shared/apollo/mutations/matching/createMatchingProfileForMentor.generated';
import { type MatchingProfile, MentorEnergy } from '@/types/types.generated';
import type { Questionnaire } from '@/pages/students/questionnaire/ui/steps';

export const MatchingInfo = () => {
  const [t] = useTranslation(['common']);
  const { user, refetchUser } = useAuth();

  const {
    id: matchingId,
    energy,
    interests,
    teachingStyles,
    specializations,
    certifications,
  } = user?.matchingProfile || {};

  const { loading: matchingProfileLoading, data: dictionaries } = useMatchingProfileQuery();

  const [createMatchingProfileForMentor, { loading: createLoading }] =
    useCreateMatchingProfileForMentorMutation({
      fetchPolicy: 'network-only',
    });

  const [updateMatchingProfile, { loading: updateLoading }] = useUpdateMatchingProfileMutation({
    fetchPolicy: 'network-only',
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<Omit<Questionnaire, 'gender'>>({
    mode: 'all',
    values: {
      energy: energy ?? MentorEnergy.Calm,
      interests: interests?.map((int) => int?.id ?? '') || [],
      teachingStyles: teachingStyles?.map((tech) => tech?.id ?? '') || [],
      specializations: specializations?.map((spec) => spec?.id ?? '') || [],
      certifications: certifications?.map((cert) => cert?.id ?? '') || [],
    },
  });

  const handleEditMatchingInfo = async (data: Omit<Questionnaire, 'gender'>) => {
    if (matchingId) {
      await updateMatchingProfile({
        variables: {
          id: matchingId,
          ...data,
          availabilities: undefined,
        },
        onCompleted: () => {
          notify('Matching information is changed!');
        },
        onError: (error) => {
          notify(error.message, 'error');
        },
      });
    } else {
      await createMatchingProfileForMentor({
        variables: {
          mentorId: user?.mentor?.id ?? '',
          ...data,
        },
        onCompleted: () => {
          notify('Matching information is changed!');
        },
        onError: (error) => {
          notify(error.message, 'error');
        },
      });
    }

    await refetchUser();
  };

  if (matchingProfileLoading) {
    return <ReactLoader />;
  }

  return (
    <>
      {(createLoading || updateLoading) && <ReactLoader />}
      <form onSubmit={handleSubmit(handleEditMatchingInfo)}>
        <fieldset className="flex flex-col space-y-6">
          <legend className="text-[20px] font-bold text-color-dark-purple tracking-[-0.6px] leading-6">
            Information for student matching
          </legend>

          <div className="space-y-4">
            <h6 className="text-sm font-normal text-gray-400">Energy level</h6>
            <EnergyLevel {...register('energy', { required: true })} watch={watch} />
          </div>

          <div className="space-y-4">
            <h6 className="text-sm font-normal text-gray-400">Interests</h6>
            <Interests
              dictionaries={dictionaries as unknown as { matchingProfile: MatchingProfile }}
              watch={watch}
              className="justify-start"
              {...register('interests', { required: true })}
            />
          </div>

          <div className="space-y-4">
            <h6 className="text-sm font-normal text-gray-400">Teaching style</h6>
            <TeachingPersonality
              dictionaries={dictionaries as unknown as { matchingProfile: MatchingProfile }}
              className="justify-start"
              {...register('teachingStyles', { required: true })}
              watch={watch}
            />
          </div>

          <div className="space-y-4">
            <h6 className="text-sm font-normal text-gray-400">Expertise</h6>
            <Specializations
              className="justify-start"
              {...register('specializations', { required: true })}
              watch={watch}
            />
          </div>

          <div className="space-y-4">
            <h6 className="text-sm font-normal text-gray-400">Certificate</h6>
            <Certificate
              dictionaries={dictionaries as unknown as { matchingProfile: MatchingProfile }}
              className="justify-start"
              {...register('certifications')}
              setValue={setValue}
              watch={watch}
            />
          </div>

          <Button className="w-full mt-6" type="submit" disabled={!isValid}>
            {t('save')}
          </Button>
        </fieldset>
      </form>
    </>
  );
};

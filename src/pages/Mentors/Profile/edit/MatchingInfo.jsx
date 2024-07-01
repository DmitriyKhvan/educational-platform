import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/app/providers/AuthProvider';
import Button from 'src/components/Form/Button';
import ReactLoader from 'src/components/common/Loader';
import {
  EnergyLevel,
  Interests,
  TeachingPersonality,
} from 'src/entities/Questionnaire';
import { Certificate } from 'src/entities/Questionnaire/ui/Certificate';
import { CREATE_MATCHING_PROFILE_FOR_MENTOR } from 'src/shared/apollo/mutations/matching/createMatchingProfileForMentor';
import { MATCHING_PROFILE } from 'src/shared/apollo/queries/matching/matchingProfile';

export const MatchingInfo = () => {
  const [t] = useTranslation(['common']);
  const { user } = useAuth();

  const { loading: matchingProfileLoading, data: dictionaries } =
    useQuery(MATCHING_PROFILE);
  const [createMatchingProfileForMentor, { loading }] = useMutation(
    CREATE_MATCHING_PROFILE_FOR_MENTOR,
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      energy: '',
      interests: [],
      teachingStyles: '',
      certificate: [],
    },
  });

  const handleEditMatchingInfo = (data) => {
    createMatchingProfileForMentor({
      variables: {
        mentorId: user.mentor.id,
        ...data,
      },
    });
  };

  if (matchingProfileLoading) {
    return <ReactLoader />;
  }

  return (
    <>
      {loading && <ReactLoader />}
      <form onSubmit={handleSubmit(handleEditMatchingInfo)}>
        <fieldset className="flex flex-col space-y-6">
          <legend className="text-[20px] font-bold text-color-dark-purple tracking-[-0.6px] leading-6">
            Information for student matching
          </legend>

          <div className="space-y-4">
            <h6 className="text-sm font-normal text-gray-400">Energy level</h6>
            <EnergyLevel
              {...register('energy', { required: true })}
              watch={watch}
            />
          </div>

          <div className="space-y-4">
            <h6 className="text-sm font-normal text-gray-400">Interests</h6>
            <Interests
              dictionaries={dictionaries}
              watch={watch}
              className="justify-start"
              {...register('interests', { required: true })}
            />
          </div>

          <div className="space-y-4">
            <h6 className="text-sm font-normal text-gray-400">
              Teaching style
            </h6>
            <TeachingPersonality
              dictionaries={dictionaries}
              className="justify-start"
              {...register('teachingStyles', { required: true })}
              watch={watch}
            />
          </div>

          <div className="space-y-4">
            <h6 className="text-sm font-normal text-gray-400">Certificate</h6>
            <Certificate
              className="justify-start"
              {...register('certificate')}
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

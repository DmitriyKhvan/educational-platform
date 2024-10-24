import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/app/providers/AuthProvider';
import Button from 'src/components/Form/Button';
import ReactLoader from 'src/components/common/Loader';
import {
  Certificate,
  EnergyLevel,
  Interests,
  Specializations,
  TeachingPersonality,
} from 'src/entities/Questionnaire';
import { CREATE_MATCHING_PROFILE_FOR_MENTOR } from 'src/shared/apollo/mutations/matching/createMatchingProfileForMentor';
import { UPDATE_MATCHING_PROFILE } from 'src/shared/apollo/mutations/matching/updateMatchingProfile';

import { MATCHING_PROFILE } from 'src/shared/apollo/queries/matching/matchingProfile';
import notify from 'src/shared/utils/notify';

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
  } = user.matchingProfile || {};

  const { loading: matchingProfileLoading, data: dictionaries } =
    useQuery(MATCHING_PROFILE);

  const [createMatchingProfileForMentor, { loading: createLoading }] =
    useMutation(CREATE_MATCHING_PROFILE_FOR_MENTOR, {
      fetchPolicy: 'network-only',
    });

  const [updateMatchingProfile, { loading: updateLoading }] = useMutation(
    UPDATE_MATCHING_PROFILE,
    {
      fetchPolicy: 'network-only',
    },
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    values: {
      energy: energy || '',
      interests: interests?.map((int) => int.id) || [],
      teachingStyles: teachingStyles?.map((tech) => tech.id) || [],
      specializations: specializations?.map((spec) => spec.id) || [],
      certifications: certifications?.map((cert) => cert.id) || [],
    },
  });

  const handleEditMatchingInfo = async (data) => {
    if (matchingId) {
      await updateMatchingProfile({
        variables: {
          id: matchingId,
          ...data,
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
          mentorId: user.mentor.id,
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
              dictionaries={dictionaries}
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

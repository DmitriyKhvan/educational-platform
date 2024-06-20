import { useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Button from 'src/components/Form/Button';
import ReactLoader from 'src/components/common/Loader';
import {
  EnergyLevel,
  Interests,
  TeachingPersonality,
} from 'src/entities/Questionnaire';
import { Certificate } from 'src/entities/Questionnaire/ui/Certificate';
import { MUTATION_UPDATE_MENTOR } from 'src/shared/apollo/graphql';

export const MatchingInfo = () => {
  const [t] = useTranslation(['common']);
  const [updateMentor, { loading }] = useMutation(MUTATION_UPDATE_MENTOR);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      energyLevel: '',
      interests: [],
      teachingPersonality: '',
      certificate: [],
    },
  });

  const handleEditMatchingInfo = (data) => {
    if (data) {
      console.log('data', data);
      return;
    }
    updateMentor();
  };

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
              {...register('energyLevel', { required: true })}
              watch={watch}
            />
          </div>

          <div className="space-y-4">
            <h6 className="text-sm font-normal text-gray-400">Interests</h6>
            <Interests
              className="justify-start"
              {...register('interests', { required: true })}
              watch={watch}
            />
          </div>

          <div className="space-y-4">
            <h6 className="text-sm font-normal text-gray-400">
              Teaching style
            </h6>
            <TeachingPersonality
              className="justify-start"
              {...register('teachingPersonality', { required: true })}
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

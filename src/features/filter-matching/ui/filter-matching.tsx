import { type FC, useEffect, useState } from 'react';
// import { BsFillGridFill } from 'react-icons/bs';
// import { FaList } from 'react-icons/fa6';
import { IoFilter } from 'react-icons/io5';

import {
  Days,
  EnergyLevel,
  Gender,
  Interests,
  Specializations,
  TeachingPersonality,
  Time,
} from '@/entities/questionnaire';
import { useForm } from 'react-hook-form';
import { Certificate } from '@/entities/questionnaire/ui/certificate';
import { TitleFilter } from './title-filter';

import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { useNavigate } from 'react-router-dom';
import notify from '@/shared/utils/notify';
import MyDropdownMenu from '@/components/dropdown-menu';
import Button from '@/components/form/button';
import { useAuth } from '@/app/providers/auth-provider';
import { useMatchingProfileQuery } from '@/shared/apollo/queries/matching/matchingProfile.generated';
import { useUpdateMatchingProfileMutation } from '@/shared/apollo/mutations/matching/updateMatchingProfile.generated';
import { GenderType, MentorEnergy, type MatchingProfile } from '@/types/types.generated';
import type { Questionnaire } from '@/pages/students/questionnaire/ui/steps';
import { Badge } from '@/components/badge';

interface FilterMatchingProps {
  findMatches: () => void;
  // setViewMentorList: Dispatch<SetStateAction<'list' | 'grid'>>;
  // viewMentorList: string;
}

export const FilterMatching: FC<FilterMatchingProps> = ({
  findMatches,
  // setViewMentorList,
  // viewMentorList,
}) => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const {
    id: matchingId,
    energy,
    interests,
    teachingStyles,
    certifications,
    specializations,
    gender,
    availabilities: avails,
  } = user?.matchingProfile || {};

  const [countFilter, setCountFilter] = useState(0);
  const [availabilities, setAvailabilities] = useState(avails?.map((item) => item?.id) || []);

  const timesSet = new Set();
  const daysSet = new Set();

  for (const avail of avails ?? []) {
    timesSet.add(avail?.from);
    daysSet.add(avail?.day);
  }

  const parseAvails: Questionnaire['availabilities'] = {
    time: Array.from(timesSet) as string[],
    days: Array.from(daysSet) as string[],
  };

  const { data: dictionaries } = useMatchingProfileQuery({
    // fetchPolicy: 'network-only',
    fetchPolicy: 'no-cache',
  });

  const [updateMatchingProfile] = useUpdateMatchingProfileMutation({
    fetchPolicy: 'network-only',
  });

  const {
    register,
    setValue,
    // handleSubmit,
    watch,
    // formState: { isValid },
  } = useForm<Questionnaire>({
    mode: 'all',
    values: {
      energy: energy ?? MentorEnergy.Calm,
      interests: interests?.map((int) => int?.id ?? '') || [],
      gender: gender ?? GenderType.Male,
      teachingStyles: teachingStyles?.map((tech) => tech?.id ?? '') || [],
      // availabilities: {
      //   time: [],
      //   days: [],
      // },
      availabilities: parseAvails,
      certifications: certifications?.map((cert) => cert?.id ?? '') || [],
      specializations: specializations?.map((spec) => spec?.id ?? '') || [],
    },
  });

  useEffect(() => {
    let count = 0;
    if (interests && interests.length > 0) count++;
    if (teachingStyles && teachingStyles.length > 0) count++;
    if (certifications && certifications.length > 0) count++;
    if (specializations && specializations.length > 0) count++;
    if (avails && avails.length > 0) count++;
    // if (energy && energy.length > 0) count++;
    // if (gender) count++;
    setCountFilter(count);
  }, []);

  useEffect(() => {
    let newAvailabilities: string[] = [];
    const subscription = watch(async (value, { name }) => {
      if (name === 'availabilities.time' || name === 'availabilities.days') {
        const newTime = value.availabilities?.time;
        const newDays = value.availabilities?.days;

        if (dictionaries?.matchingProfile?.availabilities) {
          newAvailabilities = dictionaries?.matchingProfile?.availabilities
            .filter((avail) => {
              if (newTime?.length && newDays?.length) {
                return newTime.includes(avail?.from ?? '') && newDays.includes(avail?.day ?? '');
              }

              if (newTime?.length) {
                return newTime?.includes(avail?.from ?? '');
              }

              return newDays?.includes(avail?.day ?? '');
            })
            .map((avail) => avail?.id ?? '');
        }

        setAvailabilities(newAvailabilities);
      }

      try {
        if (matchingId) {
          const response = await updateMatchingProfile({
            variables: {
              id: matchingId,
              ...(value as Questionnaire),
              availabilities: newAvailabilities,
            },
          });

          if (response) {
            await findMatches();
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          notify(error.message, 'error');
        }
      }

      let count = 0;
      if (value.interests && value.interests.length > 0) count++;
      if (value.teachingStyles && value.teachingStyles.length > 0) count++;
      if (value.certifications && value.certifications.length > 0) count++;
      if (value.specializations && value.specializations.length > 0) count++;
      if (newAvailabilities && newAvailabilities.length > 0) count++;
      // if (energy && energy.length > 0) count++;
      // if (gender) count++;
      setCountFilter(count);
    });

    return () => subscription.unsubscribe();
  }, [watch, dictionaries]);

  return (
    <>
      {matchingId ? (
        <MyDropdownMenu
          align="end"
          button={
            <Button
              theme="clear"
              className="relative h-12 w-12 p-0 rounded-lg border border-gray-200"
            >
              <IoFilter className="text-xl" />
              <Badge count={countFilter} className="bg-color-purple" />
            </Button>
          }
        >
          <div className="w-[320px] max-h-[600px] overflow-auto rounded-lg border border-gray-100 shadow-[0px_0px_16px_0px_rgba(0,_0,_0,_0.12)">
            {/* <div className="flex items-center justify-between p-4 border-b">
              <span className="text-[15px] font-bold">Page view</span>
              <div className="flex gap-5">
                <FaList
                  onClick={() => setViewMentorList('list')}
                  className={`text-2xl cursor-pointer ${
                    viewMentorList === 'list' ? 'text-color-purple' : 'text-gray-300'
                  }`}
                />
                <BsFillGridFill
                  onClick={() => setViewMentorList('grid')}
                  className={`text-2xl cursor-pointer ${
                    viewMentorList === 'grid' ? 'text-color-purple' : 'text-gray-300'
                  }`}
                />
              </div>
            </div> */}

            <AccordionRoot type="single">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-[15px] font-bold">
                  <TitleFilter count={availabilities?.length} title="Preferable time and days" />
                </AccordionTrigger>
                <AccordionContent>
                  <Time watch={watch} {...register('availabilities.time')} />
                  <Days watch={watch} {...register('availabilities.days')} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-[15px] font-bold">
                  <TitleFilter count={watch('specializations')?.length} title="Specialization" />
                </AccordionTrigger>
                <AccordionContent>
                  <Specializations
                    {...register('specializations', { required: true })}
                    watch={watch}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-[15px] font-bold">
                  <TitleFilter count={watch('certifications')?.length} title="Certification" />
                </AccordionTrigger>
                <AccordionContent>
                  <Certificate
                    dictionaries={dictionaries as unknown as { matchingProfile: MatchingProfile }}
                    watch={watch}
                    setValue={setValue}
                    {...register('certifications')}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-[15px] font-bold">Energy level</AccordionTrigger>
                <AccordionContent>
                  <EnergyLevel watch={watch} {...register('energy')} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-[15px] font-bold">
                  <TitleFilter count={watch('interests')?.length} title="Interests" />
                </AccordionTrigger>
                <AccordionContent>
                  <Interests
                    dictionaries={dictionaries as unknown as { matchingProfile: MatchingProfile }}
                    watch={watch}
                    {...register('interests')}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-[15px] font-bold">Gender</AccordionTrigger>
                <AccordionContent className="p-0">
                  <Gender
                    className="border-0 last:border-none shadow-none border-b rounded-none border-gray-200 hover:border-gray-200 flex-row-reverse justify-between  pl-6 pr-4"
                    {...register('gender')}
                    watch={watch}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-[15px] font-bold">
                  <TitleFilter count={watch('teachingStyles')?.length} title="Teaching style" />
                </AccordionTrigger>
                <AccordionContent>
                  <TeachingPersonality
                    dictionaries={dictionaries as unknown as { matchingProfile: MatchingProfile }}
                    {...register('teachingStyles')}
                    watch={watch}
                  />
                </AccordionContent>
              </AccordionItem>
            </AccordionRoot>
          </div>
        </MyDropdownMenu>
      ) : (
        <Button
          theme="clear"
          className="h-12 w-12 p-0 rounded-lg border border-gray-200"
          onClick={() => navigate('/questionnaire')}
        >
          <IoFilter className="text-xl" />
        </Button>
      )}
    </>
  );
};

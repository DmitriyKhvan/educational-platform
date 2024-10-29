import { type Dispatch, type FC, type SetStateAction, useEffect, useState } from 'react';
import { BsFillGridFill } from 'react-icons/bs';
import { FaList } from 'react-icons/fa6';
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
import type { MatchingProfile } from '@/types/types.generated';
import { Questionnaire } from '@/pages/students/questionnaire/ui/steps';

interface FilterMatchingProps {
  findMatches: () => void;
  setViewMentorList: Dispatch<SetStateAction<'list' | 'grid'>>;
  viewMentorList: string;
}

export const FilterMatching: FC<FilterMatchingProps> = ({
  findMatches,
  setViewMentorList,
  viewMentorList,
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

  const [availabilities, setAvailabilities] = useState(avails?.map((item) => item?.id) || []);

  const timesSet = new Set();
  const daysSet = new Set();

  avails?.forEach((avail) => {
    timesSet.add(avail.from);
    daysSet.add(avail.day);
  });

  const parseAvails = {
    time: Array.from(timesSet),
    days: Array.from(daysSet),
  };

  const { data: dictionaries } = useMatchingProfileQuery({
    // fetchPolicy: 'network-only',
    fetchPolicy: 'no-cache',
  });

  const [updateMatchingProfile] = useUpdateMatchingProfileMutation({
    fetchPolicy: 'network-only',
  });

  const parseData = (data) => {
    return data?.map((item) => item.id);
  };

  const {
    register,
    setValue,
    // handleSubmit,
    watch,
    // formState: { isValid },
  } = useForm<Questionnaire>({
    mode: 'all',
    values: {
      energy,
      interests: parseData(interests),
      gender,
      teachingStyles: parseData(teachingStyles),
      // availabilities: {
      //   time: [],
      //   days: [],
      // },
      availabilities: parseAvails,
      certifications: parseData(certifications) || [],
      specializations: parseData(specializations) || [],
    },
  });

  useEffect(() => {
    let newAvailabilities;
    const subscription = watch(async (value, { name }) => {
      if (name === 'availabilities.time' || name === 'availabilities.days') {
        const newTime = value.availabilities?.time;
        const newDays = value.availabilities?.days;

        newAvailabilities = dictionaries?.matchingProfile?.availabilities
          .filter((avail) => {
            if (newTime?.length && newDays?.length) {
              return newTime.includes(avail?.from) && newDays.includes(avail?.day);
            } else if (newTime?.length) {
              return newTime?.includes(avail?.from);
            } else {
              return newDays?.includes(avail?.day);
            }
          })
          .map((avail) => avail?.id);
        setAvailabilities(newAvailabilities);
      }

      try {
        const response = await updateMatchingProfile({
          variables: {
            id: matchingId,
            ...value,
            availabilities: newAvailabilities,
          },
        });

        if (response) {
          await findMatches();
        }
      } catch (error) {
        notify(error.message, 'error');
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, dictionaries]);

  return (
    <>
      {matchingId ? (
        <MyDropdownMenu
          align="end"
          button={
            <Button theme="clear" className="h-12 w-12 p-0 rounded-lg border border-gray-200">
              <IoFilter className="text-xl" />
            </Button>
          }
        >
          <div className="w-[320px] max-h-[600px] overflow-auto rounded-lg border border-gray-100 shadow-[0px_0px_16px_0px_rgba(0,_0,_0,_0.12)">
            <div className="flex items-center justify-between p-4 border-b">
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
            </div>

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

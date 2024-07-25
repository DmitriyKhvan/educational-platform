import React, { useEffect, useState } from 'react';
import { BsFillGridFill } from 'react-icons/bs';
import { FaList } from 'react-icons/fa6';
import { IoFilter } from 'react-icons/io5';
import MyDropdownMenu from 'src/components/DropdownMenu';
import Button from 'src/components/Form/Button';

import {
  Days,
  EnergyLevel,
  Gender,
  Interests,
  TeachingPersonality,
  Time,
} from 'src/entities/Questionnaire';
import { useForm } from 'react-hook-form';
import { Certificate } from 'src/entities/Questionnaire/ui/Certificate';
import { useMutation, useQuery } from '@apollo/client';
import { MATCHING_PROFILE } from 'src/shared/apollo/queries/matching/matchingProfile';
import { TitleFilter } from './TitleFilter';
import { UPDATE_MATCHING_PROFILE } from 'src/shared/apollo/mutations/matching/updateMatchingProfile';
import { useAuth } from 'src/app/providers/AuthProvider';
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from 'src/shared/ui/Accordion';
import { useNavigate } from 'react-router-dom';

export const FilterMatching = ({
  findMatches,
  setViewMentorList,
  viewMentorList,
}) => {
  const navigate = useNavigate();

  const [availabilities, setAvailabilities] = useState([]);
  const { user } = useAuth();
  const {
    id: matchingId,
    energy,
    interests,
    teachingStyles,
    certifications,
    gender,
    availabilities: avails,
  } = user.matchingProfile || {};

  console.log('avails', avails);

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

  console.log('parseAvails', parseAvails);

  const { data: dictionaries } = useQuery(MATCHING_PROFILE);
  const [updateMatchingProfile] = useMutation(UPDATE_MATCHING_PROFILE, {
    fetchPolicy: 'network-only',
  });

  const parseData = (data) => {
    return data?.map((item) => item.id);
  };

  const [time, setTime] = useState([]);
  const [days, setDays] = useState([]);

  const {
    register,
    setValue,
    // handleSubmit,
    watch,
    // formState: { isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
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
    },
  });

  useEffect(() => {
    if (dictionaries && matchingId) {
      let newAvailabilities = availabilities;
      const newTime = watch('availabilities.time');
      const newDays = watch('availabilities.days');
      // if (watch('availabilities.days') || watch('availabilities.time')) {
      if (
        time.toString() !== newTime.toString() ||
        days.toString() !== newDays.toString()
      ) {
        setTime(newTime);
        setDays(newDays);

        newAvailabilities = dictionaries?.matchingProfile?.availabilities
          .filter((avail) => {
            if (
              watch('availabilities.time').length &&
              watch('availabilities.days').length
            ) {
              return (
                watch('availabilities.time').includes(avail.from) &&
                watch('availabilities.days').includes(avail.day)
              );
            } else if (watch('availabilities.time').length) {
              return watch('availabilities.time').includes(avail.from);
            } else {
              return watch('availabilities.days').includes(avail.day);
            }
          })
          .map((avail) => avail.id);

        setAvailabilities(newAvailabilities);
      }

      const data = {
        energy: watch('energy'),
        interests: watch('interests'),
        teachingStyles: watch('teachingStyles'),
        availabilities: newAvailabilities,
      };

      updateMatchingProfile({
        variables: { id: matchingId, ...data },
        onCompleted: () => {
          findMatches({
            variables: {
              matchingProfileId: matchingId,
            },
          });
        },
      });
    }
  }, [
    watch('interests')?.toString(),
    watch('teachingStyles')?.toString(),
    watch('sertifications')?.toString(),
    watch('energy'),
    watch('availabilities.days')?.toString(),
    watch('availabilities.time')?.toString(),
    dictionaries?.toString(),
  ]);

  return (
    <>
      {matchingId ? (
        <MyDropdownMenu
          align="end"
          button={
            <Button
              theme="clear"
              className="h-12 w-12 p-0 rounded-lg border border-gray-200"
            >
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
                    viewMentorList === 'list'
                      ? 'text-color-purple'
                      : 'text-gray-300'
                  }`}
                />
                <BsFillGridFill
                  onClick={() => setViewMentorList('grid')}
                  className={`text-2xl cursor-pointer ${
                    viewMentorList === 'grid'
                      ? 'text-color-purple'
                      : 'text-gray-300'
                  }`}
                />
              </div>
            </div>

            <AccordionRoot>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-[15px] font-bold">
                  <TitleFilter
                    count={availabilities?.length}
                    title="Preferable time and days"
                  />
                </AccordionTrigger>
                <AccordionContent>
                  <Time watch={watch} {...register('availabilities.time')} />
                  <Days watch={watch} {...register('availabilities.days')} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-[15px] font-bold">
                  <TitleFilter
                    count={watch('certifications')?.length}
                    title="Certification"
                  />
                </AccordionTrigger>
                <AccordionContent>
                  <Certificate
                    dictionaries={dictionaries}
                    watch={watch}
                    setValue={setValue}
                    {...register('certifications')}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-[15px] font-bold">
                  Energy level
                </AccordionTrigger>
                <AccordionContent>
                  <EnergyLevel watch={watch} {...register('energy')} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-[15px] font-bold">
                  <TitleFilter
                    count={watch('interests')?.length}
                    title="Interests"
                  />
                </AccordionTrigger>
                <AccordionContent>
                  <Interests
                    dictionaries={dictionaries}
                    watch={watch}
                    {...register('interests')}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-[15px] font-bold">
                  Gender
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <Gender
                    className="border-0 last:border-none shadow-none border-b rounded-none border-gray-200 hover:border-gray-200 flex-row-reverse justify-between  pl-6 pr-4"
                    {...register('gender')}
                    watch={watch}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-[15px] font-bold">
                  <TitleFilter
                    count={watch('teachingStyles')?.length}
                    title="Teaching style"
                  />
                </AccordionTrigger>
                <AccordionContent>
                  <TeachingPersonality
                    dictionaries={dictionaries}
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

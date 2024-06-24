import React, { forwardRef, useEffect, useState } from 'react';
import { BsFillGridFill } from 'react-icons/bs';
import { FaAngleUp, FaList } from 'react-icons/fa6';
import { IoFilter } from 'react-icons/io5';
import MyDropdownMenu from 'src/components/DropdownMenu';
import Button from 'src/components/Form/Button';

import * as Accordion from '@radix-ui/react-accordion';
import { cn } from 'src/shared/utils/functions';
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
import { useQuery } from '@apollo/client';
import { MATCHING_PROFILE } from 'src/shared/apollo/queries/matching/matchingProfile';
import { TitleFilter } from './TitleFilter';

const AccordionItem = forwardRef(function AccordionItem(
  { children, className, ...props },
  forwardedRef,
) {
  return (
    <Accordion.Item
      className={cn(
        'mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Item>
  );
});

const AccordionTrigger = forwardRef(function AccordionTrigger(
  { children, className, ...props },
  forwardedRef,
) {
  return (
    <Accordion.Header className="flex">
      <Accordion.Trigger
        className={cn(
          'hover:bg-gray-50 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none border-b outline-none',
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <FaAngleUp
          className="ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </Accordion.Trigger>
    </Accordion.Header>
  );
});

const AccordionContent = forwardRef(function AccordionContent(
  { children, className, ...props },
  forwardedRef,
) {
  return (
    <Accordion.Content
      className={cn(
        'p-4 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px] border-b',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Content>
  );
});

export const FilterMatching = ({ setViewMentorList, viewMentorList }) => {
  const { data: dictionaries } = useQuery(MATCHING_PROFILE);
  const [availabilities, setAvailabilities] = useState([]);

  const {
    register,
    setValue,
    // handleSubmit,
    watch,
    // formState: { isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      energy: '',
      interests: [],
      gender: '',
      teachingStyles: '',
      availabilities: {
        time: [],
        days: [],
      },
      certificate: [],
    },
  });

  useEffect(() => {
    if (
      (watch('availabilities.days') || watch('availabilities.days')) &&
      dictionaries
    ) {
      const availabilities = dictionaries.matchingProfile.availabilities
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

      console.log('availabilities', availabilities);

      setAvailabilities(availabilities);

      const data = {
        energy: watch('energy'),
        interests: watch('interests'),
        teachingStyles: watch('teachingStyles'),
        availabilities,
      };

      console.log('data', data);
    }
  }, [watch('availabilities.days'), watch('availabilities.time')]);

  useEffect(() => {
    const data = {
      energy: watch('energy'),
      interests: watch('interests'),
      teachingStyles: watch('teachingStyles'),
      availabilities,
    };

    console.log('data', data);
  }, [watch('interests'), watch('teachingStyles'), watch('energy')]);

  return (
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

        <Accordion.Root
          className="w-full"
          type="single"
          defaultValue="item-1"
          collapsible
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-[15px] font-bold">
              <TitleFilter
                count={availabilities.length}
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
                count={watch('certificate').length}
                title="Certification"
              />
            </AccordionTrigger>
            <AccordionContent>
              <Certificate
                watch={watch}
                setValue={setValue}
                {...register('certificate')}
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
                count={watch('interests').length}
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
                count={watch('teachingStyles').length}
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
        </Accordion.Root>
      </div>
    </MyDropdownMenu>
  );
};

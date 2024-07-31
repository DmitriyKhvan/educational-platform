import { MentorAvailabilityType } from '@/shared/constants/global';
import { useEffect, useState } from 'react';

import { useAuth } from '@/app/providers/auth-provider';
import Loader from '@/components/loader/loader';
import { AcceptingStudents } from '@/pages/mentors/accepting-students';
import { AvailabilityExceptions } from '@/pages/mentors/availability-exceptions';
import { AvailabilitySlots } from '@/pages/mentors/availability/availability-slots';
import { Tab } from '@/pages/mentors/availability/tab';
import type { AvailabilitySlot, GatherAvailabilities } from '@/types';
import type { Query, Timesheet } from '@/types/types.generated';
import { useQuery } from '@apollo/client';
import { v4 as uuid } from 'uuid';
import { MENTOR } from '@/shared/apollo/queries/mentors/mentor';

export const AvailabilityList = () => {
  const { user } = useAuth();
  const [mentorAvailabilityType, setMentorAvailabilityType] = useState<MentorAvailabilityType>();
  const [error, setError] = useState<Error | null>(null);

  const {
    data: { mentor: mentorInfo } = {},
    loading: loadingMentor,
    refetch: refetchMentor,
  } = useQuery<Query>(MENTOR, {
    fetchPolicy: 'no-cache',
    variables: { id: user?.mentor?.id },
  });

  const [gatherAvailabilities, setGatherAvailabilities] = useState<GatherAvailabilities>({
    [MentorAvailabilityType.ONLY_REGULAR]: [],
    [MentorAvailabilityType.ONLY_TRIAL]: [],
    [MentorAvailabilityType.REGULAR_AND_TRIAL]: [], // это надо удалить, и поправить типы
  });

  const initializeAvailabilities = (
    availabilities: Timesheet[],
    mentorAvailabilityType: MentorAvailabilityType,
  ) => {
    const parseAvailabilities = availabilities.map((slot) => {
      return {
        id: uuid(),
        day: slot?.day,
        slots: [slot],
      };
    });

    setGatherAvailabilities((gatherAvailabilities) => {
      return {
        ...gatherAvailabilities,
        [mentorAvailabilityType]: parseAvailabilities,
      };
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (mentorInfo) {
      const mentorType =
        mentorInfo.mentorAvailability === MentorAvailabilityType.ONLY_REGULAR ||
        mentorInfo.mentorAvailability === MentorAvailabilityType.REGULAR_AND_TRIAL
          ? MentorAvailabilityType.ONLY_REGULAR
          : MentorAvailabilityType.ONLY_TRIAL;

      setMentorAvailabilityType(mentorType);
    }

    const regularAvailabilities = mentorInfo?.availabilities?.filter(
      (avail) => avail?.isTrial === false,
    );

    const trialAvailabilities = mentorInfo?.availabilities?.filter(
      (avail) => avail?.isTrial === true,
    );

    if (regularAvailabilities?.length) {
      initializeAvailabilities(
        regularAvailabilities as Timesheet[],
        MentorAvailabilityType.ONLY_REGULAR,
      );
    }

    if (trialAvailabilities?.length) {
      initializeAvailabilities(
        trialAvailabilities as Timesheet[],
        MentorAvailabilityType.ONLY_TRIAL,
      );
    }
  }, [mentorInfo, error]);

  const useSetGatherAvailabilities = (data: AvailabilitySlot[]) => {
    setGatherAvailabilities((prevGatherAvailabilities) => ({
      ...prevGatherAvailabilities,
      [mentorAvailabilityType as MentorAvailabilityType]: data,
    }));
  };

  if (loadingMentor) {
    return <Loader height="calc(100vh - 80px)" />;
  }

  return (
    <>
      <div className="relative w-full flex items-center after:content-[''] after:absolute after:bottom-0 after:w-full after:h-[2px] after:bg-gray-100 after:-z-10">
        {mentorInfo?.mentorAvailability === MentorAvailabilityType.REGULAR_AND_TRIAL ? (
          <>
            <Tab
              active={mentorAvailabilityType === MentorAvailabilityType.ONLY_REGULAR}
              onClick={() => setMentorAvailabilityType(MentorAvailabilityType.ONLY_REGULAR)}
            >
              Regular Students
            </Tab>

            <Tab
              active={mentorAvailabilityType === MentorAvailabilityType.ONLY_TRIAL}
              onClick={() => setMentorAvailabilityType(MentorAvailabilityType.ONLY_TRIAL)}
            >
              Trial Students
            </Tab>
          </>
        ) : mentorInfo?.mentorAvailability === MentorAvailabilityType.ONLY_TRIAL ? (
          <Tab
            active={mentorAvailabilityType === MentorAvailabilityType.ONLY_TRIAL}
            onClick={() => setMentorAvailabilityType(MentorAvailabilityType.ONLY_TRIAL)}
          >
            Trial Students
          </Tab>
        ) : null}
      </div>

      {mentorAvailabilityType === MentorAvailabilityType.ONLY_REGULAR && <AcceptingStudents />}

      <div className="flex flex-wrap gap-6">
        {mentorInfo && (
          <AvailabilitySlots
            mentorInfo={mentorInfo}
            gatherAvailabilities={gatherAvailabilities}
            mentorAvailabilityType={mentorAvailabilityType}
            useSetGatherAvailabilities={useSetGatherAvailabilities}
            refetchMentor={refetchMentor}
            setError={setError}
          />
        )}
        <AvailabilityExceptions mentor={mentorInfo} refetchMentor={refetchMentor} />
      </div>
    </>
  );
};

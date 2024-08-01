import { MentorAvailabilityType } from '@/shared/constants/global';
import { useEffect, useState } from 'react';

import { useAuth } from '@/app/providers/auth-provider';
import Loader from '@/components/loader/loader';
import { AcceptingStudents } from '@/pages/mentors/accepting-students';
// import { AvailabilityExceptions } from '@/pages/mentors/availability-exceptions';
import { AvailabilitySlots } from '@/pages/mentors/availability/availability-slots';
import { Tab } from '@/pages/mentors/availability/tab';
import type { GatherAvailabilities } from '@/types';
import type { Timesheet, TimesheetSlot } from '@/types/types.generated';
// import { v4 as uuid } from 'uuid';
import { format, toZonedTime } from 'date-fns-tz';
import { useMentorQuery } from '@/shared/apollo/queries/mentors/mentor.generated';

export const AvailabilityList = () => {
  const { user } = useAuth();
  const userTimezone = user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [mentorAvailabilityType, setMentorAvailabilityType] = useState<MentorAvailabilityType>();
  const [error, setError] = useState<Error | null>(null);

  const {
    data: { mentor: mentorInfo } = {},
    loading: loadingMentor,
    refetch: refetchMentor,
  } = useMentorQuery({
    fetchPolicy: 'no-cache',
    variables: { id: user?.mentor?.id ?? '' },
  });

  const [gatherAvailabilities, setGatherAvailabilities] = useState<GatherAvailabilities>({
    [MentorAvailabilityType.ONLY_REGULAR]: [],
    [MentorAvailabilityType.ONLY_TRIAL]: [],
  });

  const parseAvailabilities = (avail: Timesheet) => {
    const { id, day, from, to, isTrial } = avail;
    return {
      id,
      day,
      // from,
      // to,
      from: format(toZonedTime(new Date(`1970-01-01T${from}:00Z`), userTimezone), 'HH:mm', {
        timeZone: userTimezone,
      }),
      to: format(toZonedTime(new Date(`1970-01-01T${to}:00Z`), userTimezone), 'HH:mm', {
        timeZone: userTimezone,
      }),
      isTrial,
    };
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

    const regularAvailabilities = mentorInfo?.availabilities
      ?.filter((avail) => avail?.isTrial === false)
      ?.map((avail) => (avail ? parseAvailabilities(avail) : null));

    const trialAvailabilities = mentorInfo?.availabilities
      ?.filter((avail) => avail?.isTrial === true)
      ?.map((avail) => (avail ? parseAvailabilities(avail) : null));

    if (regularAvailabilities?.length) {
      setGatherAvailabilities((prevGatherAvailabilities) => {
        return {
          ...prevGatherAvailabilities,
          [MentorAvailabilityType.ONLY_REGULAR]: regularAvailabilities as TimesheetSlot[],
        };
      });
    }

    if (trialAvailabilities?.length) {
      setGatherAvailabilities((prevGatherAvailabilities) => {
        return {
          ...prevGatherAvailabilities,
          [MentorAvailabilityType.ONLY_TRIAL]: trialAvailabilities as TimesheetSlot[],
        };
      });
    }
  }, [mentorInfo, error]);

  const useSetGatherAvailabilities = (data: TimesheetSlot[]) => {
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
        {/* <AvailabilityExceptions mentor={mentorInfo} refetchMentor={refetchMentor} /> */}
      </div>
    </>
  );
};

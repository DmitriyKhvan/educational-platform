import { MentorAvailabilityType } from '@/shared/constants/global';
import { useEffect, useState } from 'react';

import { useAuth } from '@/app/providers/auth-provider';
import Loader from '@/components/loader/loader';
import { AcceptingStudents } from '@/pages/mentors/accepting-students';
import { AvailabilityExceptions } from '@/pages/mentors/availability-exceptions';
import { AvailabilitySlots } from '@/pages/mentors/availability/availability-slots';
import { Tab } from '@/pages/mentors/availability/tab';
import { useMentorQuery } from '@/shared/apollo/queries/mentors/mentor.generated';
import type { GatherAvailabilities } from '@/types';
import type { Mentor, Timesheet, TimesheetSlot } from '@/types/types.generated';

export const AvailabilityList = () => {
  const { user } = useAuth();

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

  const [startAvailabilities, setStartAvailabilities] = useState<TimesheetSlot[]>([]);

  const [gatherAvailabilities, setGatherAvailabilities] = useState<GatherAvailabilities>({
    [MentorAvailabilityType.ONLY_REGULAR]: [],
    [MentorAvailabilityType.ONLY_TRIAL]: [],
  });

  const parseAvailabilities = (avail: Timesheet) => {
    const { id, day, from, to, isTrial } = avail;

    return {
      id,
      day: day || '',
      from: from || '',
      to: to || '',
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

      const regularAvailabilities: TimesheetSlot[] = [];
      const trialAvailabilities: TimesheetSlot[] = [];
      const startAvailabilities: TimesheetSlot[] = [];

      for (const avail of mentorInfo?.availabilities || []) {
        const parseAvail = avail && parseAvailabilities(avail);

        if (parseAvail) {
          startAvailabilities.push(parseAvail);

          if (avail?.isTrial) {
            trialAvailabilities.push(parseAvail);
          } else {
            regularAvailabilities.push(parseAvail);
          }
        }
      }

      setStartAvailabilities(startAvailabilities);

      setGatherAvailabilities((prevGatherAvailabilities) => {
        return {
          ...prevGatherAvailabilities,
          [MentorAvailabilityType.ONLY_REGULAR]: regularAvailabilities as TimesheetSlot[],
        };
      });

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
            startAvailabilities={startAvailabilities}
            gatherAvailabilities={gatherAvailabilities}
            mentorAvailabilityType={mentorAvailabilityType}
            useSetGatherAvailabilities={useSetGatherAvailabilities}
            refetchMentor={refetchMentor}
            setError={setError}
          />
        )}
        <AvailabilityExceptions mentor={mentorInfo as Mentor} refetchMentor={refetchMentor} />
      </div>
    </>
  );
};

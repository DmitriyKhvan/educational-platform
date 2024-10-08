import { useEffect, useState } from 'react';

import { useAuth } from '@/app/providers/auth-provider';
import Loader from '@/components/loader/loader';
import { AcceptingStudents } from '@/pages/mentors/accepting-students';
import { AvailabilityExceptions } from '@/pages/mentors/availability-exceptions';
import { AvailabilitySlots } from '@/pages/mentors/availability/availability-slots';
import { Tab } from '@/pages/mentors/availability/tab';
import { useMentorQuery } from '@/shared/apollo/queries/mentors/mentor.generated';
import type { GatherAvailabilities } from '@/types';
import {
  type Mentor,
  MentorAvailabilityType,
  type Timesheet,
  type TimesheetSlot,
} from '@/types/types.generated';

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
    [MentorAvailabilityType.OnlyRegular]: [],
    [MentorAvailabilityType.OnlyTrial]: [],
    [MentorAvailabilityType.RegularAndTrial]: [],
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

  useEffect(() => {
    if (mentorInfo) {
      const mentorType =
        mentorInfo.mentorAvailability === MentorAvailabilityType.OnlyRegular ||
        mentorInfo.mentorAvailability === MentorAvailabilityType.RegularAndTrial
          ? MentorAvailabilityType.OnlyRegular
          : MentorAvailabilityType.OnlyTrial;

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
          [MentorAvailabilityType.OnlyRegular]: regularAvailabilities as TimesheetSlot[],
        };
      });

      setGatherAvailabilities((prevGatherAvailabilities) => {
        return {
          ...prevGatherAvailabilities,
          [MentorAvailabilityType.OnlyTrial]: trialAvailabilities as TimesheetSlot[],
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
        {mentorInfo?.mentorAvailability === MentorAvailabilityType.RegularAndTrial ? (
          <>
            <Tab
              active={mentorAvailabilityType === MentorAvailabilityType.OnlyRegular}
              onClick={() => setMentorAvailabilityType(MentorAvailabilityType.OnlyRegular)}
            >
              Regular Students
            </Tab>

            <Tab
              active={mentorAvailabilityType === MentorAvailabilityType.OnlyTrial}
              onClick={() => setMentorAvailabilityType(MentorAvailabilityType.OnlyTrial)}
            >
              Trial Students
            </Tab>
          </>
        ) : mentorInfo?.mentorAvailability === MentorAvailabilityType.OnlyTrial ? (
          <Tab
            active={mentorAvailabilityType === MentorAvailabilityType.OnlyTrial}
            onClick={() => setMentorAvailabilityType(MentorAvailabilityType.OnlyTrial)}
          >
            Trial Students
          </Tab>
        ) : null}
      </div>

      {mentorAvailabilityType === MentorAvailabilityType.OnlyRegular && <AcceptingStudents />}

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

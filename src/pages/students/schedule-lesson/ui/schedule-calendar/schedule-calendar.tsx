import Button from '@/components/form/button';
import { PACKAGE_QUERY } from '@/shared/apollo/graphql';
import { getItemToLocalStorage } from '@/shared/constants/global';
import { SelectMentorCalendar } from '@/widgets/select-mentor-calendar';
import { useQuery } from '@apollo/client';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import type { AvailabilitySlot, Mentor, PackageSubscription } from '@/types/types.generated';

interface ScheduleCalendarProps {
  mentor: Mentor;
  repeat: number | boolean | null;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  setSchedule: React.Dispatch<React.SetStateAction<AvailabilitySlot | undefined>>;
  setRepeat: React.Dispatch<React.SetStateAction<number | boolean | null>>;
  schedule: AvailabilitySlot | undefined;
  lessonId?: string | null;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  mentor,
  repeat,
  setTabIndex,
  setSchedule,
  schedule,
  setRepeat,
  lessonId,
}) => {
  const navigate = useNavigate();

  const {
    data: { packageSubscriptions: planStatus = [] } = {},
  } = useQuery(PACKAGE_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      studentId: getItemToLocalStorage('studentId', ''),
    },
  });

  return (
    <section>
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-2">
          {!lessonId && (
            <button
              type="button"
              onClick={() => {
                navigate(-1);
              }}
            >
              <IoArrowBack className="text-2xl" />
            </button>
          )}
          <h2 className="font-bold text-3xl">
            Book a lesson with {mentor?.firstName ?? ''} {mentor?.lastName?.[0] ?? ''}.
          </h2>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2 items-center p-2 pr-3 rounded-lg bg-color-purple bg-opacity-10 text-color-purple font-semibold text-base">
            <span className="bg-color-purple bg-opacity-10 block px-3 py-2 rounded leading-4">
              {planStatus?.reduce(
                (acc: number, curr: PackageSubscription) => acc + (curr?.credits ?? 0),
                0,
              ) ?? 0}
            </span>
            <span>credits left</span>
          </div>

          <Button disabled={!schedule} onClick={() => setTabIndex(3)}>
            Book selected lessons
          </Button>
        </div>
      </header>

      <p className="mb-5 text-[15px] text-color-light-grey">Select date and time</p>

      <SelectMentorCalendar
        repeat={repeat}
        mentor={mentor}
        setSchedule={setSchedule}
        setRepeat={setRepeat}
      />
    </section>
  );
};

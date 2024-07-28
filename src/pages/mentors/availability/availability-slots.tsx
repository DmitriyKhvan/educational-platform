import { useAuth } from "@/app/providers/auth-provider";
import ReactLoader from "@/components/common/loader";
import Button from "@/components/form/button";
import { SelectField } from "@/components/form/select-field";
import { ModalConfirm } from "@/entities/modal-confirm/ui/modal-confirm";
import AvailabilityDayRow from "@/pages/mentors/availability/availability-day-row";
import { parseErrorMessage } from "@/pages/mentors/availability/lib/parse-error-message";
import { selectStyle } from "@/pages/mentors/availability/lib/select-style";
import { UPSERT_TIMESHEETS } from "@/shared/apollo/mutations/upsert-timesheets";
import {
  DAY,
  MentorAvailabilityType,
  timezoneWithTimeOptions,
} from "@/shared/constants/global";
import { AdaptiveDialog } from "@/shared/ui/adaptive-dialog";
import notify from "@/shared/utils/notify";
import type {
  AvailabilitySlot,
  ErrorExceptionalDates,
  Slot,
} from "@/types";
import type { Mentor, Query } from "@/types/types.generated";
import {
  useMutation,
  type ApolloQueryResult,
  type OperationVariables,
} from "@apollo/client";
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useTranslation } from "react-i18next";
import { IoIosWarning } from "react-icons/io";
import { Link } from "react-router-dom";

interface AvailabilitySlotProps {
  mentorInfo: Mentor;
  gatherAvailabilities: GatherAvailabilities;
  mentorAvailabilityType?: MentorAvailabilityType;
  useSetGatherAvailabilities: (data: AvailabilitySlot[]) => void;
  refetchMentor: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<Query>>;
  setError: Dispatch<SetStateAction<Error | null>>;
}


interface SlotToSave {
  day: string;
  slots: { from: string; to: string }[];
  trialTimesheet: boolean;
}


type GatherAvailabilities = {
  [key in MentorAvailabilityType]: AvailabilitySlot[];
};
export const AvailabilitySlots: React.FC<AvailabilitySlotProps> = ({
  mentorInfo,
  gatherAvailabilities,
  mentorAvailabilityType = MentorAvailabilityType.ONLY_REGULAR,
  useSetGatherAvailabilities,
  refetchMentor,
  setError,
}) => {
  const [errorExceptionalDates, setErrorExceptionalDates] = useState<null | ErrorExceptionalDates>(null);
  const { user } = useAuth();

  const [t] = useTranslation(["common", "availability"]);

  const [disableSave, handleDisableSave] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const timezoneWithTime = useMemo(() => {
    return timezoneWithTimeOptions;
  }, []);

  const [timeZone, setTimeZone] = useState(user?.timeZone);
  const [prevTimeZone, setPrevTimeZone] = useState(user?.timeZone);

  const [upsertTimesheets] = useMutation(UPSERT_TIMESHEETS);

  const parseAndSaveAvailabilities = (
    mentorAvailabilityType: MentorAvailabilityType
  ): SlotToSave[] => {
    const days = gatherAvailabilities[mentorAvailabilityType as keyof typeof gatherAvailabilities].reduce(
      (acc: Record<string, Slot[]>, curr: AvailabilitySlot) => {
        if (acc[curr.day] === undefined) acc[curr.day] = [...curr.slots];
        else acc[curr.day] = [...acc[curr.day], ...curr.slots];
        return acc;
      },
      {}
    );

    const parseSlots: SlotToSave[] = [];

    for (const day in days) {
      parseSlots.push({
        day,
        slots: days[day].map((slot) => ({ from: slot.from, to: slot.to })),
        trialTimesheet:
          mentorAvailabilityType === MentorAvailabilityType.ONLY_REGULAR
            ? false
            : true,
      });
    }

    return parseSlots;
  };

  useEffect(() => {
    handleDisableSave(false);
  }, [gatherAvailabilities, timeZone]);

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    e.currentTarget.blur();

    let slotsToSave: SlotToSave[] = [];

    if (mentorInfo.mentorAvailability === MentorAvailabilityType.REGULAR_AND_TRIAL) {
      (Object.keys(gatherAvailabilities) as Array<MentorAvailabilityType>).forEach((availType) => {
        const slots = parseAndSaveAvailabilities(availType);

        slotsToSave = [...slotsToSave, ...slots];
      });
    } else {
      slotsToSave = parseAndSaveAvailabilities(
        mentorInfo.mentorAvailability as MentorAvailabilityType
      );
    }

    try {
      await upsertTimesheets({
        variables: {
          data: {
            mentorId: mentorInfo?.id,
            availabilities: slotsToSave,
            ...(timeZone && { timeZone }),
          },
        },
      });

      setPrevTimeZone(timeZone);
      handleDisableSave(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error("An unexpected error occurred"));
      }
      setTimeZone(prevTimeZone);
      await refetchMentor();

      const parseError = parseErrorMessage(error);
      if (parseError) {
        setErrorExceptionalDates(parseError);
      } else {
        notify((error as Error).message, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-fit space-y-8 p-6 border border-gray-100 rounded-lg shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)]">
        {isLoading && <ReactLoader />}
        <div className="flex justify-between items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-xl text-color-dark-purple font-bold">
              {t("weekly_hours", { ns: "availability" })}
            </h1>
            <h3 className="text-sm text-gray-400">
              {t("edit_your_shedule_below", { ns: "availability" })}
            </h3>
          </div>

          {timeZone && (
            <SelectField
              styles={selectStyle}
              value={timeZone}
              options={timezoneWithTime}
              onChange={(value: string) => setTimeZone(value)}
            />
          )}

          <div className="flex">
            <Button
              type="submit"
              onClick={onSubmit}
              disabled={disableSave}
              className=""
            >
              Save changes
            </Button>
          </div>
        </div>

        <div className="divider"></div>

        <div className="space-y-8">
          {DAY.map((day) => (
            <AvailabilityDayRow
              key={day}
              day={day}
              useSetGatherAvailabilities={useSetGatherAvailabilities}
              allGatherAvailabilities={gatherAvailabilities}
              gatherAvailabilities={gatherAvailabilities[mentorAvailabilityType]}
              mentorAvailabilityType={mentorAvailabilityType}
            />
          ))}
        </div>
      </div>

      {errorExceptionalDates && (
        <AdaptiveDialog
          open={!!errorExceptionalDates}
          setOpen={setErrorExceptionalDates as Dispatch<SetStateAction<boolean>>}
        >
          <ModalConfirm
            icon={
              <div className="w-full flex justify-center mb-6">
                <div className="p-3 rounded-lg bg-[rgba(234,_33,_33,_0.10)]">
                  <IoIosWarning className="text-2xl text-[#EA2121]" />
                </div>
              </div>
            }
            title="Overlapping lesson(s)"
            text={
              <div>
                {!!errorExceptionalDates.regularLessons && (
                  <p>
                    You have{" "}
                    <b>{errorExceptionalDates.regularLessons} regular lesson(s)</b>{" "}
                    scheduled
                  </p>
                )}
                {!!errorExceptionalDates.trialLessons && (
                  <p>
                    You have{" "}
                    <b>{errorExceptionalDates.trialLessons} trial lesson(s)</b>{" "}
                    scheduled
                  </p>
                )}
              </div>
            }
            btns={
              <div className="flex gap-3">
                <Link className="basis-1/2" to="/mentor/lesson-calendar">
                  <Button
                    className="w-full"
                    onClick={() => setErrorExceptionalDates(null)}
                  >
                    Go to Lessons
                  </Button>
                </Link>

                <Button
                  onClick={() => setErrorExceptionalDates(null)}
                  theme="gray"
                  className="basis-1/2"
                >
                  Back
                </Button>
              </div>
            }
          />
        </AdaptiveDialog>
      )}
    </>
  );
};
import React from 'react';
import { WarningMessage } from './WarningMessage';
import { format } from 'date-fns-tz';
import { FaXmark } from 'react-icons/fa6';
import { isWithinHours } from 'src/shared/utils/isWithinHours';
import { useAuth } from 'src/app/providers/AuthProvider';

export const StrikeMentor = ({ data, contractData }) => {
  const { user } = useAuth();

  const userTimezone =
    user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const penaltiesCount = contractData?.mentorContract?.penalties?.length ?? 0;

  const isWithin24Hours = isWithinHours({
    dateEnd: new Date(data?.startAt ?? new Date()),
    dateStart: new Date(),
    hours: 24,
    userTimezone,
  });

  const fine = data.duration === 25 ? "5$" : "10$"

  const warningMessage = isWithin24Hours
    ? `You will be fined ${fine} for this ${data.duration}-minute lesson`
    : 'After 6 cancellations, you will be fined for each additional cancellation.';

  // const isWithinTwoWeeks = isWithinHours({
  //   dateEnd: new Date(data?.startAt ?? new Date()),
  //   dateStart: new Date(),
  //   hours: HOURS_IN_WEEK * 2,
  // });

  return (
    <>
      <p className="text-[#464752] text-[15px] text-center mb-4">
        {/* {isWithinTwoWeeks
          ? isWithin24Hours
            ? 'Warning you are cancelling a lesson within 24 hours.'
            : 'Warning you are cancelling a lesson outside of 24 hours but within 2 weeks.'
          : 'Are you sure you want to cancel this lesson more than two weeks in advance?'} */}
        {isWithin24Hours
          ? 'Warning you are cancelling a lesson within 24 hours.'
          : 'Warning you are cancelling a lesson outside of 24 hours.'}
      </p>
      {/* {isWithinTwoWeeks && ( */}
      <>
        <p className="text-[#464752] text-[15px] text-center font-semibold mb-4">
          1 day of classes equals 1 strike
        </p>

        <WarningMessage warningMessage={warningMessage} />

        <div className="w-full p-4 mt-5 rounded-lg bg-color-purple/20">
          <>
            <p className="text-[15px] font-semibold text-color-purple">
              {penaltiesCount}/6 cancellations
            </p>

            <p className="text-sm text-color-purple mb-4">
              {`${format(
                contractData?.mentorContract?.startDate ?? new Date(),
                'MM-dd-yyyy',
              )} to ${format(
                contractData?.mentorContract?.endDate ?? new Date(),
                'MM-dd-yyyy',
              )} (6 month contract)`}
            </p>

            <div className="flex gap-3 justify-between">
              {contractData?.mentorContract?.penalties?.slice(0, 6).map((p) => (
                <div
                  key={p.id}
                  className="w-[50px] h-[50px] text-xs bg-[#F14E1C] rounded-[4px] text-white flex flex-col justify-center items-center gap-1"
                >
                  <FaXmark />
                  <p>{format(p?.createdAt ?? new Date(), 'MMM dd')}</p>
                </div>
              ))}
              {contractData?.mentorContract?.penalties &&
                [...Array(penaltiesCount > 6 ? 0 : 6 - penaltiesCount)].map(
                  (_, idx) => (
                    <div
                      key={idx}
                      className="w-[50px] h-[50px] bg-color-purple bg-opacity-30 rounded-[4px]"
                    ></div>
                  ),
                )}
            </div>
          </>
        </div>
      </>
      {/* )} */}
    </>
  );
};

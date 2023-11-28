import React from 'react';
import Button from 'src/components/Form/Button';

const ScheduleCard = ({ startTime, endTime, date }) => {
  return (
    <div className="border rounded-[10px] p-5 shadow-[0px_10px_30px_rgba(0,_0,_0,_0.01)] border-color-border-grey">
      <div className="flex gap-2 items-center flex-wrap">
        <h3 className="text-color-dark-purple">
          {startTime} → {endTime}
        </h3>

        <Button
          className="px-[10px] h-[38px] cursor-auto hover:bg-white hover:text-inherit"
          theme="outline"
        >
          {/* {`${t(moment(date).format('dddd'))}, ${t(
                moment(date).format('MMMM'),
              )} ${moment(date).format('DD')}${t('kor_day')}`} */}
          {date}
        </Button>
      </div>
    </div>
  );
};

export default ScheduleCard;

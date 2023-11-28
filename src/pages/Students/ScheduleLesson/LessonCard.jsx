import React from 'react';
import Button from 'src/components/Form/Button';
import { ucFirst } from 'src/utils/ucFirst';

const LessonCard = ({ lesson, duration, remaining }) => {
  return (
    <div className="border rounded-[10px] p-5 shadow-[0px_10px_30px_rgba(0,_0,_0,_0.01)] border-color-border-grey">
      <div className="flex sm:items-center gap-2 flex-wrap">
        <h1 className="font-medium text-xl leading-7 tracking-[-0.6px] text-color-dark-purple">
          {ucFirst(lesson) || 'Title'}
        </h1>
        <div className="flex gap-2 items-center">
          <div className="rounded-lg bg-color-light-purple">
            <Button className="px-[10px] h-[38px] text-color-purple bg-color-light-purple cursor-auto">
              {duration}
            </Button>
          </div>

          {remaining && (
            <Button
              className="px-[10px] h-[38px] cursor-auto hover:bg-white hover:text-inherit"
              theme="outline"
            >
              {remaining}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;

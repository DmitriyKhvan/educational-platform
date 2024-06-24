import React from 'react';
import { PiSealCheckFill } from 'react-icons/pi';
import Button from 'src/components/Form/Button';
import { Tag } from 'src/entities/Questionnaire/ui/Tag';
import { Avatar } from 'src/widgets/Avatar/Avatar';

export const TopMentorCard = () => {
  return (
    <div className="w-full min-[400px]:w-[280px] space-y-5 p-5 rounded-[10px] border border-gray-100 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)]">
      <div className="flex justify-between gap-4">
        <div className="space-y-[10px]">
          <span className="text-lg font-bold text-color-dark-purple">
            Monica
          </span>
          <span className="flex items-center  text-[rgba(0,_217,_134,_1)]">
            <div className="relative w-5 h-4">
              <PiSealCheckFill className="absolute" />
              {/* <PiSealCheckFill className="absolute ml-1" /> */}
            </div>

            <span className="text-[13px]">TESOL, TEFL certified</span>
          </span>
        </div>
        <Avatar className="w-[64px] h-[64px] rounded-s-lg overflow-hidden"></Avatar>
      </div>

      <div className="space-y-3">
        <div className="flex gap-[6px] whitespace-nowrap">
          <Tag label="💻 Technology" className="px-[10px] text-xs" />

          <div className="flex">
            <Tag label="🌳 Ecology" className="px-[10px] text-xs" />
            <Tag label="+3" className="bg-white " />
          </div>
        </div>

        <div className="flex gap-[6px] whitespace-nowrap">
          <Tag
            icon="✦"
            label="Academic"
            className="text-color-purple px-[10px] text-xs"
          />

          <div className="flex">
            <Tag
              icon="✦"
              label="Creative"
              className="text-color-purple px-[10px] text-xs"
            />
            <Tag label="+3" className="bg-white " />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button className="">Schedule</Button>
        <Button theme="dark_purple" className="">
          View profile
        </Button>
      </div>
    </div>
  );
};

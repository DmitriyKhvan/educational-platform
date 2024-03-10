import React from 'react';
import { LangLevelType } from 'src/constants/global';

const LevelBadge = ({ level }) => {
  switch (level) {
    case LangLevelType.PRE_LEVEL:
      return (
        <span className="inline-block self-start bg-[#19BBFE] text-[#19BBFE] bg-opacity-10 text-sm font-medium px-[10px] py-[5px] sm:px-3 sm:py-[6px] rounded-2xl">
          <div className="flex items-center gap-1">{level}</div>
        </span>
      );
    case LangLevelType.LEVEL_1:
      return (
        <span className="inline-block bg-[#FF9335] text-[#FF9335] bg-opacity-10 text-sm font-medium px-[10px] py-[5px] sm:px-3 sm:py-[6px] rounded-2xl">
          <div className="flex items-center gap-1">{level}</div>
        </span>
      );
    case LangLevelType.LEVEL_2:
      return (
        <span className="inline-block bg-[#FF5F4B] text-[#FF5F4B] bg-opacity-10 text-sm font-medium px-[10px] py-[5px] sm:px-3 sm:py-[6px] rounded-2xl">
          <div className="flex items-center gap-1">{level}</div>
        </span>
      );
    case LangLevelType.LEVEL_3:
      return (
        <span className="inline-block bg-[#02C97E] text-[#02C97E] bg-opacity-10 text-sm font-medium px-[10px] py-[5px] sm:px-3 sm:py-[6px] rounded-2xl">
          <div className="flex items-center gap-1">{level}</div>
        </span>
      );

    case LangLevelType.LEVEL_4:
      return (
        <span className="inline-block bg-[#E72EB3] text-[#E72EB3] bg-opacity-10 text-sm font-medium px-[10px] py-[5px] sm:px-3 sm:py-[6px] rounded-2xl">
          <div className="flex items-center gap-1">{level}</div>
        </span>
      );

    case LangLevelType.LEVEL_5:
      return (
        <span className="inline-block bg-[#862EE7] text-[#862EE7] bg-opacity-10 text-sm font-medium px-[10px] py-[5px] sm:px-3 sm:py-[6px] rounded-2xl">
          <div className="flex items-center gap-1">{level}</div>
        </span>
      );
  }
  return <div>LevelBadge</div>;
};

export default LevelBadge;

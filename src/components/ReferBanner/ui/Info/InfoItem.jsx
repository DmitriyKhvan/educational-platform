import React from 'react';

export const InfoItem = ({ info }) => {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg bg-[${info.color}]/[.1]`}
    >
      <div
        className={`min-w-8 min-h-8 flex items-center justify-center rounded bg-[${info.color}]/[.16]`}
      >
        {info.icon}
      </div>
      <div className="space-y-2">
        <h4 className={`text-lg font-bold text-[${info.color}] leading-6`}>
          {info.title}
        </h4>
        <p className={`text-[15px] text-[${info.color}]`}>{info.text}</p>
      </div>
    </div>
  );
};

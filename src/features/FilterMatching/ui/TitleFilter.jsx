import React from 'react';

export const TitleFilter = ({ count, title }) => {
  return (
    <span className="space-x-2">
      <span>{title}</span>
      {count > 0 && (
        <span className="px-[6px] py-[2px] rounded-md bg-color-purple/10 text-xs font-medium text-color-purple">
          {count}
        </span>
      )}
    </span>
  );
};

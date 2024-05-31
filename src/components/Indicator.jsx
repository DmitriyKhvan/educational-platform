import React from 'react';
import { cn } from 'src/shared/utils/functions';

const Indicator = ({ children, className = 'bg-gray-300 text-gray-700' }) => {
  if (!children) return <></>;

  return (
    <div
      className={cn(
        'inline-block bg-opacity-20 text-sm font-medium px-[10px] py-[5px] sm:px-3 sm:py-[6px] rounded-2xl',
        className,
      )}
    >
      <span className="flex items-center gap-1 whitespace-nowrap">
        {children}
      </span>
    </div>
  );
};

export default Indicator;

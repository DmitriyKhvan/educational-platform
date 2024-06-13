import React, { forwardRef } from 'react';
import { cn } from 'src/shared/utils/functions';

export const Tag = forwardRef(function Tag(
  { active, imoji, value, label, ...props },
  ref,
) {
  return (
    <label
      ref={ref}
      className={cn(
        `flex items-center gap-2 px-3 py-[10px] border border-gray-200 rounded-3xl
                 cursor-pointer`,
        active && 'border-color-purple',
      )}
    >
      <input className="hidden" type="checkbox" value={value} {...props} />

      <span className={cn('text-sm', active && 'text-color-purple')}>
        {imoji}
      </span>
      <span
        className={cn('text-sm font-medium', active && 'text-color-purple')}
      >
        {label}
      </span>
    </label>
  );
});

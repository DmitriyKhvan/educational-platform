import React, { forwardRef } from 'react';
import { cn } from 'src/shared/utils/functions';

export const Tag = forwardRef(function Tag(
  { active, imoji, value, label, className, ...props },
  ref,
) {
  return (
    <label
      ref={ref}
      className={cn(
        `flex items-center gap-2 px-3 py-[10px] border border-gray-200 rounded-3xl
        cursor-pointer`,
        className,
        active && 'border-color-purple text-color-purple',
      )}
    >
      <input className="hidden" type="checkbox" value={value} {...props} />

      {imoji && <span className="text-sm">{imoji}</span>}
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
});

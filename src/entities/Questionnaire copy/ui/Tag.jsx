import React, { forwardRef } from 'react';
import { cn } from 'src/shared/utils/functions';

export const Tag = forwardRef(function Tag(
  { active, icon, value, label, className, type = 'checkbox', ...props },
  ref,
) {
  return (
    <label
      ref={ref}
      className={cn(
        `flex items-center gap-2 px-3 py-[10px] border border-gray-200 rounded-3xl
        cursor-pointer text-sm`,
        className,
        active && 'border-transparent bg-color-purple/10 text-color-purple',
      )}
    >
      <input className="hidden" type={type} value={value} {...props} />

      {icon && icon}
      <span className="font-medium">{label}</span>
    </label>
  );
});

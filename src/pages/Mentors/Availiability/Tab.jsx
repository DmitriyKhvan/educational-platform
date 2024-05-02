import { forwardRef } from 'react';
import { cn } from 'src/utils/functions';

export const Tab = forwardRef(function Tab(
  { active, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'p-5 text-[15px] font-medium border-b-2 border-transparent',
        active && 'text-color-purple border-color-purple',
      )}
      {...props}
    >
      {children}
    </button>
  );
});

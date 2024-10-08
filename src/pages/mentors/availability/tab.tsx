import { cn } from '@/shared/utils/functions';
import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';

interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: ReactNode;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
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

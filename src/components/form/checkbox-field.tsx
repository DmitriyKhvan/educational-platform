import { cn } from '@/shared/utils/functions';
import type React from 'react';
import { type ReactNode, forwardRef } from 'react';

interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | ReactNode;
  square?: boolean;
  dot?: boolean;
}

const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  (
    { label = '', type = 'checkbox', name = '', className, square = false, dot = false, ...props },
    ref,
  ) => {
    return (
      <label className={cn('relative inline-flex items-center cursor-pointer', className)}>
        <input
          className={cn(
            'appearance-none peer relative h-6 w-6 bg-[#F5F5F5] text-transparent cursor-pointer focus:ring-transparent focus:shadow-[0_0_0_0.35rem_rgba(13,110,253,0.25)] checked:bg-none',
            square ? 'rounded-[4px]' : 'rounded-full',
            dot
              ? 'checked:bg-transparent border-0 checked:border-2 border-color-purple'
              : 'checked:bg-color-purple border-none',
          )}
          type={type}
          name={name}
          id={name}
          ref={ref}
          {...props}
        />
        {dot ? (
          <div className="absolute hidden peer-checked:block ml-2 rounded-full bg-color-purple w-2 h-2" />
        ) : (
          <svg
            className="absolute w-4 h-4 mx-1 hidden peer-checked:block text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Checked</title>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {label && <p className="ml-3 leading-6 text-gray-900">{label}</p>}
      </label>
    );
  },
);

CheckboxField.displayName = 'CheckboxField';

export default CheckboxField;

import { cn } from '@/shared/utils/functions';
import { type Ref, type TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
  label?: string;
  text?: string;
  className?: string;
}

export const TextareaField = forwardRef(
  (
    {
      placeholder = '',
      label = '',
      text = '',
      className = 'w-[570px]',
      ...props
    }: TextareaFieldProps,
    ref: Ref<HTMLTextAreaElement>,
  ) => {
    return (
      <div className="">
        {label && (
          <p className="font-semibold text-[17px] leading-[21px] tracking-[-0.6px] text-color-dark-purple">
            {label}
          </p>
        )}
        {text && (
          <p className="font-medium leading-[23px] mt-[10px] tracking-[-0.6px] text-color-light-grey">
            {text}
          </p>
        )}
        <textarea
          className={cn(
            `bg-white 
            h-[300px]
            border
            border-solid
            border-color-border-grey
            font-inter 
            text-sm 
            text-color-dark-purple
            font-normal
            leading-[22px]
            tracking-[-0.5px]
            shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.04)]
            p-[15px]`,
            className,
          )}
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

TextareaField.displayName = 'TextareaField';

import { forwardRef } from 'react';

export const TextareaField = forwardRef(
  (
    {
      placeholder = '',
      label = '',
      text = '',
      className = 'w-full h-[300px]',
      ...props
    },
    ref,
  ) => {
    return (
      <div className="mb-[25px]">
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
          className={`
            bg-white 
            mt-[15px]
            border
            border-solid
            border-color-border-grey
            rounded-[10px]
            font-medium
            text-lg
            text-color-light-grey
            leading-[22px]
            tracking-[-0.5px]
            p-[15px]
            ${className}
          `}
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

TextareaField.displayName = 'Textarea';

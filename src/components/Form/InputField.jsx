import { forwardRef } from 'react';

const InputField = forwardRef(function InputField(
  {
    label = '',
    type = 'text',
    placeholder = '',
    autoComplete = 'off',
    className,
    icon,
    positionIcon = 'right',
    ...props
  },
  ref,
) {
  return (
    <label>
      {label && <div className="mb-2">{label}</div>}
      <div className="flex items-center">
        {icon && positionIcon === 'left' && (
          <div
            className="
            flex
            items-center
            justify-center
            h-[42px]
            px-2
            border-y 
            border-l
            rounded-l-md
            border-solid 
          border-color-border
          "
          >
            {icon}
          </div>
        )}

        <input
          className={`
          p-2 
          text-base 
          bg-white
           
          border-solid 
          border-color-border 
          
          outline-none 
          focus:border-color-light-blue 
          focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)]
          transition ease-in-out duration-300
          ${className}
          ${
            icon && positionIcon === 'right'
              ? 'rounded-l-md border-l border-y border-r-0'
              : icon && positionIcon === 'left'
              ? 'rounded-r-md border-r border-y border-l-0'
              : 'rounded-md border'
          }
        `}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          ref={ref}
          {...props}
        />

        {icon && positionIcon === 'right' && (
          <div
            className="
            flex
            items-center
            justify-center
            h-[42px]
            px-2
            border-y 
            border-r
            rounded-r-md
            border-solid 
          border-color-border
            overflow-hidden
            select-none
          "
          >
            {icon}
          </div>
        )}
      </div>
    </label>
  );
});

export default InputField;

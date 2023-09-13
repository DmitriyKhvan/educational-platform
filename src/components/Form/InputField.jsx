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
      {label && <div className="mb-1">{label}</div>}
      <div
        className={`flex items-center ${
          positionIcon === 'left' ? 'flex-row-reverse' : ''
        }`}
      >
        <input
          className={`
          peer
          p-2 
          text-base 
          bg-white
          border-solid 
          border-[#e6e6e6] 
          focus:border-[hsla(210,_96%,_45%,_50%)] 
          focus:ring-[#2563eb00]
          focus:shadow-[0px_1px_1px_rgba(0,_0,_0,_0.03),_0_0_0_3px_hsla(210,_96%,_45%,_25%),_0_1px_1px_0_rgba(0,_0,_0,_0.08)]
          transition ease-in-out duration-300
          ${className}
          ${
            icon && positionIcon === 'right'
              ? ' rounded-l-md border-l border-y border-r-0 [clip-path:inset(-3px_0px_-3px_-3px)]'
              : icon && positionIcon === 'left'
              ? 'rounded-r-md border-r border-y border-l-0 [clip-path:inset(-3px_-3px_-3px_0px)]'
              : 'rounded-md border'
          }
        `}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          ref={ref}
          {...props}
        />

        {icon && (
          <div
            className={`
            flex
            items-center
            justify-center
            h-[42px]
            px-2
            border-y 
            border-solid 
            border-[#e6e6e6] 
            peer-focus:border-[hsla(210,_96%,_45%,_50%)] 
            peer-focus:ring-[#2563eb00]
            peer-focus:shadow-[0px_1px_1px_rgba(0,_0,_0,_0.03),_0_0_0_3px_hsla(210,_96%,_45%,_25%),_0_1px_1px_0_rgba(0,_0,_0,_0.08)]
            transition ease-in-out duration-300
            select-none
            ${
              positionIcon === 'right'
                ? 'border-r rounded-r-md [clip-path:inset(-3px_-3px_-3px_0px)]'
                : 'border-l rounded-l-md [clip-path:inset(-3px_0px_-3px_-3px)]'
            }
            `}
          >
            {icon}
          </div>
        )}
      </div>
    </label>
  );
});

export default InputField;

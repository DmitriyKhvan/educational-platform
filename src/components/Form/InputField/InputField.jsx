import { forwardRef } from 'react';
import cls from './InputField.module.css';

const InputField = forwardRef(function InputField(
  {
    label = '',
    type = 'text',
    placeholder = '',
    autoComplete = 'off',
    className,
    classNameIcon,
    classNameLabel,
    icon,
    iconHandler,
    positionIcon = 'right',
    ...props
  },
  ref,
) {
  return (
    <label className="grow">
      {label && (
        <div className={`${cls.labelStyle} ${classNameLabel}`}>{label}</div>
      )}
      <div
        className={`flex items-center ${
          positionIcon === 'left' ? 'flex-row-reverse' : ''
        }`}
      >
        <input
          className={`
          peer
          ${cls.inputStyle}
          ${className}
          ${
            icon && positionIcon === 'right'
              ? ' rounded-l-md border-l border-y border-r-0 [clip-path:inset(-3px_1px_-3px_-3px)]'
              : icon && positionIcon === 'left'
              ? 'rounded-r-md border-r border-y border-l-0 [clip-path:inset(-3px_-3px_-3px_1px)]'
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
            ${cls.iconStyle}
            peer-focus:border-[hsla(210,_96%,_45%,_50%)] 
            peer-focus:ring-[#2563eb00]
            peer-focus:shadow-[0px_1px_1px_rgba(0,_0,_0,_0.03),_0_0_0_3px_hsla(210,_96%,_45%,_25%),_0_1px_1px_0_rgba(0,_0,_0,_0.08)]
            ${classNameIcon}
            ${
              positionIcon === 'right'
                ? 'border-r rounded-r-md [clip-path:inset(-3px_-3px_-3px_1px)] ml-[-2px]'
                : 'border-l rounded-l-md [clip-path:inset(-3px_1px_-3px_-3px)] mr-[-2px]'
            }
            `}
            onClick={iconHandler}
          >
            {icon}
          </div>
        )}
      </div>
    </label>
  );
});

export default InputField;

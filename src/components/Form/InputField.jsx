import { forwardRef } from 'react';

const InputField = forwardRef(function InputField(
  {
    label = '',
    type = 'text',
    placeholder = '',
    autoComplete = 'off',
    className,
    ...props
  },
  ref,
) {
  return (
    <label>
      {label && (
        <div className="mb-[10px] font-semibold text-[15px] leading-5 tracking-[-0.2px]">
          {label}
        </div>
      )}
      <input
        className={`
          p-[14px] 
          text-[15px]
          text-color-light-grey 
          font-medium
          bg-white
          border 
          border-solid 
          border-color-border 
          rounded-md outline-none 
          focus:border-color-light-blue 
          focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)]
          transition ease-in-out duration-300
          leading-5
          tracking-[-0.2px]
          ${className}
        `}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        ref={ref}
        {...props}
      />
    </label>
  );
});

export default InputField;

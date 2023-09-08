import { forwardRef } from 'react';

const InputField = forwardRef(function InputField(
  {
    label = '',
    type = 'text',
    placeholder = '',
    autoComplete = 'off',
    className,
    icon,
    ...props
  },
  ref,
) {
  return (
    // <label>
    //   {label && <div className="mb-2">{label}</div>}
    //   <input
    //     className={`
    //       p-2
    //       text-base
    //       bg-white
    //       border
    //       border-solid
    //       border-color-border
    //       rounded-md outline-none
    //       focus:border-color-light-blue
    //       focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)]
    //       transition ease-in-out duration-300
    //       ${className}
    //     `}
    //     type={type}
    //     placeholder={placeholder}
    //     autoComplete={autoComplete}
    //     ref={ref}
    //     {...props}
    //   />
    // </label>
    <label>
      {label && <div className="mb-2">{label}</div>}
      <div className="flex items-center">
        <input
          className={`
          p-2 
          text-base 
          bg-white
          border 
          border-solid 
          border-color-border 
          rounded-md outline-none 
          focus:border-color-light-blue 
          focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)]
          transition ease-in-out duration-300
          ${className}
        `}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          ref={ref}
          {...props}
        />

        {icon && (
          <div
            className="
            border 
            border-solid 
          border-color-border
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

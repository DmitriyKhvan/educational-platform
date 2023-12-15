import { forwardRef } from 'react';

const CheckboxField = forwardRef(
  ({ label = '', type = 'checkbox', name = '', className, ...props }, ref) => {
    return (
      <label
        className={`relative inline-flex items-center cursor-pointer ${className}`}
      >
        <input
          className={`
            appearance-none
            relative
            h-5
            w-5 
            rounded 
            text-transparent
            border-gray-300 
            cursor-pointer
            focus:ring-transparent
            checked:bg-none
            checked:after:content-['']
            checked:after:block
            checked:after:absolute
            checked:after:left-2/4
            checked:after:top-2/4
            checked:after:-mt-[5px]
            checked:after:-ml-[5px]
            checked:after:w-[10px]
            checked:after:h-[10px]
            checked:after:bg-color-purple
            checked:after:rounded
          `}
          type={type}
          name={name}
          id={name}
          ref={ref}
          {...props}
        />
        {label && <p className="ml-3 leading-6 text-gray-900">{label}</p>}
      </label>
    );
  },
);

CheckboxField.displayName = 'CheckboxField';

export default CheckboxField;

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
            peer
            relative
            h-6
            w-6 
            rounded-full 
            border-none
            bg-[#F5F5F5]
            text-transparent
            cursor-pointer
            focus:ring-transparent
            checked:bg-none
            checked:bg-color-purple
            
          `}
          type={type}
          name={name}
          id={name}
          ref={ref}
          {...props}
        />
        <svg
          className="
            absolute 
            w-4 h-4 ml-1
            hidden peer-checked:block
            text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        {label && <p className="ml-3 leading-6 text-gray-900">{label}</p>}
      </label>
    );
  },
);

CheckboxField.displayName = 'CheckboxField';

export default CheckboxField;

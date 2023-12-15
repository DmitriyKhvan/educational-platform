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
            checked:bg-[url("data:image/svg+xml,%3csvg_xmlns='http://www.w3.org/2000/svg'_viewBox='0_0_8_8'%3e%3cpath_fill='%23fff'_d='M6.564.75l-3.59_3.612-1.538-1.55L0_4.26_2.974_7.25_8_2.193z'/%3e%3c/svg%3e")]
            
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
      w-4 h-4 mt-1
      hidden peer-checked:block"
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

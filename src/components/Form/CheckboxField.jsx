import { forwardRef } from 'react';

const CheckboxField = forwardRef(
  ({ label = '', type = 'checkbox', name = '', ...props }, ref) => {
    return (
      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <input
            className={`
            h-4 
            w-4 
            rounded 
            border-gray-300 
            text-indigo-600 
            focus:ring-indigo-600
          `}
            type={type}
            name={name}
            id={props.name}
            ref={ref}
            {...props}
          />
        </div>
        <div className="ml-3 text-base leading-6">
          <label htmlFor={props.name} className="font-medium text-gray-900">
            {label}
          </label>
        </div>
      </div>
    );
  },
);

CheckboxField.displayName = 'CheckboxField';

export default CheckboxField;

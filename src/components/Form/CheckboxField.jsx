import { forwardRef } from 'react';

const CheckboxField = forwardRef(
  ({ label = '', type = 'checkbox', name = '', ...props }, ref) => {
    return (
      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <input
            className={`
            appearance-none
            relative
            h-5
            w-5 
            rounded 
            text-transparent
            border-gray-300 
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

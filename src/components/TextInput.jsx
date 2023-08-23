import React from 'react';

export const TextInput = React.forwardRef(
  (
    { type = '', label = '', placeholder = '', multiple = false, ...rest },
    ref,
  ) => {
    return (
      <React.Fragment>
        <label className="flex flex-col not-italic font-semibold text-base text-color-dark-purple">
          {label}
          <input
            className="mt-[10px] bg-white p-2 border border-solid border-color-border-grey rounded-[5px]"
            type={type}
            ref={ref}
            placeholder={placeholder}
            {...rest}
            multiple={multiple}
          />
        </label>
      </React.Fragment>
    );
  },
);

TextInput.displayName = 'TextInput2';

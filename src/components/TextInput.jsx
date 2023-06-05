import React from 'react';

export const TextInput = React.forwardRef(
  (
    { type = '', label = '', placeholder = '', multiple = false, ...rest },
    ref,
  ) => {
    return (
      <React.Fragment>
        <label>
          {label}
          <input
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
import React, { forwardRef } from 'react';
import Select from 'react-select';

export const SelectField = forwardRef(function SelectField(
  { value, options, onChange },
  ref,
) {
  const defaultValue = options.find((item) => item.value === value);
  return (
    <Select
      styles={{
        control: (styles, state) => ({
          ...styles,
          marginTop: '10px',
          border: '1px solid #e1e1e1',
          borderRadius: '4px',
          outline: 'none',
          borderColor: state.isFocused ? '#86b7fe !important' : '#e1e1e1',
          boxShadow: state.isFocused
            ? '0 0 0 0.25rem rgba(13,110,253,0.25)'
            : '',
          transition: '0.3s ease-in-out',
        }),
      }}
      ref={ref}
      defaultValue={defaultValue}
      options={options}
      onChange={(e) => onChange(e.value)}
    />
  );
});

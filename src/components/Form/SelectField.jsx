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
          padding: '6px',
          marginTop: '10px',
          fontWeight: '400',
          border: '1px solid #e1e1e1',
          borderRadius: '4px',
          outline: 'none',
          borderColor: state.isFocused ? '#86b7fe !important' : '#e1e1e1',
          boxShadow: state.isFocused
            ? '0 0 0 0.25rem rgba(13,110,253,0.25)'
            : '',
          transition: '0.3s ease-in-out',
          scrollbarWidth: '5px',
          scrollbarColor: 'red',
        }),
        singleValue: (styles) => ({
          ...styles,
          color: '#646481',
        }),
        placeholder: (styles) => ({
          ...styles,
          color: '#646481',
        }),
        container: (styles) => ({
          ...styles,
          scrollbarWidth: '5px',
          scrollbarColor: 'red',
        }),
      }}
      ref={ref}
      defaultValue={defaultValue}
      options={options}
      onChange={(e) => onChange(e.value)}
    />
  );
});

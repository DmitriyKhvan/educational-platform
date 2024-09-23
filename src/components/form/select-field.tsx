import { forwardRef, useMemo } from 'react';
import type { Props as SelectProps, SingleValue, StylesConfig } from 'react-select';
import Select from 'react-select';

interface OptionType {
  value?: string;
  label?: string;
}

interface SelectFieldProps extends Omit<SelectProps<OptionType, false>, 'value' | 'onChange'> {
  value?: string;
  options: OptionType[];
  onChange: (value: string) => void;
  isDisabled?: boolean;
  styles?: StylesConfig<OptionType, false>;
}

export const SelectField = forwardRef<any, SelectFieldProps>(
  ({ value, options, onChange, isDisabled, styles, ...props }, ref) => {
    const defaultValue = options.find((item) => item.value === value) as SingleValue<OptionType>;

    const selectStyle = useMemo(() => {
      return (
        styles || {
          control: (provided, state) => ({
            ...provided,
            padding: '6px',
            marginTop: '10px',
            fontWeight: '400',
            border: '1px solid #e1e1e1',
            borderRadius: '4px',
            outline: 'none',
            borderColor: state.isFocused ? '#86b7fe !important' : '#e1e1e1',
            boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13,110,253,0.25)' : '',
            transition: '0.3s ease-in-out',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            background: isDisabled ? '#DEDDDF' : 'white',
            color: isDisabled ? '#AAA8A8' : 'black',
          }),
          singleValue: (provided) => ({
            ...provided,
            color: '#646481',
          }),
          placeholder: (provided) => ({
            ...provided,
            color: '#646481',
          }),
          container: (provided) => ({
            ...provided,
          }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }
      );
    }, [styles, isDisabled]);

    return (
      <Select
        styles={selectStyle}
        ref={ref}
        value={defaultValue}
        isDisabled={isDisabled}
        options={options}
        onChange={(e) => onChange(e?.value ?? '')}
        {...props}
      />
    );
  },
);

SelectField.displayName = 'SelectField';

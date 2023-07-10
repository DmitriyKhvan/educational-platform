import { forwardRef } from 'react';
import InputField from './InputField';
import InputFieldError from './InputFieldError';

const InputWithError = forwardRef(function InputWithError(
  {
    errorsField = {},
    label = '',
    placeholder = '',
    type = 'text',
    autoComplete = 'off',
    ...props
  },
  ref,
) {
  return (
    <InputFieldError errorsField={errorsField}>
      <InputField
        type={type}
        label={label}
        placeholder={placeholder}
        autoComplete={autoComplete}
        ref={ref}
        {...props}
      />
    </InputFieldError>
  );
});

export default InputWithError;

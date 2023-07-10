import { forwardRef } from 'react';

const InputField = forwardRef(function InputField(
  {
    label = '',
    type = 'text',
    placeholder = '',
    autoComplete = 'off',
    ...props
  },
  ref,
) {
  return (
    <label className="form-label">
      <div className="label">{label}</div>
      <input
        className="form-control"
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        ref={ref}
        {...props}
      />
    </label>
  );
});

export default InputField;

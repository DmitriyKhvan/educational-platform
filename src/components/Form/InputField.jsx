import { forwardRef } from 'react';

const InputField = forwardRef(function InputField(props, ref) {
  const {
    label = '',
    type = 'text',
    placeholder = '',
    autoComplete = 'off',
  } = props;
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

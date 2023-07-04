const InputField = (props) => {
  const {
    label = '',
    type = 'text',
    placeholder = '',
    autoComplete = 'off',
    register = {},
  } = props;
  return (
    <label className="form-label">
      <div className="label">{label}</div>
      <input
        className="form-control"
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...register}
      />
    </label>
  );
};

export default InputField;

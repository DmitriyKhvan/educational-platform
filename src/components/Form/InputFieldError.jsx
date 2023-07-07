const InputFieldError = ({ errorsField, children }) => {
  return (
    <div className="form-item-inner">
      {children}

      {errorsField && <p className="error-msg">{errorsField.message}</p>}
    </div>
  );
};

export default InputFieldError;

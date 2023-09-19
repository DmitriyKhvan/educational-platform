const InputWithError = ({ errorsField, children }) => {
  return (
    <div>
      {children}

      {errorsField && (
        <p className="text-sm text-color-magenta mt-1">{errorsField.message}</p>
      )}
    </div>
  );
};

export default InputWithError;

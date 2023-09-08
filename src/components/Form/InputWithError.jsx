const InputWithError = ({ errorsField, children }) => {
  return (
    <div
      className="
      text-color-dark-purple
      font-inter
      text-sm
      font-semibold
      leading-5
    "
    >
      {children}

      {errorsField && (
        <p className="text-color-magenta mt-1">{errorsField.message}</p>
      )}
      {/* {JSON.stringify(errorsField, null, 2)} */}
    </div>
  );
};

export default InputWithError;

const InputWithError = ({ errorsField, children }) => {
  return (
    <div>
      {children}

      {errorsField && (
        <p className="text-[#df1b41] mt-1">{errorsField.message}</p>
      )}
      {/* {JSON.stringify(errorsField, null, 2)} */}
    </div>
  );
};

export default InputWithError;

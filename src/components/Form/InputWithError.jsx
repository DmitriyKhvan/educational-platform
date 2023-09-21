const InputWithError = ({ errorsField, children, className = '' }) => {
  return (
    <div
      className={`
        text-color-dark-purple
        font-inter
        text-sm
        leading-5
        ${className}
      `}
    >
      {children}

      {errorsField && (
        <p className="text-[#df1b41] mt-1">{errorsField.message}</p>
      )}
      {/* {JSON.stringify(errorsField, null, 2)} */}
    </div>
  );
};

export default InputWithError;

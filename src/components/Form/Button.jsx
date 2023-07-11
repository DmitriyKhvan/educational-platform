const Button = (props) => {
  const { type = 'button', disabled = false, children } = props;

  return (
    <button
      disabled={disabled}
      type={type}
      className="
          w-full p-5 
          text-color-white 
          bg-color-purple 
          rounded-md 
          font-semibold 
          text-base 
          disabled:opacity-60 
          cursor-pointer
        "
    >
      {children}
    </button>
  );
};

export default Button;

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
          focus:border-color-light-blue 
          focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)]
          transition ease-in-out duration-300
        "
    >
      {children}
    </button>
  );
};

export default Button;

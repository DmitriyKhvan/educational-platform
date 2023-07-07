const Button = (props) => {
  const { type = 'button', disabled = false, children } = props;

  return (
    <button
      disabled={disabled}
      type={type}
      className="btn btn-primary btn-lg p-3"
    >
      {children}
    </button>
  );
};

export default Button;

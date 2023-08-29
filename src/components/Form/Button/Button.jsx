import cls from './Button.module.css';

const Button = (props) => {
  const {
    type = 'button',
    disabled = false,
    children,
    className,
    theme,
    ...otherProps
  } = props;

  return (
    <button
      disabled={disabled}
      type={type}
      {...otherProps}
      className={`${cls.btn} ${cls[theme]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

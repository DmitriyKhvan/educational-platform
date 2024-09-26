import cls from '@/components/form/button/button.module.css';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme?:
    | 'purple'
    | 'blue'
    | 'green'
    | 'red'
    | 'gray'
    | 'outline'
    | 'clear'
    | 'destructive'
    | 'dark_purple';
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    type = 'button',
    disabled = false,
    children,
    className = '',
    theme = 'purple',
    ...otherProps
  } = props;

  return (
    <button
      disabled={disabled}
      type={type}
      {...otherProps}
      className={`${cls.btn} ${cls[theme]} ${className}`}
      ref={ref}
    >
      {children}
    </button>
  );
});

export default Button;

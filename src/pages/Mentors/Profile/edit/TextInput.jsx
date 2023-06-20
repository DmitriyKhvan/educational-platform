import cls from '../EditTutorProfile.module.scss';
import { forwardRef } from 'react';

export const TextInput = forwardRef(
  ({ type = '', placeholder = '', disabled, label = '', ...rest }, ref) => {
    return (
      <div className={cls.form_divider}>
        <p>{label}</p>
        <input
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          ref={ref}
          {...rest}
        />
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';

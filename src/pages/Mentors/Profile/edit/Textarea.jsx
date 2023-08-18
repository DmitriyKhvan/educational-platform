import cls from '../EditMentorProfile.module.scss';
import { forwardRef } from 'react';

export const Textarea = forwardRef(
  (
    {
      placeholder = '',
      label = '',
      text = '',
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cls.form_divider}>
        <p className={cls.label}>{label}</p>
        <p className={cls.text}>{text}</p>
        <textarea
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

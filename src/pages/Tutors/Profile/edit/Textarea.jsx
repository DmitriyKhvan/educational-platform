import cls from '../EditTutorProfile.module.scss';
import { forwardRef, useState, useEffect } from 'react';

export const Textarea = forwardRef(
  (
    {
      placeholder = '',
      label = '',
      text = '',
      user = 0,
      setState = 0,
      state = 0,
      ...rest
    },
    ref,
  ) => {
    const [, setCount] = useState(0);

    function renderCount() {
      if (state !== 0) {
        setCount(state);
      } else if (user !== 0) {
        setCount(user);
      } else {
        setCount(0);
      }
    }

    useEffect(() => {
      renderCount();
    }, [state, user]);

    return (
      <div className={cls.form_divider}>
        <p className={cls.label}>{label}</p>
        <p className={cls.text}>{text}</p>
        <textarea
          placeholder={placeholder}
          ref={ref}
          {...rest}
          onChange={(e) => setState(e.target.value.length)}
        ></textarea>
        {/* <p className={cls.rule}>{t('textarea_limits', { count })}</p> */}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

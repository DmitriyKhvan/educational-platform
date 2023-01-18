import React from "react";

import cls from "../EditTutorProfile.module.scss"

export const Textarea = React.forwardRef(({
  value="",
  label="",
  text="",
  ...rest
}, ref) => {
  return (
   <div className={cls.form_divider}>
     <p className={cls.label}>{label}</p>
     <p className={cls.text}>{text}</p>
     <textarea 
        value={value}
        ref={ref}
        {...rest}
      >
    </textarea>
    <p className={cls.rule}>400 characters minimum. 0 characters currrently.</p>
   </div>
  )
})
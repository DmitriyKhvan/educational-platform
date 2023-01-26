import React from "react";

import cls from "../EditTutorProfile.module.scss";

export const TextInput = React.forwardRef(({
  type="",
  placeholder="",
  label="",
  ...rest
}, ref) => {
  return (
   <div className={cls.form_divider}>
     <p>{label}</p>
     <input 
        type={type}
        placeholder={placeholder}
        ref={ref}
        {...rest}
     />
   </div>
  )
})
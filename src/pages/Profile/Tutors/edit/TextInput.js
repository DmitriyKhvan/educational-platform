import React from "react";



export const TextInput = React.forwardRef(({
  type="",
  placeholder="",
  label="",
  ...rest
}, ref) => {
  return (
   <div className="form_divider">
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
import React from "react";



export const Textarea = React.forwardRef(({
  placeholder="",
  label="",
  text="",
  ...rest
}, ref) => {
  return (
   <div className="form_divider">
     <p className="label">{label}</p>
     <p className="text">{text}</p>
     <textarea 
        placeholder={placeholder}
        ref={ref}
        {...rest}
      >
    </textarea>
    <p className="rule">400 characters minimum. 0 characters currrently.</p>
   </div>
  )
})
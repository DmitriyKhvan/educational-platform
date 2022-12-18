import React from 'react'

export const TextInput = React.forwardRef(({
  type="",
  placeholder="",
  label="",
  ...rest
}, ref) => {
  return (
    <React.Fragment>
      <label>
        {label}
        <input 
          type={type}
          placeholder={placeholder}
          ref={ref}
          {...rest}
        />
      </label>
    </React.Fragment>
  )
})
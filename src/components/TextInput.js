import React from 'react'

export const TextInput = React.forwardRef(({
  type="",
  value="",
  label="",
  ...rest
}, ref) => {
  return (
    <React.Fragment>
      <label>
        {label}
        <input 
          type={type}
          value={value}
          ref={ref}
          {...rest}
        />
      </label>
    </React.Fragment>
  )
})
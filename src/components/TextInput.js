import React from 'react'

export const TextInput = React.forwardRef(({
  type="",
  defaultValue="",
  label="",
  multiple=false,
  ...rest
}, ref) => {
  return (
    <React.Fragment>
      <label>
        {label}
        <input 
          type={type}
          defaultValue={defaultValue}
          ref={ref}
          {...rest}
          multiple={multiple}
        />
      </label>
    </React.Fragment>
  )
})
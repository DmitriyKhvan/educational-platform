import React from 'react'

const RadioGroup = ({ onChange, className, options, name }) => {
  return (
    <div className={'radio-group ' + className}>
      {options.map(option => (
        <label htmlFor={option.name}>
          <input
            onChange={e => onChange(e.target.value)}
            id={option.name}
            type='radio'
            name={name}
            value={option.name}
          />
          {option.text}
        </label>
      ))}
    </div>
  )
}

export default RadioGroup

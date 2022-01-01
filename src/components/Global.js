import PhoneInput from 'react-phone-input-2'
import Select from 'react-select'

const customStyles = {
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isFocused ? '#FAFAFA' : null,
    color: '#1A1A1A',
    padding: '10px 0 10px 20px',
    fontSize: 20,
    fontWeight: isSelected ? 600 : 400,
    fontFamily: 'Source Sans Pro'
  }),
  dropdownIndicator: (styles, state) => ({
    ...styles,
    transform: state.selectProps.menuIsOpen && 'rotate(180deg)'
  })
}

export const renderFormField = (
  key,
  label,
  onChange,
  formData,
  formDataError,
  type = 'text',
  placeholder
) => (
  <div className='form-row'>
    <div className='form-item'>
      <div className='form-item-inner'>
        <label htmlFor={key}>{label}</label>
        {type === 'textfield' ? (
          <textarea
            type={type}
            id={key}
            rows={2}
            name={key}
            value={formData[key] || ''}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value, key)}
          />
        ) : (
          <input
            type={type}
            id={key}
            name={key}
            value={formData[key] || ''}
            onChange={e => onChange(e.target.value, key)}
            placeholder={placeholder}
          />
        )}
      </div>
      {formDataError && formDataError[key] && (
        <p className='error-msg'>{formDataError[key] || ''}</p>
      )}
    </div>
  </div>
)

export const renderSelect = (
  key,
  label,
  placeholder,
  options,
  selectedOption,
  onChange,
  rules,
  errorMsg,
  disabled = false,
  isMulti = false
) => (
  <div className='form-row'>
    <div className='form-item'>
      <div className='form-item-inner'>
        <label htmlFor={key}>{label}</label>
        <Select
          isMulti={isMulti}
          value={selectedOption}
          disabled={disabled}
          onChange={onChange}
          options={options}
          styles={customStyles}
          placeholder={placeholder}
          classNamePrefix='form-select'
          className='form-select'
          name={key}
          rules={rules}
          getOptionValue={option => option.value}
          getOptionLabel={option => option.label}
        />
      </div>
      {errorMsg && <p className='error-msg'>{errorMsg}</p>}
    </div>
  </div>
)

export const renderPhonenumber = (onChange, formData, errorMsg, label) => (
  <div className='form-row'>
    <div className='form-item'>
      <div className='form-item-inner'>
        <label htmlFor='email'>{label}</label>
        <PhoneInput
          specialLabel={label}
          country={'us'}
          value={formData.phone_number}
          onChange={phone => onChange(`+${phone}`, 'phone_number')}
          inputProps={{
            name: 'phone_number',
            required: true
          }}
        />
      </div>
      {errorMsg && <p className='error-msg'>{errorMsg}</p>}
    </div>
  </div>
)

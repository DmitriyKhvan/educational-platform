export const renderFormField = (
  key,
  label,
  onChange,
  formData,
  formDataError,
  type = 'text',
  placeholder,
) => (
  <div className="form-row">
    <div className="form-item">
      <div className="form-item-inner">
        <label htmlFor={key}>{label}</label>
        {type === 'textfield' ? (
          <textarea
            type={type}
            id={key}
            rows={2}
            name={key}
            value={formData[key] || ''}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value, key)}
          />
        ) : (
          <input
            type={type}
            id={key}
            name={key}
            value={formData[key] || ''}
            onChange={(e) => onChange(e.target.value, key)}
            placeholder={placeholder}
          />
        )}
      </div>
      {formDataError && formDataError[key] && (
        <p className="error-msg">{formDataError[key] || ''}</p>
      )}
    </div>
  </div>
);

const CheckboxField = (props) => {
  const { label = '', onChange = () => {}, register = {} } = props;

  return (
    <div className="flex gap-2">
      <input
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
        id="check"
        {...register}
      />
      <label style={{ userSelect: 'none' }} htmlFor="check">
        {label}
      </label>
    </div>
  );
};

export default CheckboxField;

const CheckboxField = (props) => {
  const { label = '', onChange = () => {}, register = {} } = props;

  return (
    <>
      <input
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
        id="check"
        {...register}
      />
      <label style={{ userSelect: 'none' }} htmlFor="check">
        {label}
      </label>
    </>
  );
};

export default CheckboxField;

export const selectStyle = {
  control: (styles, state) => ({
    ...styles,
    minWidth: '160px',
    padding: '10px',
    borderRadius: '8px',
    borderColor: state.isFocused ? '#86b7fe' : '#e1e1e1',
    boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13,110,253,0.25)' : '',
    fontSize: '15px',
    cursor: 'pointer',
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    padding: 0,
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none',
  }),
};

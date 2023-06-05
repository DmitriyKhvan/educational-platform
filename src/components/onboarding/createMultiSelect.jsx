export function createMultiSelect(options, field, register, errorMessage = '') {
  return options.map((option, i) => (
    <div className="w-full" key={option}>
      <input
        type="radio"
        id={option}
        value={option}
        className="peer hidden"
        onClick={() => {
          document.querySelector('form').requestSubmit();
        }}
        defaultChecked={i === 0}
        {...register(field, {
          required: errorMessage,
        })}
      />
      <label
        htmlFor={option}
        tabIndex={i + 1}
        autoFocus={i === 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
        className="peer-checked:border-purple-400 duration-150 peer-checked:bg-purple-200 flex bg-gray-50 border-2 rounded-md py-2 pl-3 peer-checked:font-bold"
      >
        {option}
      </label>
    </div>
  ));
}

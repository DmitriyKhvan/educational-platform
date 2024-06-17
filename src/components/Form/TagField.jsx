import { forwardRef } from 'react';
import { cn } from 'src/shared/utils/functions';
// import { cn } from 'src/utils/functions';

const TagField = forwardRef(
  (
    { label = '', type = 'checkbox', name = '', className, onChange, ...props },
    ref,
  ) => {
    return (
      <label
        className={cn(
          'has-[:checked]:bg-color-purple has-[:checked]:text-white transition-colors text-color-dark-violet text-[13px] px-4 py-[10px] rounded-full border border-color-border-grey shadow-[0px_0px_8px_0px_#00000014] cursor-pointer',
          className,
        )}
      >
        <input
          className="hidden"
          onChange={onChange}
          type={type}
          name={name}
          id={name}
          ref={ref}
          {...props}
        />
        {label}
      </label>
    );
  },
);

TagField.displayName = 'TagField';

export default TagField;

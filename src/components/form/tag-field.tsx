import { cn } from '@/shared/utils/functions';
import { forwardRef } from 'react';

interface TagFieldProps {
  label?: string;
  type?: 'checkbox' | 'radio'; // Assuming these are the only types you want to support
  name?: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any; // For other props like 'checked', 'defaultChecked', etc.
}

const TagField = forwardRef<HTMLInputElement, TagFieldProps>(
  ({ label = '', type = 'checkbox', name = '', className, onChange, ...props }, ref) => {
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

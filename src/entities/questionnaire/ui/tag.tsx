import { type FC, type ForwardedRef, type HtmlHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/utils/functions';

interface TagProps extends HtmlHTMLAttributes<HTMLInputElement> {
  active?: boolean;
  icon?: React.ReactNode;
  label: string;
  value?: string;
  className?: string;
  reff?: ForwardedRef<HTMLLabelElement>;
  type?: 'checkbox' | 'radio';
}

export const Tag: FC<TagProps> = forwardRef(function Tag(
  { active, icon, value, label, className, type = 'checkbox', reff, ...props },
  ref: ForwardedRef<HTMLLabelElement>,
) {
  return (
    <label
      ref={reff ? reff : ref}
      className={cn(
        `flex items-center gap-2 px-3 py-[10px] border border-gray-200 rounded-3xl
        cursor-pointer text-sm`,
        className,
        active && 'border-transparent bg-color-purple/10 text-color-purple',
      )}
    >
      <input className="hidden" type={type} value={value} {...props} />

      {icon && icon}
      <span className="font-medium">{label}</span>
    </label>
  );
});

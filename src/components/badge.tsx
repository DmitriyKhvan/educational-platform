import { cn } from '@/shared/utils/functions';

export const Badge = ({
  count,
  className,
}: {
  count: number;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'absolute top-[-6px] right-[-6px] z-[5] flex items-center justify-center w-4 h-4 rounded-full bg-color-magenta font-semibold text-[10px] text-white',
        className,
      )}
    >
      {count}
    </div>
  );
};

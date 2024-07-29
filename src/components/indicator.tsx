import { cn } from '@/shared/utils/functions';

const Indicator = ({
  children,
  className = 'bg-gray-300 text-gray-700',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  if (!children) return <></>;

  return (
    <div
      className={cn(
        'inline-block bg-opacity-20 text-sm font-medium px-[10px] py-[5px] sm:px-3 sm:py-[6px] rounded-2xl',
        className,
      )}
    >
      <span className="flex items-center justify-center gap-1 whitespace-nowrap truncate">
        {children}
      </span>
    </div>
  );
};

export default Indicator;

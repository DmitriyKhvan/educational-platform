export const Badge = ({
  count,
}: {
  count: number;
}) => {
  return (
    <div className="absolute top-[-6px] right-[-6px] z-[5] flex items-center justify-center w-4 h-4 rounded-full bg-color-magenta font-semibold text-[10px] text-white">
      {count}
    </div>
  );
};

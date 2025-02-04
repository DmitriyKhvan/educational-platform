export const SkeletonTimesheets = () => {
  return (
    <div className="animate-pulse">
      <div className="flex-1 space-y-3">
        <div className="h-[50px] bg-slate-200 rounded" />
        <div className="h-[50px] bg-slate-200 rounded" />
        <div className="h-[50px] bg-slate-200 rounded" />
      </div>
    </div>
  );
};

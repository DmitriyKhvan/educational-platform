import React from 'react';

export const SkeletonTimesheets = () => {
  return (
    <div className="animate-pulse">
      <div className="flex-1 space-y-3">
        <div className="h-[62px] bg-slate-200 rounded"></div>
        <div className="h-[62px] bg-slate-200 rounded"></div>
        <div className="h-[62px] bg-slate-200 rounded"></div>
      </div>
    </div>
  );
};

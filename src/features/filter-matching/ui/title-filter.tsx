import type { FC } from 'react';

export interface TitleFilterProps {
  count: number;
  title: string;
}

export const TitleFilter: FC<TitleFilterProps> = ({ count, title }) => {
  return (
    <span className="space-x-2">
      <span>{title}</span>
      {count > 0 && (
        <span className="px-[6px] py-[2px] rounded-md bg-color-purple/10 text-xs font-medium text-color-purple">
          {count}
        </span>
      )}
    </span>
  );
};

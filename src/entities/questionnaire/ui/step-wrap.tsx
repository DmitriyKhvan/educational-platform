import type { FC, ReactNode } from 'react';
import { cn } from '@/shared/utils/functions';

type StepWrapProps = {
  tag?: boolean;
  title: string;
  subTitle: string;
  children: ReactNode;
};

export const StepWrap: FC<StepWrapProps> = ({ tag, title, subTitle, children }) => {
  return (
    <>
      <h2 className={cn('text-center text-[30px] font-bold leading-[120%] mb-10', tag && 'mb-3')}>
        {title}
      </h2>

      <h4 className={cn('text-gray-400 mb-4 font-normal', tag && 'text-center mb-12')}>
        {subTitle}
      </h4>

      {children}
    </>
  );
};

import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from 'src/utils/functions';

const MyDropdownMenu = ({
  setOpen,
  open,
  button,
  children,
  contentClassName = '',
  align = 'start',
}) => {
  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>{button}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            'min-w-[200px] bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-30',
            contentClassName,
          )}
          sideOffset={10}
          align={align}
        >
          {children}
          {/* <DropdownMenu.Arrow className="fill-white" /> */}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default MyDropdownMenu;

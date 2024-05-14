import React from 'react';
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';

import {
  IoIosCheckmarkCircle,
  IoIosArrowDown,
  // IoIosArrowUp,
} from 'react-icons/io';

// import { FaCircle } from 'react-icons/fa';

const MySelect = ({ options }) => (
  <Select.Root>
    <Select.Trigger
      className="inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-violet-300 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 outline-none"
      aria-label="Food"
    >
      <Select.Value placeholder="Select a fruit…" />
      <Select.Icon className="text-violet-300">
        <IoIosArrowDown />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        side="top"
        align="start"
        className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
      >
        {/* <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet-300 cursor-default">
          <IoIosArrowUp />
        </Select.ScrollUpButton> */}
        <Select.Viewport className="p-[5px]">
          {options?.map((item) => {
            return (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            );
          })}
        </Select.Viewport>
        {/* <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet-300 cursor-default">
          <IoIosArrowDown />
        </Select.ScrollDownButton> */}
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

// eslint-disable-next-line react/display-name
const SelectItem = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames(
          'text-[13px] leading-none text-violet-300 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1',
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>

        {/* <FaCircle className="absolute right-0 w-[25px]" /> */}

        <Select.ItemIndicator className="absolute right-0 w-[25px] inline-flex items-center justify-center z-30">
          <IoIosCheckmarkCircle />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);

export default MySelect;

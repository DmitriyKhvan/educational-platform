import React from 'react';
import * as Select from '@radix-ui/react-select';
// import * as ScrollArea from '@radix-ui/react-scroll-area';
import classnames from 'classnames';

import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { FaCircleCheck, FaCircle } from 'react-icons/fa6';

// import { FaCircle } from 'react-icons/fa';

const MySelect = ({ options, onChange, value }) => (
  <Select.Root defaultValue={value} onValueChange={onChange}>
    <Select.Trigger
      className="
      inline-flex 
      items-center 
      justify-between 
      rounded-md 
      px-[15px] 
      leading-none 
      w-full h-[50px] 
      gap-[5px] 
      bg-white 
      text-color-light-grey 
      border
      border-[#e6e6e6] 
      focus:border-[hsla(210,_96%,_45%,_50%)] 
      focus:ring-[#2563eb00]
      focus:shadow-[0px_1px_1px_rgba(0,_0,_0,_0.03),_0_0_0_3px_hsla(210,_96%,_45%,_25%),_0_1px_1px_0_rgba(0,_0,_0,_0.08)]
      transition ease-in-out duration-300
      placeholder:text-slate-400
      placeholder:font-normal
      disabled:cursor-not-allowed
    disabled:bg-[#DEDDDF]
      disabled:text-[#AAA8A8];
      data-[placeholder]:text-violet9 
      outline-none"
      aria-label="Food"
    >
      <Select.Value placeholder="Select an option…" />
      <Select.Icon className="text-color-light-grey">
        <IoIosArrowDown />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content
        // position="popper"
        // sideOffset={5}
        // side="bottom"
        // align="end"
        className="
        overflow-auto 
        bg-white 
        rounded-md 
        shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]
        z-30"
      >
        <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet-300 cursor-default">
          <IoIosArrowUp />
        </Select.ScrollUpButton>
        {/* <ScrollArea.Root type="auto"> */}
        <Select.Viewport className="py-3">
          {/* <ScrollArea.Viewport> */}
          {options?.map((item) => {
            return (
              <SelectItem
                key={item.value}
                value={item.value}
                defaultValue={value}
              >
                {item.label}
              </SelectItem>
            );
          })}
          {/* </ScrollArea.Viewport> */}
        </Select.Viewport>
        {/* </ScrollArea.Root> */}
        <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet-300 cursor-default">
          <IoIosArrowDown />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

// eslint-disable-next-line react/display-name
const SelectItem = React.forwardRef(
  ({ children, className, defaultValue, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames(
          `text-[15px] 
          leading-none 
          text-color-dark-purple
          flex items-center 
          justify-between
          px-3
          h-10 
          relative 
          select-none 
          data-[disabled]:text-mauve8 
          data-[disabled]:pointer-events-none 
          data-[highlighted]:outline-none 
          data-[highlighted]:bg-color-purple 
          data-[highlighted]:text-white
          border-b
          border-color-border-grey
          group
          `,
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>
          {children}
          {props.value !== defaultValue && (
            <FaCircle className="absolute right-0 mr-3 top-1/2 -translate-y-1/2 text-xl text-[#F5F5F5]" />
          )}
        </Select.ItemText>

        <Select.ItemIndicator className="absolute right-0 mr-3 inline-flex items-center justify-center z-30">
          <FaCircleCheck className="text-xl text-color-purple group-hover:text-white group-data-[highlighted]:text-white" />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);

export default MySelect;

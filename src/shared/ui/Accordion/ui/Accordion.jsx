import React, { forwardRef } from 'react';
import { FaAngleUp } from 'react-icons/fa6';
import { cn } from 'src/shared/utils/functions';
import * as Accordion from '@radix-ui/react-accordion';

export const AccordionItem = forwardRef(function AccordionItem(
  { children, className, ...props },
  forwardedRef,
) {
  return (
    <Accordion.Item
      className={cn(
        'mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Item>
  );
});

export const AccordionTrigger = forwardRef(function AccordionTrigger(
  { children, className, ...props },
  forwardedRef,
) {
  return (
    <Accordion.Header className="flex">
      <Accordion.Trigger
        className={cn(
          'hover:bg-gray-50 group flex h-[45px] flex-1 cursor-default items-center justify-between bg-white px-5 text-[15px] leading-none border-b outline-none',
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <FaAngleUp
          className="ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </Accordion.Trigger>
    </Accordion.Header>
  );
});

export const AccordionContent = forwardRef(function AccordionContent(
  { children, className, ...props },
  forwardedRef,
) {
  return (
    <Accordion.Content
      className={cn(
        'p-4 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px] border-b',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Content>
  );
});

export const AccordionRoot = forwardRef(function AccordionRoot(
  { children, className, ...props },
  forwardedRef,
) {
  return (
    <Accordion.Root
      className={cn('w-full', className)}
      type="single"
      defaultValue="item-1"
      collapsible
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Root>
  );
});

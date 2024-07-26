import { cn } from "@/shared/utils/functions";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import type React from "react";
import { forwardRef } from "react";

const Tabs = TabsPrimitive.Root;

interface TabsListProps
	extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
	className?: string;
}

const TabsList = forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	TabsListProps
>(({ className, ...props }, ref) => (
	<TabsPrimitive.List
		ref={ref}
		className={cn("inline-flex h-12", className)}
		{...props}
	/>
));
TabsList.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps
	extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
	className?: string;
}

const TabsTrigger = forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	TabsTriggerProps
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={cn(
			"first:rounded-l-lg last:rounded-r-lg inline-flex first:border-l border border-l-0 hover:bg-color-dark-purple hover:text-white items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-white data-[state=active]:bg-color-dark-purple",
			className,
		)}
		{...props}
	/>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

interface TabsContentProps
	extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
	className?: string;
}

const TabsContent = forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	TabsContentProps
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content ref={ref} className={cn(className)} {...props} />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

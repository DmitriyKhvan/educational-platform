import { cn } from "@/shared/utils/functions";
import { forwardRef } from "react";

export const TextareaField = forwardRef(
	(
		{
			placeholder = "",
			label = "",
			text = "",
			className = "w-[570px] h-[300px]",
			...props
		},
		ref,
	) => {
		return (
			<div className="">
				{label && (
					<p className="font-semibold text-[17px] leading-[21px] tracking-[-0.6px] text-color-dark-purple">
						{label}
					</p>
				)}
				{text && (
					<p className="font-medium leading-[23px] mt-[10px] tracking-[-0.6px] text-color-light-grey">
						{text}
					</p>
				)}
				<textarea
					className={cn(
						`bg-white 
            border
            border-solid
            border-color-border-grey
            font-inter 
            text-sm 
            text-color-dark-purple
            font-normal
            leading-[22px]
            tracking-[-0.5px]
            shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.04)]
            p-[15px]`,
						className,
					)}
					placeholder={placeholder}
					ref={ref}
					{...props}
				></textarea>
			</div>
		);
	},
);

TextareaField.displayName = "Textarea";

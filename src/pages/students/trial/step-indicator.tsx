import { cn } from "@/shared/utils/functions";


const StepIndicator = ({ step }) => {
	return (
		<div className="max-w-[440px] mx-auto mb-6 sm:mb-10">
			<h2 className="text-color-purple text-sm mb-3">Step {step + 1}/4</h2>
			<div className="flex justify-between w-full space-x-2">
				<span
					className={cn(
						"w-full h-[5px] sm:h-[6px] bg-color-border rounded-3xl",
						step >= 0 && "bg-color-purple",
					)}
				/>
				<span
					className={cn(
						"w-full h-[5px] sm:h-[6px] bg-color-border rounded-3xl",
						step >= 1 && "bg-color-purple",
					)}
				/>
				<span
					className={cn(
						"w-full h-[5px] sm:h-[6px] bg-color-border rounded-3xl",
						step >= 2 && "bg-color-purple",
					)}
				/>
				<span
					className={cn(
						"w-full h-[5px] sm:h-[6px] bg-color-border rounded-3xl",
						step >= 3 && "bg-color-purple",
					)}
				/>
			</div>
		</div>
	);
};

export default StepIndicator;

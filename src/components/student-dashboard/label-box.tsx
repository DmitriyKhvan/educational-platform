import { cn } from "@/shared/utils/functions";


const LabelBox = ({ label, content, preElement = undefined }) => {
	return (
		<div
			className={cn(
				"w-full h-[61px] bg-gray-50 px-4 py-3 rounded-lg overflow-hidden truncate flex",
			)}
		>
			{preElement}
			<div className="overflow-hidden truncate">
				<label className="text-xs font-medium text-gray-300 block">
					{label}
				</label>
				<p className="overflow-hidden truncate">{content}</p>
			</div>
		</div>
	);
};

export default LabelBox;

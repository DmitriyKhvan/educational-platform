import { parse } from "date-fns";
import { format } from "date-fns-tz";
import { AdaptiveDialog } from "@/shared/ui/adaptive-dialog/index.jsx";
import { formatTime } from "@/pages/mentors/availability/lib/format-time";
import { formatTimeToSeconds } from "@/pages/mentors/availability/lib/format-time-to-seconds";
import { AvailabilityExceptionPicker } from "@/pages/mentors/availability-exceptions/availability-exception-picker";

export const AvailabilityExceptionModal = ({
	availabilityExceptions,
	exception,
	slot,
	onSubmit,
	disabledDates,
}) => {
	return (
		<AdaptiveDialog
			button={
				<button className="flex w-[90%]">
					<span className="basis-[45%] text-left">
						{format(
							parse(exception.date, "yyyy-MM-dd", new Date()),
							"dd MMM yyyy",
						)}
					</span>
					{slot && (
						<span className="basis-[55%] text-left">
							<span>
								{formatTime(formatTimeToSeconds(slot.from), "hh:mm a")}
							</span>{" "}
							-{" "}
							<span>{formatTime(formatTimeToSeconds(slot.to), "hh:mm a")}</span>
						</span>
					)}
				</button>
			}
		>
			<AvailabilityExceptionPicker
				oldException={exception}
				onSubmit={onSubmit}
				disabledDates={disabledDates.filter((date) => {
					return (
						date.toString() !==
						parse(exception.date, "yyyy-MM-dd", new Date()).toString()
					);
				})}
				availabilityExceptions={availabilityExceptions}
			/>
		</AdaptiveDialog>
	);
};

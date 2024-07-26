import { useContext } from "react";
import { ScheduleContext } from "@/pages/students/schedule-lesson/schedule-selector/schedule-provider/lib/schedule-context";

export const useSchedule = () => {
	return useContext(ScheduleContext);
};

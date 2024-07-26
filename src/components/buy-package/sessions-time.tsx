// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

export const SessionsTime = memo(function SessionsTime({
	uniqueSessionsTime,
	setSelectedSessionTime,
	selectedSessionTime,
} : {
	uniqueSessionsTime: number[];
	setSelectedSessionTime: (sessionTime: number) => void;
	selectedSessionTime: number | null;
}) {
	const [t] = useTranslation(["common", "purchase"]);
	const [parent] = useAutoAnimate();

	return (
		<div>
			<h4 className="text-[15px] font-semibold leading-[18px] mb-4">
				3. {t("duration", { ns: "purchase" })}
			</h4>
			<div className="grid grid-cols-2 md:flex gap-3" ref={parent}>
				{uniqueSessionsTime.map((sessionTime) => {
					return (
						<label key={sessionTime}>
							<input
								type="radio"
								name="sessionTime"
								checked={sessionTime === selectedSessionTime}
								className="hidden peer"
								onChange={() => {
									setSelectedSessionTime(sessionTime);
								}}
							/>

							<div className="flex justify-center md:w-[188px] p-4 rounded-lg border border-color-border-grey peer-checked:text-color-purple peer-checked:border-color-purple/50 peer-checked:bg-[#F3EAFD] hover:border-color-purple/50 transition duration-300 ease-in-out cursor-pointer">
								<span className="text-sm truncate">
									{sessionTime} {t("minutes", { ns: "common" })}
								</span>
							</div>
						</label>
					);
				})}
			</div>
		</div>
	);
});

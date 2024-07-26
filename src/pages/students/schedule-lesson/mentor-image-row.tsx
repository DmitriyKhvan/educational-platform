import Button from "@/components/form/button";

import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/widgets/avatar/avatar";

const MentorImageRow = ({ mentor, setTabIndex, isMentorScheduled }) => {
	const { avatar, gender, firstName, lastName, university, degree } = mentor;
	const navigate = useNavigate();
	return (
		<div className="flex items-center justify-between gap-4 sm:gap-8 border w-full border-color-border-grey rounded-lg bg-white p-5 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.04)]">
			<div className="flex gap-4 sm:gap-8 items-center">
				<div className="w-[48px] h-[48px] rounded-full overflow-hidden">
					<Avatar avatarUrl={avatar?.url} gender={gender} />
				</div>
				<div>
					<h1 className="text-color-dark-purple mb-1 sm:mb-2 font-bold text-[16px] sm:text-[18px]">
						{`${firstName} ${lastName && lastName[0] + "."}`}
					</h1>

					<h5 className="flex flex-wrap font-medium text-color-dark-pu?rple text-xs tracking-[-0.2px]">
						<span className="text-color-dark-violet">{university}</span>{" "}
						<span className="text-color-light-grey">
							{degree ? `(${degree})` : ""}
						</span>
					</h5>
				</div>
			</div>
			<div>
				<Button
					className="bg-opacity-10 text-color-purple hover:bg-opacity-100 hover:text-white aspect-square p-1 w-8 h-8"
					onClick={() =>
						isMentorScheduled
							? navigate("/student/mentors-list")
							: setTabIndex(3)
					}
				>
					<FaPencil className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
};

export default MentorImageRow;

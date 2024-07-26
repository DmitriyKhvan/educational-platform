import { useNavigate } from "react-router-dom";
import notify from "@/shared/utils/notify";

import cls from "@/pages/mentors/profile/submit-video/submited.module.scss";

const Submited = () => {
	const navigate = useNavigate();

	return (
		<div className={cls.submited_container}>
			<div className={cls.submited_container_title}>
				<h2>Edit profile</h2>
			</div>
			<div className={cls.submited_container_videoSubmited}>
				<h2>Video Submitted 🎉</h2>
				<div className={cls.submited_container_videoSubmited_card}>
					<h3>We’ll review and approve your video.</h3>
					<p>Thank you for making your teaching intro video!</p>
					<p>
						<b>Nao Now</b> will review your video and ensure no changes need to
						be made before students are able to book lessons with you.
					</p>
					<p>
						You will receive an email notification when the video review is
						completed.
					</p>
				</div>

				<button
					onClick={() => {
						navigate("/mentor/profile");
						notify("Introduction video is changed!");
					}}
				>
					Return to My Profile
				</button>
			</div>
		</div>
	);
};

export default Submited;

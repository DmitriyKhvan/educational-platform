import React from "react";

import { renderVideo } from "@/shared/utils/render-video";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaVimeo, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useAuth } from "src/app/providers/auth-provider";
import Button from "../../../../components/form/button";
import InputField from "../../../../components/form/input-field";
import InputWithError from "../../../../components/form/input-with-error";
import { MUTATION_UPDATE_MENTOR } from "../../../../shared/apollo/graphql";
import notify from "../../../../shared/utils/notify";

const SubmitVideo = () => {
	const navigate = useNavigate();
	const [typeVideo, setTypeVideo] = React.useState("yt");

	const [t] = useTranslation(["profile", "common"]);
	const [updateMentor, { loading, error }] = useMutation(
		MUTATION_UPDATE_MENTOR,
	);

	const { user, refetchUser } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		mode: "onBlur",
	});

	const handleEditVideo = async (area) => {
		if (area.videoUrl) {
			await updateMentor({
				variables: {
					id: Number.parseInt(user?.mentor?.id),
					data: { videoUrl: renderVideo(area.videoUrl) },
				},
				onCompleted: () => {
					navigate("/mentor/profile/edit/submit-videos/submited");
				},
			});
		}

		await refetchUser();
	};

	if (error) {
		notify(error.message, "error");
	}

	return (
		<div className="p-[50px]">
			<h2 className="text-[40px] leading-[48px] trackign-[-1px]">
				{t("edit_profile")}
			</h2>

			<form
				onSubmit={handleSubmit(handleEditVideo)}
				className="sm:w-1/2 xl:w-[380px]"
			>
				<div>
					<p className="text-[15px] text-color-light-grey font-semibold leading-[18px] tracking-[-0.3px] mb-[15px]">
						{t("prerecorded")}
					</p>
					<p className="text-[15px] text-color-light-grey font-semibold leading-[18px] tracking-[-0.3px] mb-[15px]">
						Upload video via youtube share!
					</p>

					<div className="flex gap-5 mb-5">
						<Button
							onClick={() => setTypeVideo("vm")}
							theme="outline"
							className={typeVideo === "vm" && "bg-color-purple text-white"}
						>
							<span className="flex items-center justify-center gap-[10px]">
								<span>Vimeo</span>
								<FaVimeo className="text-2xl text-color-pale-blue" />
							</span>
						</Button>

						<Button
							onClick={() => setTypeVideo("yt")}
							theme="outline"
							className={typeVideo === "yt" && "bg-color-purple text-white"}
						>
							<span className="flex items-center justify-center gap-[10px]">
								<span>Youtube</span>
								<FaYoutube className="text-2xl text-red-500" />
							</span>
						</Button>
					</div>

					<InputWithError errorsField={errors?.videoUrl}>
						<InputField
							className="w-full"
							placeholder={
								typeVideo === "yt" ? "youtube.com/video" : "vimeo.com/video"
							}
							{...register("videoUrl", {
								required: "Video is required",
								pattern: {
									value: /^(https?:\/\/)?(www\.)?(youtube\.com|vimeo\.com)/,
									message: "Invalid URL. It should be a YouTube or Vimeo URL",
								},
							})}
						/>
					</InputWithError>
				</div>

				<div className="flex gap-[10px] mt-[35px]">
					<Button
						onClick={() => navigate("/mentor/profile/edit")}
						className="w-full"
						theme="outline"
					>
						Cancel and Return
					</Button>
					<Button
						className="w-full"
						theme="outline"
						type="submit"
						disabled={!isValid}
					>
						{loading ? (
							<ClipLoader loading={loading} size={20} color="white" />
						) : (
							"Submit My Video"
						)}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default SubmitVideo;

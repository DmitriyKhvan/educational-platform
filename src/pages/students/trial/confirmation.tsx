import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/form/button";
import { FaArrowLeft, FaPencil } from "react-icons/fa6";

import Loader from "@/components/loader/loader";
import { LOGIN_MUTATION } from "@/shared/apollo/graphql";
import { ATTACH_TRIAL_STUDENT_TO_USER_RESOLVER } from "@/shared/apollo/mutations/trial/attach-trial-student-to-user-resolver";
import { TRIAL_SIGN_UP } from "@/shared/apollo/mutations/trial/trial-sign-up";
import { getTranslatedTitle } from "@/shared/utils/get-translated-title";
import notify from "@/shared/utils/notify";
import { useMutation } from "@apollo/client";
import { addMinutes } from "date-fns";
import { format, toZonedTime } from "date-fns-tz";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/app/providers/auth-provider";
import { localeDic, setItemToLocalStorage } from "src/shared/constants/global";

const Confirmation = ({ setStep, user, selectedPlan, schedule, mentorId }) => {
	const navigate = useNavigate();
	const { user: currentUser, refetchUser } = useAuth();
	const { languageLevel, lessonTopic, packageSubscription } = selectedPlan;

	const [t, i18n] = useTranslation(["trial", "common"]);
	const [signUp] = useMutation(TRIAL_SIGN_UP);
	const [addTrialUser] = useMutation(ATTACH_TRIAL_STUDENT_TO_USER_RESOLVER);
	const [loginMutation] = useMutation(LOGIN_MUTATION);

	const [isLoading, setIsLoading] = useState(false);

	const dateParse = toZonedTime(new Date(schedule), user.timeZone);

	const dayFormat = format(dateParse, "EEEE, MMM dd", {
		timeZone: user.timeZone,
		locale: localeDic[i18n.language],
	});

	const scheduleStartTimeFormat = format(dateParse, "hh:mm a", {
		timeZone: user.timeZone,
		locale: localeDic[i18n.language],
	});

	const scheduleEndTimeFormat = format(
		addMinutes(dateParse, packageSubscription.sessionTime),
		"hh:mm a",
		{
			timeZone: user.timeZone,
			locale: localeDic[i18n.language],
		},
	);

	const trialSignUp = async () => {
		setIsLoading(true);

		try {
			if (currentUser) {
				const trialUserData = await addTrialUser({
					variables: {
						data: {
							user: {
								userId: currentUser.id,
								firstName: user.firstName,
								lastName: user.lastName,
							},
							packageId: Number.parseInt(packageSubscription.id),
							languageLevelId: Number.parseInt(languageLevel.id),
							lessonTopicId: Number.parseInt(lessonTopic.id),
							lessonBooking: {
								mentorId,
								startAt: new Date(schedule),
							},
						},
					},
				});

				setItemToLocalStorage(
					"studentId",
					trialUserData?.data?.attachTrialStudentToUserResolver?.id,
				);
				location.href = "/student/manage-lessons";
			} else {
				await signUp({
					variables: {
						data: {
							user: {
								...user,
								referralCode: localStorage.getItem("referralCode"),
							},
							packageId: Number.parseInt(packageSubscription.id),
							languageLevelId: Number.parseInt(languageLevel.id),
							lessonTopicId: Number.parseInt(lessonTopic.id),
							lessonBooking: {
								mentorId,
								startAt: new Date(schedule),
							},
						},
					},
				});

				localStorage.removeItem("referralCode");
				localStorage.removeItem("referralEmail");

				const { data: loginData } = await loginMutation({
					variables: { email: user.email, password: user.password },
				});

				if (loginData) {
					const studentId = loginData.authResult.user.students[0].id;

					setItemToLocalStorage("token", loginData.authResult.sessionToken);
					setItemToLocalStorage("studentId", studentId);

					refetchUser({ studentId });
					navigate("/trial/thank-you");
				}
			}
		} catch (error) {
			notify(error.message, "error");
		}

		setIsLoading(false);
	};

	return (
		<div className="">
			{isLoading && (
				<div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
					<Loader />
				</div>
			)}
			<div className="mb-2 flex items-center">
				<FaArrowLeft
					className="mr-3 w-[20px] h-[20px] cursor-pointer"
					onClick={() => setStep((v) => v - 1)}
				/>{" "}
				<h1 className="text-3xl font-semibold">{t("confirmation")}</h1>
			</div>

			<p className="mb-8">{t("ensure_everything_below_is_ok")}</p>

			<section className="mb-6">
				<p className="text-sm text-gray-400 font-medium mb-4">
					{t("your_contact_information")}
				</p>
				<div className="w-full border rounded-lg p-5 flex justify-between items-center">
					<div>
						<label className="mb-4 block">
							<span className="text-[13px] text-gray-400 mb-2">
								{t("english_name")}
							</span>
							<p className="text-gray-950 font-medium">{user.firstName}</p>
						</label>

						<label className="mb-4 block">
							<span className="text-[13px] text-gray-400 mb-2">
								{t("email")}
							</span>
							<p className="text-gray-950 font-medium">{user.email}</p>
						</label>
						<label>
							<span className="text-[13px] text-gray-400 mb-2">
								{t("phone_number")}
							</span>
							<p className="text-gray-950 font-medium">{user.phoneNumber}</p>
						</label>
						<label>
							<span className="text-[13px] text-gray-400 mb-2">
								{t("time_zone")}
							</span>
							<p className="text-gray-950 font-medium">{user.timeZone}</p>
						</label>
					</div>
					<div
						onClick={() => setStep(-1)}
						className="bg-color-purple bg-opacity-10 w-7 h-7 rounded-lg flex justify-center items-center cursor-pointer hover:bg-opacity-20 transition-colors"
					>
						<FaPencil className="text-color-purple w-3 h-3" />
					</div>
				</div>
			</section>

			<section className="mb-6">
				<p className="text-sm text-gray-400 font-medium mb-4">
					{t("lesson_details")}
				</p>
				<div className="w-full border rounded-lg p-5 flex justify-between items-center">
					<div>
						<h3 className="font-bold text-lg mb-5">
							{getTranslatedTitle(packageSubscription.course, i18n.language)}
							{/* {packageSubscription.course.title} */}
						</h3>
						<div className="flex gap-6">
							<label className="block">
								<span className="text-[13px] text-gray-400">{t("level")}</span>
								<p className="text-gray-950 font-medium">
									{getTranslatedTitle(languageLevel, i18n.language)}
									{/* {languageLevel.title} */}
								</p>
							</label>

							<label className="block">
								<span className="text-[13px] text-gray-400">
									{t("lesson_topic")}
								</span>
								<p className="text-gray-950 font-medium">
									{getTranslatedTitle(lessonTopic, i18n.language)}
									{/* {lessonTopic.title} */}
								</p>
							</label>
						</div>
					</div>
					<div
						onClick={() => setStep(0)}
						className="bg-color-purple bg-opacity-10 w-7 h-7 rounded-lg flex justify-center items-center cursor-pointer hover:bg-opacity-20 transition-colors"
					>
						<FaPencil className="text-color-purple w-3 h-3" />
					</div>
				</div>
			</section>

			<section className="mb-6">
				<p className="text-sm text-gray-400 font-medium mb-4">
					{t("date_and_time")}
				</p>
				<div className="w-full border rounded-lg p-5 flex justify-between items-center">
					<div>
						<h3 className="font-bold text-lg mb-4">{`${scheduleStartTimeFormat} - ${scheduleEndTimeFormat}`}</h3>
						<p>{dayFormat}</p>
					</div>
					<div
						onClick={() => setStep(1)}
						className="bg-color-purple bg-opacity-10 w-7 h-7 rounded-lg flex justify-center items-center cursor-pointer hover:bg-opacity-20 transition-colors"
					>
						<FaPencil className="text-color-purple w-3 h-3" />
					</div>
				</div>
			</section>

			<Button className="w-full h-14 sm:h-16 my-10" onClick={trialSignUp}>
				{t("continue_button", { ns: "common" })}
			</Button>
		</div>
	);
};

export default Confirmation;

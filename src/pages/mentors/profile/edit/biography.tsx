import { useMutation } from "@apollo/client";

import { useForm } from "react-hook-form";
// import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/app/providers/auth-provider";
import { MUTATION_UPDATE_MENTOR } from "@/shared/apollo/graphql";

import notify from "@/shared/utils/notify";

import { useTranslation } from "react-i18next";
import ReactLoader from "@/components/common/loader";
import Button from "@/components/form/button/button";
import { TextareaField } from "@/components/form/textarea-field";

const Biography = () => {
	const [t] = useTranslation(["profile", "common"]);
	const [updateMentor, { loading }] = useMutation(MUTATION_UPDATE_MENTOR);

	const { user, refetchUser } = useAuth();

	// const navigate = useNavigate();
	const { register, handleSubmit } = useForm({
		defaultValues: {
			introduction: user?.mentor?.introduction,
			relevantExperience: user?.mentor?.relevantExperience,
			uniqueFacts: user?.mentor?.uniqueFacts,
		},
	});

	const handleEditBigraphy = async (area) => {
		await updateMentor({
			variables: {
				id: Number.parseInt(user?.mentor?.id),
				data: area,
			},
			onCompleted: () => {
				notify("Biography information is changed!", "success");
				// navigate('/mentor/profile');
			},
			onError: (error) => {
				notify(error.message, "error");
			},
		});

		await refetchUser();
	};

	return (
		<>
			{loading && <ReactLoader />}
			<form
				onSubmit={handleSubmit(handleEditBigraphy)}
				className="py-[50px] pl-[66px] border-b border-solid border-color-border-grey"
				id="bio"
			>
				<h2 className="mb-5 text-[27px] font-medium leading-[33px] tracking-[-1px] text-color-dark-purple">
					{t("biography")}
				</h2>

				<div className="w-[570px]">
					<TextareaField
						placeholder={t("bio_intro")}
						label=""
						text={t("bio_intro")}
						{...register("introduction")}
					/>
				</div>

				<div className="w-[570px]">
					<TextareaField
						placeholder={t("bio_experience")}
						label={t("bio_experience_label")}
						text={t("bio_experience")}
						{...register("relevantExperience")}
					/>
				</div>

				<div className="w-[570px]">
					<TextareaField
						placeholder={t("bio_facts")}
						label={t("bio_facts_label")}
						text={t("bio_facts")}
						{...register("uniqueFacts")}
					/>
				</div>

				<Button className="w-[420px]" type="submit">
					{t("save", { ns: "common" })}
				</Button>
			</form>
		</>
	);
};

export default Biography;

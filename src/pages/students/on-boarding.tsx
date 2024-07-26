import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useMutation } from "@apollo/client";
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { SIGN_UP } from "../../shared/apollo/graphql";

import Button from "@/components/form/button";
import Loader from "../../components/loader/loader";

import InputField from "@/components/form/input-field";
import InputWithError from "@/components/form/input-with-error";
import PhoneNumberField from "@/components/form/phone-number-field";
import { SelectField } from "@/components/form/select-field";
import notify from "@/shared/utils/notify";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useLogin } from "src/app/providers/auth-provider";
import { timezoneOptions } from "src/shared/constants/global";
// import MySelect from 'src/components/Form/MySelect';

export default function Onboarding() {
	const [t] = useTranslation(["onboarding", "common", "translations"]);

	const [isShowPassword, setIsShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [parent] = useAutoAnimate();

	const {
		handleSubmit,
		register,
		control,
		resetField,
		formState: { errors, isValid },
		setValue,
		watch,
	} = useForm({
		mode: "onChange",
		defaultValues: { phoneNumber: "", phoneNumberWithoutCode: "" },
	});

	const { login, data: loginData } = useLogin();
	const [signUp] = useMutation(SIGN_UP);

	const onSubmit = async (data) => {
		setIsLoading(true);

		try {
			await signUp({
				variables: {
					...data,
				},
			});

			await login(data.email, data.password);
		} catch (error) {
			notify(error.message, "error");
		}

		setIsLoading(false);
	};

	useEffect(() => {
		if (loginData) {
			location.href = "/purchase";
		}
	}, [loginData]);

	return (
		<>
			{isLoading && (
				<div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
					<Loader />
				</div>
			)}

			<form
				ref={parent}
				onSubmit={handleSubmit(onSubmit)}
				className="max-w-[440px] m-auto"
			>
				<fieldset className="flex flex-col space-y-4" ref={parent}>
					<legend className="text-[32px] sm:text-4xl sm:text-center font-bold">
						{t("lets_get_started", { ns: "onboarding" })}
					</legend>

					<InputWithError errorsField={errors?.firstName}>
						<InputField
							className="w-full"
							label={t("first_name", { ns: "common" })}
							placeholder={t("first_name", { ns: "common" })}
							autoFocus
							{...register("firstName", {
								required: t("required_first_name", { ns: "translations" }),
								focus: true,
							})}
						/>
					</InputWithError>

					<InputWithError errorsField={errors?.lastName}>
						<InputField
							className="w-full"
							label={t("last_name", { ns: "common" })}
							placeholder={t("last_name", { ns: "common" })}
							{...register("lastName", {
								required: t("required_last_name", { ns: "translations" }),
							})}
						/>
					</InputWithError>

					<InputWithError
						errorsField={errors?.phoneNumberWithoutCode ?? errors?.phoneNumber}
					>
						<PhoneNumberField
							register={register}
							resetField={resetField}
							setValue={setValue}
							watch={watch}
						/>
					</InputWithError>

					<InputWithError errorsField={errors?.email}>
						<InputField
							className="w-full"
							label={t("email", { ns: "common" })}
							placeholder="student@example.com"
							autoComplete="on"
							{...register("email", {
								required: t("required_email", { ns: "common" }),
								validate: {
									isEmail: (value) => {
										const emailRegex =
											/^[a-z0-9_\-.]+@([a-z0-9_-]+\.)+[a-z0-9_-]{2,4}$/;
										return (
											emailRegex.test(value) ||
											t("invalid_email", { ns: "onboarding" })
										);
									},
								},
							})}
						/>
					</InputWithError>

					<InputWithError errorsField={errors?.timeZone}>
						<label className="font-semibold text-base text-color-dark-purple mb-2">
							{t("time_zone", { ns: "common" })}
						</label>
						<Controller
							control={control}
							defaultValue=""
							name="timeZone"
							rules={{
								required: true,
							}}
							render={({ field: { value, onChange } }) => (
								<SelectField
									// menuPortalTarget={document.body}
									menuPlacement="auto"
									value={value}
									options={timezoneOptions}
									onChange={onChange}
								/>
							)}
						/>

						{/* <Controller
                control={control}
                defaultValue=""
                name="timeZone"
                rules={{
                  required: true,
                }}
                render={({ field: { value, onChange } }) => (
                  <MySelect
                    value={value}
                    options={timezoneOptions}
                    onChange={onChange}
                  />
                )}
              /> */}
					</InputWithError>

					<InputWithError errorsField={errors?.password}>
						<InputField
							className="w-full"
							label={t("password", { ns: "common" })}
							placeholder="at least 8 characters"
							type={isShowPassword ? "text" : "password"}
							icon={
								isShowPassword ? (
									<BsEyeSlashFill className="text-2xl text-color-purple" />
								) : (
									<BsEyeFill className="text-2xl text-color-purple" />
								)
							}
							classNameIcon="cursor-pointer px-[15px]"
							iconHandler={() => setIsShowPassword(!isShowPassword)}
							{...register("password", {
								required: t("required_password", { ns: "common" }),
							})}
						/>
					</InputWithError>
				</fieldset>

				<Button
					disabled={!isValid}
					className="w-full my-8 sm:my-10 sm:text-[15px] h-[58px] sm:h-16"
					type="submit"
				>
					{t("create_account", { ns: "onboarding" })}
				</Button>

				<p className="text-[18px] text-color-light-grey font-semibold">
					{t("already_have_account", { ns: "common" })}{" "}
					<Link
						to="/"
						className="text-color-purple underline underline-offset-2"
					>
						{t("sign_in", { ns: "common" })}
					</Link>
				</p>
			</form>
		</>
	);
}

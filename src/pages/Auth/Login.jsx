import Button from "src/components/Form/Button/Button";
import InputField from "src/components/Form/InputField";
import InputWithError from "src/components/Form/InputWithError";
import notify from "src/shared/utils/notify";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useLogin } from "src/app/providers/AuthProvider";
import KakaoLoginButton from "./kakao-login-button";
// import { useAuth } from 'src/app/providers/AuthProvider';

const Login = () => {
	// const loc = useLocation();
	// const fromPage = loc.state?.from?.pathname || '/';
	// console.log('fromPage', fromPage);

	// const { logout } = useAuth();
	// useEffect(() => {
	//   logout();
	// }, []);

	const [t] = useTranslation("common");

	const [isShowPassword, setIsShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm({
		mode: "onChange",
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const { login, loading, error, data } = useLogin();

	const handleLogin = ({ email, password }) => {
		login(email, password);
	};

	useEffect(() => {
		if (!data) {
			return;
		}

		if (data?.authResult?.user?.students.length) {
			location.href =
				data?.authResult?.user?.students.length > 1
					? "/select-profile"
					: "/student/manage-lessons";
		} else {
			location.href = "/mentor/manage-appointments";
		}
	}, [data]);

	useEffect(() => {
		if (error) {
			// notify(t('login_failed'), 'error');
			notify(error.message, "error");
		}
	}, [error]);

	return (
		<form
			onSubmit={handleSubmit(handleLogin)}
			className="flex flex-col space-y-10 max-w-[440px] m-auto"
		>
			<fieldset>
				<legend className="text-[32px] mb-10 sm:text-4xl sm:text-center font-bold">
					{t("login")}
				</legend>
				<div className="flex flex-col space-y-6">
					<InputWithError errorsField={errors?.email}>
						<InputField
							className="w-full"
							label={t("email")}
							placeholder="name@email.com"
							autoComplete="on"
							{...register("email", {
								required: t("required_email"),
								pattern: {
									value:
										/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
									message: t("error_invalid_email"),
								},
							})}
						/>
					</InputWithError>

					<InputWithError errorsField={errors?.password}>
						<InputField
							className="w-full"
							label={t("password")}
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
							placeholder="at least 8 characters"
							{...register("password", {
								required: t("required_password"),
							})}
						/>

						{/* <div className="mt-3">
                <CheckboxField
                  label="Show Password"
                  name="isShowPassword"
                  onChange={(e) => setIsShowPassword(e.target.checked)}
                />
              </div> */}
					</InputWithError>

					<Link to="/forgot-password" className="forgot-password">
						{t("forgot_password")}
					</Link>
				</div>
			</fieldset>

			{/* <div className="d-grid gap-2"> */}
			<Button
				type="submit"
				disabled={!isValid}
				theme="purple"
				className="w-full"
			>
				{loading ? (
					<ClipLoader loading={loading} size={20} color="white" />
				) : (
					t("sign_in")
				)}
			</Button>
			{/* </div> */}
			<KakaoLoginButton />

			<p className="mt-16 text-[15px] text-color-light-grey font-semibold">
				{t("not_registered")}{" "}
				<Link
					to="/onboarding"
					className="text-color-purple underline underline-offset-2"
				>
					{t("signup")}
				</Link>
			</p>
		</form>
	);
};

export default Login;

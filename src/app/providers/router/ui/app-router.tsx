import Loader from "@/components/loader/loader";
import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "src/app/providers/auth-provider";

import NotFoundPage from "@/pages/notFoundPage";
import { Layout, OnboardingLayout } from "src/shared/layouts";
import { MentorRoute, StudentRoute } from "..";
import { LoginRoute } from "../lib/login-route";

const Login = lazy(() => import("@/pages/auth/login"));
const ForgotPassword = lazy(() => import("src/pages/auth/ForgotPassword"));

const ResetPassword = lazy(() => import("src/pages/auth/ResetPassword"));
const Onboarding = lazy(() => import("@/pages/students/on-boarding"));
const TrialMarketingChannel = lazy(
	() => import("@/pages/trial-marketing-channel"),
);
const Trial = lazy(() => import("src/pages/students/trial"));
const IsReferal = lazy(() => import("src/pages/students/referal"));

const AddStudentProfile = lazy(
	() => import("@/pages/auth/select-profile/AddProfile"),
);
const BuyPackage = lazy(() => import("@/pages/students/buy-package"));
const ConfirmPayment = lazy(() => import("@/pages/confirm-payment"));
const StripePayment = lazy(() => import("@/pages/students/stripe-payment"));
const SelectProfile = lazy(() => import("@/components/select-profile"));
const StudentPages = lazy(() => import("src/pages/students"));
const MentorPages = lazy(() => import("src/pages/mentors"));

export const AppRouter = () => {
	const { isLoading } = useAuth();

	React.useEffect(() => {
		window.scrollTo({
			top: 0,
		});
	});

	if (isLoading) return <Loader height={"100vh"} />;

	return (
		<Routes>
			<Route path="/" element={<OnboardingLayout />}>
				{/* <Route exact path="/" element={Login} /> */}
				<Route
					index
					element={
						<LoginRoute>
							<Login />
						</LoginRoute>
					}
				/>
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/reset-password" element={<ResetPassword />} />
				<Route path="/welcome-set-password" element={<ResetPassword />} />

				<Route path="/onboarding" element={<Onboarding />} />
				<Route exact path="/trial" element={<Trial />} />
				<Route
					exact
					path="/trial/thank-you"
					element={<TrialMarketingChannel />}
				/>
			</Route>

			<Route
				path="/referral/:referralcode"
				element={
					<Suspense
						fallback={
							<div className="flex justify-center items-center h-screen w-full">
								<Loader height="100vh" />
							</div>
						}
					>
						<IsReferal />
					</Suspense>
				}
			/>

			<Route
				path="/"
				element={
					<StudentRoute>
						<OnboardingLayout />
					</StudentRoute>
				}
			>
				<Route
					exact
					path="/add-student-profile"
					element={<AddStudentProfile />}
				/>

				<Route exact path="/purchase" element={<BuyPackage />} />

				<Route
					exact
					path="/purchase/:packageId/complete"
					element={<ConfirmPayment />}
				/>

				<Route
					exact
					path="/purchase/:packageId/payment/:clientSecret"
					element={<StripePayment />}
				/>

				<Route path="/select-profile" element={<SelectProfile />} />
			</Route>

			<Route
				path="/"
				element={
					<StudentRoute>
						<Layout />
					</StudentRoute>
				}
			>
				<Route path="student/*" element={<StudentPages />} />
			</Route>

			<Route
				path="/"
				element={
					<MentorRoute>
						<Layout />
					</MentorRoute>
				}
			>
				<Route path="mentor/*" element={<MentorPages />} />
			</Route>

			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
};

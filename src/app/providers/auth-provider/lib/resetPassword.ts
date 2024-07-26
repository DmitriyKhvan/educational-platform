import { RESET_PASSWORD_MUTATION } from "@/shared/apollo/graphql";
import { useMutation } from "@apollo/client";

export const useResetPassword = () => {
	const [sendUserPasswordResetLink, { loading, error, data }] = useMutation(
		RESET_PASSWORD_MUTATION,
	);

	const resetPassword = (email: string, locale: string) => {
		sendUserPasswordResetLink({
			variables: { email, locale },
		});
	};

	return { resetPassword, loading, error, data };
};

import { useMutation } from "@apollo/client";
import { RESET_PASSWORD_MUTATION } from "../../../../shared/apollo/graphql";

export const useResetPassword = () => {
	const [sendUserPasswordResetLink, { loading, error, data }] = useMutation(
		RESET_PASSWORD_MUTATION,
	);

	const resetPassword = (email, locale) => {
		sendUserPasswordResetLink({
			variables: { email, locale },
		});
	};

	return { resetPassword, loading, error, data };
};

import { NEW_PASSWORD_MUTATION } from "@/shared/apollo/graphql";
import { useMutation } from "@apollo/client";

export const useNewPassword = () => {
	const [redeemUserPasswordResetToken, { loading, error, data }] = useMutation(
		NEW_PASSWORD_MUTATION,
	);

	const newPassword = (token: string, password: string) => {
		redeemUserPasswordResetToken({
			variables: { token, password },
		});
	};

	return { newPassword, loading, error, data };
};

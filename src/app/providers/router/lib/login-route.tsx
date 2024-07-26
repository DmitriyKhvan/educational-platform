
import { Navigate } from "react-router-dom";
import { Roles } from "@/shared/constants/global";
import { useAuth } from "@/app/providers/auth-provider/lib/use-auth";

export const LoginRoute = ({ children }) => {
	const { user } = useAuth();

	if (user?.role === Roles.STUDENT) {
		return <Navigate to="/student/manage-lessons" />;
	}

	if (user?.role === Roles.MENTOR) {
		return <Navigate to="/mentor/manage-appointments" />;
	}

	return children;
};

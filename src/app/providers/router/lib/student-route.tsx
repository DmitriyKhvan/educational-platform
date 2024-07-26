
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/app/providers/auth-provider";
import { Roles, getItemToLocalStorage } from "@/shared/constants/global";

export const StudentRoute = ({ children }) => {
	const location = useLocation();
	const { user } = useAuth();

	if (user?.role === Roles.STUDENT && getItemToLocalStorage("studentId")) {
		return children;
	}

	return <Navigate to="/" state={{ from: location }} />;
};

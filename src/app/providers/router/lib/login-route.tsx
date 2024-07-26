import { useAuth } from "@/app/providers/auth-provider/lib/use-auth";
import { Roles } from "@/shared/constants/global";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const LoginRoute = ({ children }: { children: ReactNode }) => {
	const { user } = useAuth();

	if (user?.role === Roles.STUDENT) {
		return <Navigate to="/student/manage-lessons" />;
	}

	if (user?.role === Roles.MENTOR) {
		return <Navigate to="/mentor/manage-appointments" />;
	}

	return children;
};

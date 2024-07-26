import React from "react";
import { Navigate } from "react-router-dom";
import { Roles } from "src/shared/constants/global";
import { useAuth } from "../../auth-provider";

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

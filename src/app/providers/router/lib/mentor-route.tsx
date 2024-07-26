import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "src/app/providers/auth-provider";
import { Roles } from "src/shared/constants/global";

export const MentorRoute = ({ children }) => {
	const location = useLocation();
	const { user } = useAuth();

	if (user?.role === Roles.MENTOR) {
		return children;
	}

	return <Navigate to="/" state={{ from: location }} />;
};

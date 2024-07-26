import { useContext } from "react";
import { AuthContext } from "@/app/providers/auth-provider/lib/auth-context";

export const useAuth = () => {
	return useContext(AuthContext);
};

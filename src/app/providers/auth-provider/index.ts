import { useLogin } from "./lib/login";
import { useNewPassword } from "./lib/newPassword";
import { useResetPassword } from "./lib/resetPassword";
import { useAuth } from "./lib/use-auth";
import { AuthProvider } from "./ui/auth-provider";

export { AuthProvider, useAuth, useLogin, useNewPassword, useResetPassword };

import { useLogin } from "@/app/providers/auth-provider/lib/login";
import { useNewPassword } from "@/app/providers/auth-provider/lib/newPassword";
import { useResetPassword } from "@/app/providers/auth-provider/lib/resetPassword";
import { useAuth } from "@/app/providers/auth-provider/lib/use-auth";
import { AuthProvider } from "@/app/providers/auth-provider/ui/auth-provider";

export { AuthProvider, useAuth, useLogin, useNewPassword, useResetPassword };

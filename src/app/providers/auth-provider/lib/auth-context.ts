import type { InviteSetPasswordMutationData } from '@/app/providers/auth-provider/ui/auth-provider';
import type { AuthStudent, AuthenticatedUser } from '@/types/types.generated';
import { createContext } from 'react';

export interface AuthContextType {
  user: AuthenticatedUser | null;
  refetchUser: (student?: { studentId?: number }) => void;
  logout: () => void;
  inviteSetPassword: (
    email: string,
    token: string,
    password: string,
  ) => Promise<{ data?: InviteSetPasswordMutationData | null }>;
  isLoading: boolean;
  isAuthorized: boolean;
  currentStudent: AuthStudent | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

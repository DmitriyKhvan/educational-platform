import type { InviteSetPasswordMutationData } from '@/app/providers/auth-provider/ui/auth-provider';
import type { AuthenticatedUser, Student } from '@/types/types.generated';
import { createContext } from 'react';

export interface AuthContextType {
  user: AuthenticatedUser | null;
  refetchUser: () => void;
  logout: () => void;
  inviteSetPassword: (
    email: string,
    token: string,
    password: string,
  ) => Promise<{ data?: InviteSetPasswordMutationData | null }>;
  isLoading: boolean;
  isAuthorized: boolean;
  currentStudent: Student | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { AuthContext, type AuthContextType } from '@/app/providers/auth-provider/lib/auth-context';
import { useContext } from 'react';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

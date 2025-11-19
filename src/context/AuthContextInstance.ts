import { createContext } from 'react';
import type { AuthContextType } from '../utils/auth';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

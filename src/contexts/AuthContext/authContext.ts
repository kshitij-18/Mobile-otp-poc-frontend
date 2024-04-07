import { createContext } from 'react';
import { AuthHelper } from './authHelper';

export type userType = {
    mobileNumber: string,
    email: string,
    name: string,
} 

type AuthContextTypes = {
    user: userType,
    setUser: React.Dispatch<React.SetStateAction<userType>>,
    isAuthenticated: boolean,
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    authHelper: AuthHelper,
}

const authHelperInstance = new AuthHelper()
const initialValue: AuthContextTypes = {
    user: {
        mobileNumber: '',
        email: '',
        name: '',
    },
    setUser: () => {},
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    authHelper: authHelperInstance,
}

export const AuthContext = createContext(initialValue);

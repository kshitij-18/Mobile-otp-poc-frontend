import { ReactElement, useState } from 'react'
import { AuthContext, userType } from './authContext';
import { AuthHelper } from './authHelper';

type AuthContextProviderProps = {
    children: ReactElement,
}


const AuthContextProvider = ({children}: AuthContextProviderProps) => {
    const [user, setUser] = useState<userType>({
        mobileNumber: '',
        name: '',
        email: '',
    });
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  return (
   <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, authHelper: new AuthHelper() }}>
    {children}
   </AuthContext.Provider>
  )
}

export default AuthContextProvider
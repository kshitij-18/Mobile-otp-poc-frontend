import { useContext, useState } from 'react'
import AuthContext from '../contexts/AuthContext'
import TextField from '@mui/material/TextField';
import EastIcon from '@mui/icons-material/East';
import { IconButton } from '@mui/material';
import {z} from 'zod';
import { Link, useNavigate } from '@tanstack/react-router';


const HomePage = () => {
    const {
        user,
        isAuthenticated,
        setUser,
        setIsAuthenticated,
        authHelper,
    } = useContext(AuthContext);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const numberSchema = z.string().max(10, 'Phone Number is too long.').
    min(10, 'PhoneNumber is too short').
    regex(/^[6-9]\d{9}$/, 'Phone Number is not correct')
    return (
        <>
            {
                isAuthenticated ? (<div>Hello {user.name}</div>) : (
                    <>
                        <h1>
                            Let's Start With your Phone Number.
                        </h1>
                        <TextField id="outlined-basic"
                            label="Phone Number"
                            variant="outlined" 
                            value={user.mobileNumber}
                            onChange={e => {
                                const value = e.target.value;
                                const { success: validated } = numberSchema.safeParse(value);
                                if (!validated && value.length) {
                                    setError(true);
                                } else {
                                    setError(false);
                                }
                                setUser(prev => ({ ...prev, mobileNumber: value }));
                            }}
                            error={error}
                            helperText={error && "Incorrect Phone Number"}
                        />
                        <IconButton size='large' disabled={error || !user.mobileNumber.length} onClick={async () => {
                            // try {
                            //     authHelper.generateOtp(user.mobileNumber);
                            //     <Link to="/"
                            // } catch (error) {
                                
                            // }
                            authHelper.generateOtp(user.mobileNumber)
                            console.log('BUTTON CLICKED');
                            navigate({
                                to: '/verifyOtp',
                                replace: true,
                            });
                        }}>
                            <EastIcon />
                        </IconButton>
                    </>

                )
            }
        </>
    )
}

export default HomePage
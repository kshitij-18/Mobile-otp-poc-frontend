import { AxiosError } from "axios";
import { axiosInstance } from "../../api";
import { NotFoundError } from "../../errors/NotFoundError";
import CustomOtpError from "../../errors/CustomOtpError";

export class AuthHelper {
    constructor() {

    }

    async generateOtp(mobileNumber: string) {
        const { status } = await axiosInstance.post('/auth/createOtp', {
            mobileNumber,
        });
        return status;
    }

    async verifyOtpAndUser(otp: string, mobileNumber: string) {
       try {
        console.log('OTP', otp, 'MOB', mobileNumber);
        const { status } = await axiosInstance.post('/auth/verifyOtp', {
            otp,
            mobileNumber,
        });
        return status;
       } catch (error) {
            if (error instanceof NotFoundError && error.code) {
                if (error.code === 404) {
                    return error.code;
                }
            } else {
                if (error instanceof AxiosError) {
                    throw new CustomOtpError({ message: error.response?.data.message, type: error?.response?.data?.type });
                }
            }
       }
    }

    async signUp(mobileNumber: string, email: string, name: string) {
        try {
            const { status, data } = await axiosInstance.post('/auth/signUp', {
                mobileNumber,
                name,
                email,
            });
            return {
                status, data
            };
        } catch (error) {
            throw new Error('Sign Up Attempt failed.');
        }
    }

    async signIn(mobileNumber: string) {
        try {
            const { status } = await axiosInstance.post('/auth/signIn', {
                mobileNumber,
            });
            return status;
        } catch (error) {
            throw new Error('Sign In Attempt failed.');
        }
    }
}
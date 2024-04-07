import { otpErrorEnum } from "../constants";

type ICustomOtpErrorParams = {
    message: string,
    type: otpErrorEnum,
}

class CustomOtpError extends Error {
    type;
    constructor (params: ICustomOtpErrorParams) {
        super(params.message);
        this.message = params.message;
        this.type = params.type;
    }
}

export default CustomOtpError;
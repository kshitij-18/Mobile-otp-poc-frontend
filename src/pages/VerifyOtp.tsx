import { useState, useEffect, useContext } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import { z } from "zod";
import AuthContext from "../contexts/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { Button, Typography } from "@mui/material";
import { otpErrorEnum } from "../constants";
import CustomOtpError from "../errors/CustomOtpError";


const numberSchema = z.coerce.number();


type IOtpError = {
  message: string | null;
  type: otpErrorEnum | null,
};

const VerifyOtp = () => {
  const [seconds, setSeconds] = useState(30);
  const [otp, setOtp] = useState("");
  const [regeneratedAt, setRegeneratedAt] = useState(new Date());
  const [otpError, setOtpError] = useState<IOtpError>({
    message: null,
    type: null,
  });
  const { authHelper, user } = useContext(AuthContext);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((sec) => {
        if (sec > 0) {
          return sec - 1;
        }
        return sec;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [regeneratedAt]);
  const navigate = useNavigate();
  const handleChange = (value: string) => {
    if (!value.length) {
      if (otpError.type !== otpErrorEnum.Expired) {
        setOtpError({
          message: null,
          type: null,
        })
      }
    }
    setOtp(value);
  };

  useEffect(() => {
    if (seconds === 0) {
      setOtpError({
        message: "Otp expiration reached. Click the try again button to regenrate the token.",
        type: otpErrorEnum.Expired,
      })
    }
  }, [seconds]);
  const handleComplete = async (value: string) => {
    try {
      const response = await authHelper.verifyOtpAndUser(value, user.mobileNumber);
      if (response === 404) {
        // navigate user to signup screen
        navigate({
          to: "/signup",
        });
      } else {
        // log the user in and navigate back to homepage. with is authenticated true
      }
    } catch (error) {
        if (error instanceof CustomOtpError) {
            setOtpError({
              message: error.message,
              type: error.type,
            })
        }
    }
  };
  return (
    <>
      <h1>Your Otp Please..</h1>
      <p>Your Otp expires in {seconds} seconds.</p>
      <MuiOtpInput
        value={otp}
        onChange={handleChange}
        onComplete={handleComplete}
        length={4}
        autoFocus
        validateChar={(value) => {
          const safeParsedValue = numberSchema.safeParse(value);
          if (safeParsedValue.success) {
            return true;
          }
          return false;
        }}
      />
      {
        otpError.type === otpErrorEnum.Expired && (
          <Button onClick={async () => {
            await authHelper.generateOtp(user.mobileNumber);
            setRegeneratedAt(new Date());
            setSeconds(30);
            setOtpError({
              message: null,
              type: null
            })
          }}>Regenrate Otp</Button>
        )
      }
      <Typography color={"red"} variant="inherit" marginTop={"1rem"}>{otpError?.message}</Typography>
    </>
  );
};

export default VerifyOtp;

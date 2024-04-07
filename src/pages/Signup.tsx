import { useContext, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { ZodError, z } from "zod";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email("Please enter a valid email"),
});

const Signup = () => {
  const { authHelper, user, setUser, setIsAuthenticated } = useContext(AuthContext);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string | null }>({
    name: null,
    email: null,
  })
  const [userForm, setUserForm] = useState<typeof user>({
    email: "",
    mobileNumber: user.mobileNumber,
    name: "",
  });
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldValidator = formSchema.pick({ [name]: true });
    try {
      setUserForm(form => ({
        ...form,
        [name]: value,
      }))
      fieldValidator.parse({ [name]: value });
      setFieldErrors(fe => ({
        ...fe,
        [name]: null,
      }))
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors[0]?.message;
        setFieldErrors(fe => ({
          ...fe,
          [name]: errorMessage
        }))
      }
    }
  };
  return (
    <>
      <Typography variant="h4">
        Hmm. looks like you have'nt signed up lets do that real quick shall we.
      </Typography>
      <Grid container spacing={2} marginTop={"2rem"} marginBottom={"2rem"}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
            name="email"
            value={userForm.email}
            required
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            name="name"
            required
            value={userForm.name}
            error={!!fieldErrors.name}
            helperText={fieldErrors.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Mobile Number"
            variant="outlined"
            fullWidth
            disabled
            required
            name="mobileNumber"
            value={userForm.mobileNumber}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="outlined"
        color="primary"
        onClick={async () => {
          try {
            formSchema.parse(userForm);
            const { data: { user } } = await authHelper.signUp(userForm.mobileNumber, userForm.email, userForm.name);
            setIsAuthenticated(true);
            setUser(user)
            navigate({
              to:'/',
              replace: true,
            })
          } catch (error) {
            if (error instanceof ZodError) {
              error.errors.forEach(ef => {
                const { path, message } = ef;
                const [pathString] = path;
                setFieldErrors(fe => ({
                  ...fe,
                  [pathString]: message,
                }))
              })
            }
          }
        }}
      >
        Sign Up
      </Button>
    </>
  );
};

export default Signup;

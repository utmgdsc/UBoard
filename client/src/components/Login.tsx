import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { useNavigate, useLocation } from "react-router-dom";

import ServerApi from "../api/v1/index";

function Login(props: { handleChange: Function; showAlert: Function }) {
  const api = new ServerApi();

  const navigate = useNavigate();
  const location = useLocation();

  const previousPath = location.state?.from?.pathname || "/dashboard";

  // create hooks for username and password
  const [loginForm, setLoginForm] = useState({
    userName: "",
    password: "",
  });

  const [loginFormErrors, setLoginFormErrors] = useState({
    userName: "",
    password: "",
  });

  const formIsMissingFields = () => {
    for (const key in loginForm) {
      if (loginForm[key as keyof typeof loginForm] === "") {
        return true;
      }
    }
    return false;
  };

  const getErrorMessages = () => {
    let msg = "";
    for (const key in loginFormErrors) {
      const err = loginFormErrors[key as keyof typeof loginFormErrors];
      msg += err === "" ? err : `${err}.\n`;
    }
    msg = msg.slice(0, -1);
    return msg;
  };

  /**
   * Validates all input forms except for `confirmPass` input
   * @param regexPattern  pattern to match
   * @param checkString   string to verify
   * @param setHook       set function for the input's hook
   * @param errorMessage  error message to display for that input field
   */
  const validateBlur = (
    regexPattern: RegExp,
    checkString: string,
    setHook: Function,
    errorMessage: string
  ) => {
    // only check for the confirm password field

    if (!regexPattern.test(checkString)) {
      setHook(errorMessage);
    } else {
      setHook("");
    }
  };

  // handle function for submitting username and password
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // no refresh; default

    const msg = getErrorMessages();
    if (msg !== "") {
      console.warn(msg);
      props.showAlert("warning", msg);
      return;
    }

    if (formIsMissingFields()) {
      const msg = "Please fill in all the fields.";
      console.warn(msg);
      props.showAlert("warning", msg);
      return;
    }

    try {
      const result = await api.signIn(loginForm);
      if (!result) {
        throw new Error("Error occurred during sign in.");
      }
      if (result.error) {
        if (!result.error.response) {
          throw new Error("Missing error response.");
        }
        const msg = result.error.response.data.message;
        console.error(msg);
        props.showAlert("error", "An error occurred logging you in. Please try again later.");
      } else {
        navigate(previousPath, { replace: true });
      }
    } catch (error) {
      console.error(error);
      props.showAlert("error", "An error occurred logging you in. Please try again later.");
    }
  };

  const handleFormInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleError =
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (msg: string) => {
      return setLoginFormErrors({
        ...loginFormErrors,
        [e.target.name]: msg,
      });
    };

  return (
    <Box
      data-testid="LogInTab"
      sx={{
        mx: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      overflow="auto"
      maxHeight="70vh"
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        data-testid="form"
        sx={{ mt: 1 }}
      >
        <TextField
          name="userName"
          margin="normal"
          label="Username"
          onChange={handleFormInput}
          fullWidth
          required
          data-testid="userNameForm"
          onBlur={(e) =>
            validateBlur(
              /^[a-zA-Z0-9]+$/,
              loginForm.userName,
              handleError(e),
              "Please enter a valid username"
            )
          }
          error={loginFormErrors.userName !== ""}
          helperText={loginFormErrors.userName}
        />
        <TextField
          name="password"
          margin="normal"
          label="Password"
          onChange={handleFormInput}
          fullWidth
          required
          data-testid="passwordForm"
          type="password"
          onBlur={(e) =>
            validateBlur(
              /.{8,}/,
              loginForm.password,
              handleError(e),
              "Ensure password is 8 characters or longer"
            )
          }
          error={loginFormErrors.password !== ""}
          helperText={loginFormErrors.password}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link
              href="#"
              variant="body2"
              onClick={(e) => props.handleChange(e, 1)}
              data-testid="CreateAccountButton"
            >
              Don't have an account? Sign Up
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Login;

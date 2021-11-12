import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircleOutlined from "@mui/icons-material/AddCircleOutlineOutlined";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import ServerApi from "../api/v1/index";

function SignUp(props: { handleChange: Function }) {
  const api = new ServerApi();

  // create hooks for inputs and errors associated
  const [form, setForm] = useState({
    email: "",
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [confirmPass, setConfirmPass] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");

  // handle function
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // no refresh; default

    if (!validateConfirmPass()) {
      const msg = "Passwords do not match.";
      console.error(msg);
      window.alert(msg);
      return;
    }
    try {
      const result = await api.signUp(form);
      if (!result) {
        console.error("Error occurred during post request");
        throw new Error();
      }
      if (result.error) {
        if (!result.error.response) {
          console.error("Missing error response");
          throw new Error();
        }
        const msg = result.error.response.data.message;
        console.error(msg);
        window.alert(`Message: ${msg}`);
      } else {
        window.alert("Email confirmation sent!");
      }
    } catch (error) {
      window.alert("Failed request");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleError =
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (msg: string) => {
      return setErrors({
        ...errors,
        [e.target.name]: msg,
      });
    };

  const validateConfirmPass = (): boolean => {
    if (form.password !== confirmPass) {
      const errMsg = "Password does not match!";
      setConfirmPassError(errMsg);
      return false;
    } else {
      setConfirmPassError("");
      return true;
    }
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

  return (
    <Box
      data-testid="SignUpTab"
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
        <CircleOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        data-testid="form"
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstName"
              label="First Name"
              size="small"
              variant="standard"
              onChange={handleChange}
              fullWidth
              required
              data-testid="firstNameForm"
              onBlur={(e) =>
                validateBlur(
                  /^[a-zA-Z]+$/,
                  form.firstName,
                  handleError(e),
                  "Please enter a valid first name"
                )
              }
              error={errors.firstName !== ""}
              helperText={errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lastName"
              label="Last Name"
              size="small"
              variant="standard"
              onChange={handleChange}
              fullWidth
              required
              data-testid="lastNameForm"
              onBlur={(e) =>
                validateBlur(
                  /^[a-zA-Z]+$/,
                  form.lastName,
                  handleError(e),
                  "Please enter a valid last name"
                )
              }
              error={errors.lastName !== ""}
              helperText={errors.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email Address"
              placeholder="john@mail.utoronto.ca"
              onChange={handleChange}
              fullWidth
              required
              data-testid="emailForm"
              type="email"
              size="small"
              variant="standard"
              onBlur={(e) =>
                validateBlur(
                  /..*@(mail\.|alum\.){0,}utoronto.ca$/,
                  form.email,
                  handleError(e),
                  "Invalid email, only utoronto emails allowed"
                )
              }
              error={errors.email !== ""}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="userName"
              label="Username"
              onChange={handleChange}
              fullWidth
              required
              data-testid="userNameForm"
              size="small"
              variant="standard"
              onBlur={(e) =>
                validateBlur(
                  /^[a-zA-Z0-9]+$/,
                  form.userName,
                  handleError(e),
                  "Please enter a valid username"
                )
              }
              error={errors.userName !== ""}
              helperText={errors.userName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="password"
              label="Password"
              onChange={handleChange}
              fullWidth
              required
              type="password"
              size="small"
              variant="standard"
              data-testid="passwordForm"
              onBlur={(e) => {
                validateBlur(
                  /.{8,}/,
                  form.password,
                  handleError(e),
                  "Ensure password is 8 characters or longer"
                );
              }}
              error={errors.password !== ""}
              helperText={errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Confirm Password"
              size="small"
              variant="standard"
              onChange={(e) => setConfirmPass(e.target.value)}
              fullWidth
              required
              data-testid="confirmPassForm"
              type="password"
              onBlur={(e) => validateConfirmPass()}
              error={confirmPassError !== ""}
              helperText={confirmPassError}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          data-testid="submitButton"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link
              href="#"
              variant="body2"
              onClick={(e) => props.handleChange(e, 0)}
              data-testid="GoToLogIn"
            >
              Already have an account? Log In
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default SignUp;

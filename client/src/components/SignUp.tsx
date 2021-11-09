import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircleOutlined from "@mui/icons-material/AddCircleOutlineOutlined";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

function SignUp(props: { handleChange: Function }) {
  // create hooks for inputs and errors associated
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPass, setConfirmPass] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");

  // handle function
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // no refresh; default
    // TODO api calls here after submit
  };

  const validateConfirmPass = () => {
    if (password !== confirmPass) {
      const errMsg = "Password does not match!";
      setConfirmPassError(errMsg);
      return;
    } else {
      setConfirmPassError("");
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
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              size="small"
              variant="standard"
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              required
              onBlur={(e) =>
                validateBlur(
                  /^[a-zA-Z]+$/,
                  firstName,
                  setFirstNameError,
                  "Please enter a valid first name"
                )
              }
              error={firstNameError !== ""}
              helperText={firstNameError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              size="small"
              variant="standard"
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              required
              onBlur={(e) =>
                validateBlur(
                  /^[a-zA-Z]+$/,
                  lastName,
                  setLastNameError,
                  "Please enter a valid last name"
                )
              }
              error={lastNameError !== ""}
              helperText={lastNameError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email Address"
              placeholder="john@mail.utoronto.ca"
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              data-testid="emailForm"
              type="email"
              size="small"
              variant="standard"
              onBlur={(e) =>
                validateBlur(
                  /.*@(mail\.|alum\.){0,}utoronto.ca$/,
                  email,
                  setEmailError,
                  "Invalid email, only utoronto emails allowed"
                )
              }
              error={emailError !== ""}
              helperText={emailError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Username"
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
              size="small"
              variant="standard"
              onBlur={(e) =>
                validateBlur(
                  /^[a-zA-Z0-9]+$/,
                  username,
                  setUsernameError,
                  "Please enter a valid username"
                )
              }
              error={usernameError !== ""}
              helperText={usernameError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              type="password"
              size="small"
              variant="standard"
              data-testid="passwordForm"
              onBlur={() => {
                validateBlur(
                  /.{8,}/,
                  password,
                  setPasswordError,
                  "Ensure password is 8 characters or longer"
                );
              }}
              error={passwordError !== ""}
              helperText={passwordError}
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

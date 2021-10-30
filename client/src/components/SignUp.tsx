import React, { useState } from "react";

import { Grid, Paper, Avatar, TextField, Button, Box } from "@material-ui/core";
import CircleOutlined from "@material-ui/icons/AddCircleOutlineOutlined";
import useMediaQuery from "@material-ui/core/useMediaQuery";

interface SignUpProps {
  handleChange: Function;
}

function SignUp(props: SignUpProps) {
  const paperStyle = {
    padding: 18,
    borderRadius: "20px",
    height: "600px",
    display: "grid",
  };

  const avatarStyle = {
    backgroundColor: "#f4003d",
    width: 50,
    height: 50,
  };

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
  const handleSubmit = (e: React.ChangeEvent<{}>) => {
    e.preventDefault(); // no refresh; default
    // TODO api calls here after submit
  };

  const valideConfirmPass = () => {
    if (password !== confirmPass) {
      const errMsg = "Passwords don't match!";
      setConfirmPassError(errMsg);
      setPasswordError(errMsg);
      return;
    } else {
      setConfirmPassError("");
      setPasswordError("");
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
  const matches = useMediaQuery("(min-width: 1080px)");
  return (
    <Paper style={paperStyle} data-testid="SignUpTab">
      <Grid container justifyContent="center">
        <Grid item>
          <Avatar style={avatarStyle}>
            <CircleOutlined
              fontSize="large"
              style={{ justifyContent: "center" }}
            />
          </Avatar>
        </Grid>
      </Grid>

      <Box textAlign="center">
        <h1>Sign Up</h1>
      </Box>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={matches ? 2 : 0}>
          <Grid item xs={12} md={6}>
            <TextField
              label="First Name"
              placeholder="FirstName"
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
          <Grid item xs={12} md={6}>
            <TextField
              label="Last Name"
              placeholder="LastName"
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
        </Grid>

        <TextField
          label="Email"
          placeholder="john@mail.utoronto.ca"
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          data-testid="emailForm"
          type="email"
          onBlur={(e) =>
            validateBlur(
              /.*@(mail\.|alum\.){0,}utoronto.ca$/,
              email,
              setEmailError,
              "Invalid Email. Only utoronto emails allowed"
            )
          }
          error={emailError !== ""}
          helperText={emailError}
        />

        <TextField
          label="Username"
          placeholder="Enter Username"
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
          type="tel"
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
        <TextField
          label="Password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          type="password"
          data-testid="passwordForm"
          onBlur={() =>
            validateBlur(
              /.{8,}/,
              password,
              setPasswordError,
              "Ensure password is 8 characters or long"
            )
          }
          error={passwordError !== ""}
          helperText={passwordError}
        />

        <TextField
          label="Confirm Password"
          placeholder="Enter Password"
          onChange={(e) => setConfirmPass(e.target.value)}
          fullWidth
          required
          type="password"
          onBlur={(e) => valideConfirmPass()}
          error={confirmPassError !== ""}
          helperText={confirmPassError}
        />

        <Box paddingTop="30px">
          <Button
            type="submit"
            size="large"
            color="primary"
            variant="contained"
            fullWidth
            data-testid="submitButton"
          >
            Submit
          </Button>
        </Box>
      </form>

      <Box paddingTop="5px" textAlign="center">
        <p>Already have an account? </p>
        <Button
          variant="outlined"
          onClick={(e) => props.handleChange(e, 0)}
          color="primary"
          data-testid="GoToLogIn"
        >
          Log In
        </Button>
      </Box>
    </Paper>
  );
}

export default SignUp;

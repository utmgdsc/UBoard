import React, { useState } from "react";

import { Grid, Paper, Avatar, TextField, Button, Box } from "@material-ui/core";
import CircleOutlined from "@material-ui/icons/AddCircleOutlineOutlined";
import { AlternateEmailTwoTone, RestorePageRounded } from "@material-ui/icons";

function SignUp(props: any) {
  const paperStyle = {
    padding: 18,
    borderRadius: "20px",
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
  const handleSubmit = (e: any) => {
    e.preventDefault(); // no refresh; default
    // TODO api calls here acter submit
  };

  const validateBlur = (
    regexPattern: any,
    checkString: String,
    setHook: Function,
    errorMessage: String,
    confirmPassword = false
  ) => {
    // only check for the confirm password field
    if (confirmPassword && password !== confirmPass) {
      setHook("Passwords don't match!");
      return;
    }

    if (!regexPattern.test(checkString)) {
      setHook(errorMessage);
    } else {
      setHook("");
    }
  };

  return (
    <Paper style={paperStyle}>
      <Grid container justifyContent="center">
        <Grid item>
          <Avatar style={avatarStyle}>
            <CircleOutlined fontSize="large" />
          </Avatar>
        </Grid>
      </Grid>

      <Box textAlign="center">
        <h1>Sign Up</h1>
      </Box>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
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
          placeholder="youremail@mail.utoronto.ca"
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          type="email"
          onBlur={(e) =>
            validateBlur(
              /.*@(mail\.|alum\.^$)utoronto.ca/,
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
          onBlur={(e) =>
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
          onBlur={(e) =>
            validateBlur(
              /.{8,}/,
              confirmPass,
              setConfirmPassError,
              "Ensure password is 8 characters or long",
              true
            )
          }
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
          >
            Submit
          </Button>
        </Box>
      </form>

      <Box paddingTop="5px" textAlign="left">
        <p>Already have an account? </p>
        <Button variant="outlined" onClick={(e) => props.handleChange(e, 0)}>
          Log In
        </Button>
      </Box>
    </Paper>
  );
}

export default SignUp;

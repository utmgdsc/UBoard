import React, { useState } from "react";

import { Grid, Paper, Avatar, TextField, Button, Box } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

interface LogInProps {
  handleChange: Function;
}

function Login(props: LogInProps) {
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

  // create hooks for username and password
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateBlurUsername = (regexPattern: RegExp) => {
    if (!regexPattern.test(username)) {
      setUsernameError("Please enter a valid username");
    } else {
      setUsernameError("");
    }
  };
  const validateBlurPassword = (regexPattern: RegExp) => {
    if (!regexPattern.test(password)) {
      setPasswordError("Ensure password is 8 characters or long");
    } else {
      setPasswordError("");
    }
  };

  // handle function for submitting username and password
  const handleSubmit = (e: React.ChangeEvent<{}>) => {
    e.preventDefault(); // no refresh; default

    // TODO api calls here after submit
  };

  return (
    <Paper style={paperStyle}>
      <Grid container justifyContent="center">
        <Grid item>
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
        </Grid>
      </Grid>

      <Box textAlign="center">
        <h1>Log In</h1>
      </Box>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          label="Username"
          placeholder="Enter Username"
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
          fullWidth
          required
          style={{ paddingBottom: "15px" }}
          onBlur={(e) => validateBlurUsername(/^[a-zA-Z0-9]+$/)}
          error={usernameError !== ""}
          helperText={usernameError}
        />
        <TextField
          label="Password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          fullWidth
          required
          type="password"
          style={{ paddingBottom: "20px" }}
          onBlur={(e) => validateBlurPassword(/.{8,}/)}
          error={passwordError !== ""}
          helperText={passwordError}
        />

        <Button
          type="submit"
          size="large"
          color="primary"
          variant="contained"
          fullWidth
        >
          Submit
        </Button>
      </form>

      <Button
        variant="outlined"
        onClick={(e) => props.handleChange(e, 1)}
        color="primary"
        size="small"
      >
        Create an Account
      </Button>
    </Paper>
  );
}
export default Login;

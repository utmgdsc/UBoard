import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";

import useWindowDimensions from "../hooks/window";

function Login(props: { handleChange: Function }) {
  const { height } = useWindowDimensions();

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
      setPasswordError("Ensure password is 8 characters or longer");
    } else {
      setPasswordError("");
    }
  };

  // handle function for submitting username and password
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // no refresh; default

    // TODO api calls here after submit
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
      maxHeight={height - 200 > 0 ? height - 200 : 0}
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
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
          onBlur={(e) => validateBlurUsername(/^[a-zA-Z0-9]+$/)}
          error={usernameError !== ""}
          helperText={usernameError}
        />
        <TextField
          margin="normal"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          type="password"
          onBlur={(e) => validateBlurPassword(/.{8,}/)}
          error={passwordError !== ""}
          helperText={passwordError}
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

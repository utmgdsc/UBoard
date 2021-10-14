import React, { useState } from "react";

import { Grid, Paper, Avatar, TextField, Button, Box } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

function Login(props: any) {
  const paperStyle = {
    padding: 18,
    borderRadius: "20px",
  };

  const avatarStyle = {
    backgroundColor: "#f4003d",
    width: 50,
    height: 50,
  };

  // create hooks for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // handle function for submitting username and password
  const handleSubmit = (e: any) => {
    e.preventDefault(); // no refresh; default

    if (username && password) {
      console.log(username, password);
    }
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

      <Box style={{ paddingTop: "20px" }}>
        <h2>***</h2>
      </Box>

      <Button variant="contained" onClick={(e) => props.handleChange(e, 1)}>
        Create an Account
      </Button>
    </Paper>
  );
}
export default Login;

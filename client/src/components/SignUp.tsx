import React, { useState } from "react";

import { Grid, Paper, Avatar, TextField, Button, Box } from "@material-ui/core";
import CircleOutlined from "@material-ui/icons/AddCircleOutlineOutlined";

function SignUp(props: any) {
  const paperStyle = {
    padding: 18,
    borderRadius: "20px",
    height: 570,
    width: 350,
  };

  const avatarStyle = {
    backgroundColor: "#f4003d",
    width: 50,
    height: 50,
  };

  // create hooks for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState("");
  const [phNum, setPhNum] = useState("");

  // handle function for submitting username and password
  const handleSubmit = (e: any) => {
    e.preventDefault(); // no refresh; default

    if (username && password) {
      console.log(username, password);
    }

    // TODO: only submit successful if passwords match
  };

  return (
    <Paper style={paperStyle}>
      <Grid container justifyContent="center" style={{ paddingTop: "10px" }}>
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
        <TextField
          label="Name"
          placeholder="FirstName LastName"
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Email"
          placeholder="youremail@mail.utoronto.ca"
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          type="password"
        />

        <TextField
          label="Phone Number"
          placeholder="Enter Password"
          onChange={(e) => setPhNum(e.target.value)}
          fullWidth
          required
          type="password"
        />
        <TextField
          label="Password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          type="password"
        />

        <TextField
          label="Confirm Password"
          placeholder="Enter Password"
          onChange={(e) => setConfirmPass(e.target.value)}
          fullWidth
          required
          type="password"
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

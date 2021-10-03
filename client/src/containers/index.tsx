import React, { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

function LoginSignUpContainer() {
  const paperStyle = {
    width: 386,
    height: 570,
    borderRadius: "20px",
    margin: "80px 180px",
  };

  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };
  function TabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  return (
    <Grid container justifyContent="flex-end">
      <Grid item>
        <Paper elevation={20} style={paperStyle}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="disabled tabs example"
            variant="fullWidth"
            textColor="primary"
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          <TabPanel value={value} index={0}>
            <Login handleChange={handleChange} /> {/* Opening Login Page*/}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <SignUp handleChange={handleChange} /> {/* Opening SignUp Page*/}
          </TabPanel>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default LoginSignUpContainer;

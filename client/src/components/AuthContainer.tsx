import React, { useState } from "react";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import Login from "../components/Login";
import SignUp from "../components/SignUp";

import useMediaQuery from "@material-ui/core/useMediaQuery";

function TabPanel(props: any) {
  const { children, value, index, ...rest } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...rest}
    >
      {value === index && (
        <Box>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function AuthContainer() {
  const paperStyle = {
    height: "100%",
    borderRadius: "20px",
  };

  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: any, newValue: any) => {
    setTabIndex(newValue);
  };

  const matches = useMediaQuery("(min-width: 1080px)");

  return (
    <Grid
      container
      justifyContent={matches ? "flex-end" : "center"}
      style={{ padding: matches ? "20px" : 0 }}
    >
      <Grid item xs={10} sm={6} md={4} lg={3} xl={3}>
        <Paper elevation={5} style={paperStyle}>
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            aria-label="Login and Signup tabs"
            variant="fullWidth"
            textColor="primary"
          >
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            <Login handleChange={handleChange} />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <SignUp handleChange={handleChange} />
          </TabPanel>
        </Paper>
      </Grid>
    </Grid>
  );
}
export default AuthContainer;

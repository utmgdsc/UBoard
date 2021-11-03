import React, { useState } from "react";
 
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";


import useMediaQuery from "@mui/material/useMediaQuery";

import Login from "../components/Login";
import SignUp from "../components/SignUp";

import "./AuthContainer.css";

interface TabPanelProps {
  children: JSX.Element;
  value: number;
  index: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...rest } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab with index: ${index}`}
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

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const matches = useMediaQuery("(min-width: 1080px)");

  return (
    <div className="AuthContainer">
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
              <Tab label="Login" data-testid="LogInTabButton" />
              <Tab label="Sign Up" data-testid="SignUpTabButton" />
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
    </div>
  );
}
export default AuthContainer;

import React, { useState } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import useMediaQuery from "@mui/material/useMediaQuery";

import Login from "../components/Login";
import SignUp from "../components/SignUp";

import "./AuthContainer.css";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#f4003d",
    },
  },
});

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AuthContainer() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const matches = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div className="AuthContainer">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Grid
          container
          component="main"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ height: "100vh", px: "40px" }}
        >
          <Grid item hidden={matches} xs={false} md={8}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <Box bgcolor="rgba(83, 102, 133, 0.6)" p="40px" px="80px">
                <Typography color="white" fontFamily="Verdana" variant="h2">
                  UBoard
                </Typography>
                <Typography color="white" fontFamily="Verdana" variant="h4">
                  A place to connect
                </Typography>
              </Box>
              
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            component={Paper}
            elevation={24}
            sx={{ borderRadius: "30px" }}
            overflow="hidden"
          >
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabIndex}
                  onChange={handleChange}
                  aria-label="Login and Signup tabs"
                  variant="fullWidth"
                >
                  <Tab label="Sign In" data-testid="LogInTabButton" />
                  <Tab label="Sign Up" data-testid="SignUpTabButton" />
                </Tabs>
              </Box>
              <TabPanel value={tabIndex} index={0}>
                <Login handleChange={handleChange} />
              </TabPanel>
              <TabPanel value={tabIndex} index={1}>
                <SignUp handleChange={handleChange} />
              </TabPanel>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
}
export default AuthContainer;

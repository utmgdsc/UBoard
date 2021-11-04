import React from "react";
import "./App.css";
import { AuthContainer } from "./containers";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#f4003d",
    },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthContainer />
      </ThemeProvider>
    </>
  );
}

export default App;

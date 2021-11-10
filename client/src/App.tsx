import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthContainer } from "./containers";
import PostDashboard from "./containers/PostDashboard";

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
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthContainer />} />
          <Route path="/dashboard" element={<PostDashboard/>} /> 
          {/* TODO: Ensure authenticated then redirect to dashboard */}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

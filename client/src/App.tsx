import React from "react";
import "./App.css";
import { AuthContainer } from "./containers";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PostDashboard from "./containers/PostDashboard";
import { createTheme } from "@mui/material/styles";
import ThemeProvider from "@mui/system/ThemeProvider";

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

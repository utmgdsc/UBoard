import React from "react";
import "./App.css";
import { AuthContainer } from "./containers";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PostDashboard from "./containers/PostDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthContainer />} />
        <Route path="/dashboard" element={<PostDashboard/>} /> 
        {/* TODO: Ensure authenticated then redirect to dashboard */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

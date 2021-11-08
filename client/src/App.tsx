import React from "react";
import "./App.css";
import { AuthContainer } from "./containers";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthContainer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

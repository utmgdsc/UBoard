import React from "react";
import "./App.css";

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import LoginSignUpContainer from "./containers";

function App() {
  return (
    <div className="App">
      <LoginSignUpContainer />
    </div>
  );
}

export default App;

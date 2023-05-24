import React, { useState } from "react";
import "./App.css";
import InfoForm from "./InfoForm";
import "./index.css";

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <div to="/" className="navbar-logo">
          Portfolio Calculator
          <i class="fab fa-firstdraft" />
        </div>
        <div className="menu-icon">
          <i className={"fas fa-times"} />
        </div>
      </nav>
      <InfoForm />
      <div
        className="background">

      </div>
    </div>
  );
}

export default App;

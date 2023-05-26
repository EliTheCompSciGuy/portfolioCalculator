import React, { useState } from "react";
import "./App.css";
import InfoForm from "./InfoForm";
import "./index.css";

function App() {
  return (
    // bg-[rgb(245,225,193)]
    <div className="App bg-orange-100 w-full h-screen">
      <nav className="navbar bg-[rgb(59,59,76)] w-full">
        <div to="/" className="navbar-logo  font-bold text-white text-left text-6xl font-size-20 p-3 w-full">
          Portfolio Calculator
          <i class="fab fa-firstdraft" />
        </div>
        <div className="menu-icon">
          <i className={"fas fa-times"} />
        </div>
      </nav>
      <InfoForm />
      
    </div>
  );
}

export default App;

import React from "react";

import SalesAgent from "./components/SalesAgent";

import "./App.css";
import { Box } from "@mui/material";
// import SideMenue from "./Component/SideMenue";
import SalesLayout from './Component/SalesLayout'

function App() {
  return (
    <div className="app">
      {/* <SideMenue/> */}
      {/* <SalesAgent /> */}
      <SalesLayout/>
    </div>
  );
}

export default App;
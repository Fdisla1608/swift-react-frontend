import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Configuration from "./pages/Configuration";
import Terrain from "./pages/Terrain";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div style={{width:"100vw", height: "90vh"}}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/terrain" element={<Terrain />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

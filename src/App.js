import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Configuration from "./pages/Configuration";
import Terrain from "./pages/Terrain";
import Weather from "./pages/Weather";

const App = () => {
  return (
    <div style={{ margin: 0, padding: 0, width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      <Router>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/configuration" element={<Configuration />} />
            <Route path="/terrain" element={<Terrain />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;

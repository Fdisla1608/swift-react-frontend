import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Controls from './pages/Controls';
import Terrain from './pages/Terrain';

const App = () => {
  return (
    <Router>
    <Navbar />
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/controls" element={<Controls />} />
      <Route path="/terrain" element={<Terrain />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
  </Router>
  );
};

export default App;

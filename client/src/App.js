import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Game from "./pages/game/Game";
import "./App.css";
import "./pages/dashboard/dashboard.css";
function App() {
  return (
    <>
      <Router>
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/" element={<Game />} /> */}
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;

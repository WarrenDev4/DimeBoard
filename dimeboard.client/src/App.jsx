import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import AppLayout from './components/AppLayout/AppLayout.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Markets from './pages/Markets/Markets.jsx';

function App() {
    return (
        <Router>
            <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />
                <Route element={<AppLayout />}>
                    <Route path="/app" element={<Dashboard />} />
                    <Route path="/markets" element={<Markets />} /> 
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import AppLayout from './components/AppLayout/AppLayout.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Markets from './pages/Markets/Markets.jsx';
import Crypto from './pages/Crypto/Crypto.jsx';
import Blockchain from './pages/Blockchain/Blockchain.jsx';
import AIInsights from './pages/AIInsights/AIInsights.jsx';
import News from './pages/News/News.jsx';

function App() {
    return (
        <Router>
            <Routes>
                {/* Landing Page */}
                <Route path="/" element={<LandingPage />} />
                <Route element={<AppLayout />}>
                    <Route path="/app" element={<Dashboard />} />
                    <Route path="/markets" element={<Markets />} />
                    <Route path="/crypto" element={<Crypto />} />
                    <Route path="/blockchain" element={<Blockchain />} />
                    <Route path="/ai" element={<AIInsights />} />
                    <Route path="/news" element={<News />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
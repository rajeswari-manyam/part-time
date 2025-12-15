import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/NavBar";
import HomePage from "./pages/Home";

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                {/* Navbar - Sticky at top */}
                <Navbar />

                {/* Main Content - Rendered below navbar */}
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/services" element={<div className="p-8 text-center">Services Page - Coming Soon</div>} />
                        <Route path="/workers" element={<div className="p-8 text-center">For Workers Page - Coming Soon</div>} />
                        <Route path="/help" element={<div className="p-8 text-center">Help Page - Coming Soon</div>} />
                        <Route path="/leads" element={<div className="p-8 text-center">Leads Page - Coming Soon</div>} />
                        <Route path="/free-listing" element={<div className="p-8 text-center">Free Listing Page - Coming Soon</div>} />
                        <Route path="/login" element={<div className="p-8 text-center">Login Page - Coming Soon</div>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
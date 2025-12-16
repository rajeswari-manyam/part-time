// src/App.tsx
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";

import Navbar from "./components/layout/NavBar";
import HomePage from "./pages/Home";
import RoleSelection from "./pages/RoleSelection";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SelectCategory from "./pages/SelectCategories";
import WorkerProfileScreen from "./pages/Profile";
/* ---------------- Protected Route ---------------- */
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

/* ---------------- Layout Wrapper ---------------- */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const hideNavbar = location.pathname === "/services"; // hide navbar on role selection
    return (
        <div className="min-h-screen bg-gray-50">
            {!hideNavbar && <Navbar />}
            <main>{children}</main>
        </div>
    );
};

/* ---------------- App Routes ---------------- */
const AppRoutes: React.FC = () => {
    return (
        <Layout>
            <Routes>
                {/* Home */}
                <Route path="/" element={<HomePage />} />

                <Route path="/role-selection" element={<RoleSelection />} />
                <Route
                    path="/select-category"
                    element={
                        <ProtectedRoute>
                            <SelectCategory />
                        </ProtectedRoute>
                    }
                />

                            <Route path="/worker-profile" element={<WorkerProfileScreen />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
    );
};

/* ---------------- Main App ---------------- */
const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

export default App;

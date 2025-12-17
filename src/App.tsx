import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/layout/NavBar";

import HomePage from "./pages/Home";
import FreeListing from "./pages/FreeListing";
import Jobs from "./pages/MyJobs";
import Favorites from "./pages/Favorites";
import Saved from "./pages/Saved";
import RoleSelection from "./pages/RoleSelection";
import LoginPage from "./pages/LoginPage";
import Notifications from "./pages/Notifications";
import Policy from "./pages/Policy";
import FeedBack from "./pages/FeedBack";
import Help from "./pages/Help";
import ProfilePage from "./pages/ProfilePage";
import WorkerProfileScreen from "./pages/WorkerProfile";
/* ---------------- Protected Route ---------------- */
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
    children,
}) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

/* ---------------- Layout ---------------- */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>{children}</main>
    </div>
);

/* ---------------- Routes with Background ---------------- */
const AppRoutes: React.FC = () => {
    const location = useLocation();
    const background = location.state?.background;

    return (
        <>
            <Layout>
                <Routes location={background || location}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/loginPage" element={<LoginPage />} />
                    <Route path="/worker-profile" element={<WorkerProfileScreen />} />
                    <Route
                        path="/free-listing"
                        element={
                            <ProtectedRoute>
                                <FreeListing />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/jobs"
                        element={
                            <ProtectedRoute>
                                <Jobs />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/favorites"
                        element={
                            <ProtectedRoute>
                                <Favorites />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/saved"
                        element={
                            <ProtectedRoute>
                                <Saved />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/role-selection"
                        element={
                            <ProtectedRoute>
                                <RoleSelection />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/notifications"
                        element={
                            <ProtectedRoute>
                                <Notifications />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/policy"
                        element={
                            <ProtectedRoute>
                                <Policy />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/feedback"
                        element={
                            <ProtectedRoute>
                                <FeedBack />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/help"
                        element={
                            <ProtectedRoute>
                                <Help />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>

            {/* 🔥 Overlay Route */}
            {background && (
                <Routes>
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            )}
        </>
    );
};

/* ---------------- Main App ---------------- */
const App: React.FC = () => (
    <AuthProvider>
        <Router>
            <AppRoutes />
        </Router>
    </AuthProvider>
);

export default App;

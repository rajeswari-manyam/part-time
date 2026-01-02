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

import Favorites from "./pages/Favorites";
import Saved from "./pages/Saved";

import LoginPage from "./pages/LoginPage";
import Notifications from "./pages/Notifications";
import Policy from "./pages/Policy";
import FeedBack from "./pages/FeedBack";
import Help from "./pages/Help";
import ProfilePage from "./pages/ProfilePage";
import WorkerProfileScreen from "./pages/WorkerProfile";
import ServiceMarketplace from "./pages/ServiceMarketPlace";
import JobDetailsPage from "./pages/JobDetails";
import UserProfile from "./pages/UserProfile";
import MatchedWorkers from "./pages/MatchedWorkers";
import WorkerProfile from "./pages/WorkerProfile";
import ChatScreen from "./pages/Chat";

import CallingScreen from "./pages/Call";
import ServiceEnquiryForm from "./pages/ServiceEnquiryForm";
import FeedbackForm from "./pages/FeedBack";
import ThankYouScreen from "./pages/ThankYouscreen";
import NotificationScreen from "./pages/Notificationcsreen";
import RoleSelection from "./pages/RoleSelection";
import AllJobs from "./pages/AllJobs";
import UpdateJob from "./pages/UpdateJob";
import ListedJobs from "./pages/Listedjobs";
import EditProfile from "./pages/EditProfile";
/* ---------------- Protected Route ---------------- */
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

/* ---------------- ListedJobs Wrapper to get userId ---------------- */
const ListedJobsWrapper: React.FC = () => {
    const { user } = useAuth(); // Get the current user from AuthContext

    if (!user?._id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600">Please log in to view your jobs</p>
            </div>
        );
    }

    return <ListedJobs userId={user._id} />;
};

// /* ---------------- EditProfile Wrapper to get userId ---------------- */
// const EditProfileWrapper: React.FC = () => {
//     const { user } = useAuth();

//     if (!user?._id) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <p className="text-red-600">Please log in to edit your profile</p>
//             </div>
//         );
//     }

//     // After
// // return <EditProfile />;
// };

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
                    <Route path="/role-selection" element={<RoleSelection />} />
                    <Route path="/loginPage" element={<LoginPage />} />
                    <Route path="/worker-profile" element={<WorkerProfileScreen />} />
                    <Route path="/service-marketplace" element={<ServiceMarketplace />} />
                    <Route path="/job-details/:jobId" element={<JobDetailsPage />} />
                    <Route path="/user-profile" element={<UserProfile />} />

                    {/* ✅ Routes for matched-workers - both with and without ID */}
                    <Route path="/matched-workers" element={<MatchedWorkers />} />
                    <Route path="/matched-workers/:workerId" element={<MatchedWorkers />} />

                    <Route path="/worker-profile/:id" element={<WorkerProfile />} />
                    <Route path="/chat/:id" element={<ChatScreen />} />
                    <Route path="/call/:id" element={<CallingScreen />} />
                    <Route path="/send-enquiry/:id" element={<ServiceEnquiryForm />} />
                    <Route path="/feedback/:id" element={<FeedbackForm />} />
                    <Route path="/thank-you/:id" element={<ThankYouScreen />} />
                    <Route path="/notification/:id" element={<NotificationScreen />} />
                    <Route path="/all-jobs" element={<AllJobs />} />
                    <Route path="/update-job/:jobId" element={<UpdateJob />} />
                    {/* <Route
                        path="/profile/edit"
                        element={
                            <ProtectedRoute>
                                <EditProfileWrapper />
                            </ProtectedRoute>
                        }
                    /> */}

                    {/* Add worker routes if needed */}
                    {/* ✅ ListedJobs route now passes current userId */}
                    <Route
                        path="/listed-jobs"
                        element={
                            <ProtectedRoute>
                                <ListedJobsWrapper />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/free-listing"
                        element={
                            <ProtectedRoute>
                                <FreeListing />
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
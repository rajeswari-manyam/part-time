import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { AccountProvider } from "./context/AccountContext";
import { LocationProvider } from "./store/Location.context";

import Navbar from "./components/layout/NavBar";

import HomePage from "./pages/Home";
import FreeListing from "./pages/FreeListing";
import CategoryPage from "./pages/CategoriesPage";

import Favorites from "./pages/Favorites";
import Saved from "./pages/Saved";

import LoginPage from "./pages/LoginPage";
import Notifications from "./pages/Notifications";
import Policy from "./pages/Policy";
import FeedBack from "./pages/FeedBack";
import Help from "./pages/Help";
import ProfilePage from "./pages/ProfilePage";
import WorkerProfileScreen from "./pages/WorkerProfile";
import NearByJobs from "./pages/NearByJobs";
import JobDetails from "./pages/JobDetails";
import UserProfile from "./pages/UserProfile";
import MatchedWorkers from "./pages/MatchedWorkers";
import WorkerProfile from "./pages/WorkerProfile";
import ChatScreen from "./pages/Chat";
import NearbyPlaces from "./pages/NearByPlaces";
import CallingScreen from "./pages/Call";
import ServiceEnquiryForm from "./pages/ServiceEnquiryForm";
import FeedbackForm from "./pages/FeedBack";
import ThankYouScreen from "./pages/ThankYouscreen";
import NotificationScreen from "./pages/Notificationcsreen";
import RoleSelection from "./pages/RoleSelection";
import AllJobs from "./pages/AllJobs";
import UpdateJob from "./pages/UpdateJob";
import ListedJobs from "./pages/Listedjobs";
import LocationSelector from "./components/LocationSelector";
import MyProfile from "./pages/MyProfile";
import BookNow from "./pages/BookNow";
import RaiseTicketUI from "./pages/RiseTicket";
import ViewTicketsUI from "./pages/ViewTicket";
import ReferAndEarnScreen from "./pages/Refer&earn";
import AboutUs from "./pages/AboutUs";
import MyBookings from "./pages/MyBookings";
import AddSkillsScreen from "./pages/AddSkills";
import WorkerList from "./pages/WorkerList";
import CreateWorkerProfile from "./pages/WorkerProfile";
import EditSkillScreen from "./pages/EditWorkerSkill";
import WorkerDetails from "./pages/WorkerDetails";
import AddAutomotive from "./pages/AddAutomotive";
import AutomotiveDetails from "./pages/AutomotiveDetails";
import AutomotiveEdit from "./pages/AutomotiveEdit";
// Import Automotive Components
import AutomotiveList from "./pages/AutomotiveList";
import AutomotiveForm from "./pages/AutomotiveForm";

/* ---------------- Protected Route ---------------- */
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

/* ---------------- ListedJobs Wrapper to get userId ---------------- */
const ListedJobsWrapper: React.FC = () => {
    const { user } = useAuth();

    if (!user?._id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600">Please log in to view your jobs</p>
            </div>
        );
    }

    return <ListedJobs userId={user._id} />;
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
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/role-selection" element={<RoleSelection />} />
                    <Route path="/loginPage" element={<LoginPage />} />
                    <Route path="/worker-profile" element={<WorkerProfileScreen />} />
                    <Route path="/NearByJobs" element={<NearByJobs />} />
                    <Route path="/jobs/:jobId" element={<JobDetails />} />
                    <Route path="/user-profile" element={<UserProfile />} />
                    <Route path="/category/:id" element={<CategoryPage />} />

                    {/* ================= AUTOMOTIVE ROUTES ================= */}
                    <Route path="/automotive-list" element={<AutomotiveList />} />
                    <Route path="/automotive/:subcategory" element={<AutomotiveList />} />
                    {/* <Route path="/add-automotive" element={<AddAutomotive />} />
                    <Route path="/edit-automotive/:id" element={<AutomotiveEdit />} /> */}
                    <Route path="/add-automotive-form" element={<AutomotiveForm />} />
                    <Route
                        path="/automotive/details/:id"
                        element={<AutomotiveDetails />}
                    />

                    {/* ================= WORKER ROUTES ================= */}
                    <Route path="/matched-workers/:subcategory" element={<MatchedWorkers />} />
                    <Route path="/matched-workers" element={<MatchedWorkers />} />
                    <Route path="/worker-profile/:id" element={<WorkerProfile />} />
                    <Route path="/worker-list/:id" element={<WorkerList />} />
                    <Route path="/worker-profile" element={<CreateWorkerProfile />} />
                    <Route path="/worker-details/:id" element={<WorkerDetails />} />
                    <Route path="/add-skills" element={<AddSkillsScreen />} />
                    <Route path="/edit-skill/:skillId" element={<EditSkillScreen />} />

                    {/* ================= PLACE ROUTES ================= */}
                    <Route path="/nearby-places/:subcategory" element={<NearbyPlaces />} />
                    <Route path="/nearby-places" element={<NearbyPlaces />} />

                    {/* ================= BOOKING & INTERACTION ROUTES ================= */}
                    <Route path="/booknow/:jobId" element={<BookNow />} />
                    <Route path="/chat/:id" element={<ChatScreen />} />
                    <Route path="/call/:id" element={<CallingScreen />} />
                    <Route path="/send-enquiry/:id" element={<ServiceEnquiryForm />} />
                    <Route path="/feedback/:id" element={<FeedbackForm />} />
                    <Route path="/thank-you/:id" element={<ThankYouScreen />} />
                    <Route path="/notification/:id" element={<NotificationScreen />} />

                    {/* ================= JOB ROUTES ================= */}
                    <Route path="/all-jobs" element={<AllJobs />} />
                    <Route path="/update-job/:jobId" element={<UpdateJob />} />

                    {/* ================= USER PROFILE & SETTINGS ================= */}
                    <Route path="/my-profile" element={<MyProfile />} />
                    <Route path="/refer-and-earn" element={<ReferAndEarnScreen />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/raise-ticket" element={<RaiseTicketUI />} />
                    <Route path="/view-tickets" element={<ViewTicketsUI />} />
                    <Route path="/my-bookings" element={<MyBookings />} />

                    {/* ================= PROTECTED ROUTES ================= */}
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

            {/* Overlay Route */}
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
            <AccountProvider>
                <LocationProvider>
                    <Router>
                        <AppRoutes />
                    </Router>
                </LocationProvider>
            </AccountProvider>
        </AuthProvider>
    );
};

export default App;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Bell,
  Home,
  Bookmark
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useAccount } from "../../context/AccountContext";
import Button from "../ui/Buttons";
import typography, { combineTypography } from "../../styles/typography";
import WelcomePage from "../Auth/WelcomePage";
import OTPVerification from "../Auth/OTPVerification";
import LanguageSelector from "../LanguageSelector";
import ProfileSidebar from "../overlays/ProfileSideBar";
import { getUserById, API_BASE_URL } from "../../services/api.service";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "User"
  );
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const { accountType, setAccountType } = useAccount();

  const handleSwitchAccount = (type: "user" | "worker") => {
    if (type === accountType) return;

    setAccountType(type);
    setIsMobileMenuOpen(false);
    setShowProfileSidebar(false);
    navigate("/home", { replace: true });
  };

  // Fetch user profile picture on mount and when authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) return;

      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        setIsLoadingProfile(true);
        const response = await getUserById(userId);

        if (response.success && response.data) {
          const name = response.data.name || "User";
          setUserName(name);
          localStorage.setItem("userName", name);

          if (response.data.profilePic) {
            const picUrl = response.data.profilePic.startsWith('http')
              ? response.data.profilePic
              : `${API_BASE_URL}${response.data.profilePic}`;
            setProfilePic(picUrl);
            console.log("✅ Profile pic loaded:", picUrl);
          } else {
            setProfilePic(null);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated]);

  // Listen for profile updates from localStorage
  useEffect(() => {
    const syncUserData = () => {
      const name = localStorage.getItem("userName") || "User";
      setUserName(name);

      const userId = localStorage.getItem("userId");
      if (userId && isAuthenticated) {
        getUserById(userId).then(response => {
          if (response.success && response.data?.profilePic) {
            const picUrl = response.data.profilePic.startsWith('http')
              ? response.data.profilePic
              : `${API_BASE_URL}${response.data.profilePic}`;
            setProfilePic(picUrl);
          }
        }).catch(err => console.error("Error syncing profile:", err));
      }
    };

    window.addEventListener("storage", syncUserData);
    return () => window.removeEventListener("storage", syncUserData);
  }, [isAuthenticated]);

  const handleNavClick = (path: string) => {
    if (!isAuthenticated) {
      setShowWelcomeModal(true);
      return;
    }
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setShowWelcomeModal(true);
      return;
    }
    setShowProfileSidebar(true);
    setIsMobileMenuOpen(false);
  };

  const handleLoginSuccess = () => {
    setShowOTPModal(false);
    setShowWelcomeModal(false);
    navigate("/", { replace: true });
  };

  const openOTPModal = (phone: string) => {
    setPhoneNumber(phone);
    setShowWelcomeModal(false);
    setShowOTPModal(true);
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">⚡</span>
              </div>
              <h1 className={combineTypography(
                typography.logo.title,
                "text-blue-800 hidden sm:block"
              )}>
                ServiceHub
              </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              <LanguageSelector />

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center space-x-6">
                {accountType === "user" ? (
                  <>
                    <NavItem icon={Home} label="Home" onClick={() => handleNavClick("/home")} />
                    <NavItem icon={Bookmark} label="Jobs" onClick={() => handleNavClick("/listed-jobs")} />
                  </>
                ) : (
                  <>
                    <NavItem icon={Home} label="Home" onClick={() => handleNavClick("/home")} />
                    <NavItem icon={Bell} label="My Bookings" onClick={() => handleNavClick("/my-bookings")} />
                  </>
                )}
              </div>

              {/* Notification */}
              <button
                onClick={() => handleNavClick("/notification")}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Bell className="w-5 h-5" />
              </button>

              {/* Desktop Account Toggle */}
              {isAuthenticated && (
                <div className="hidden lg:flex items-center">
                  <div className="relative flex items-center bg-gray-100 rounded-full p-1 h-10 w-36">
                    <div
                      className={`absolute top-1 left-1 h-8 w-[calc(50%-0.25rem)]
                        bg-gradient-to-r from-[#0B0E92] to-[#69A6F0]
                        rounded-full transition-transform duration-300
                        ${accountType === "user" ? "translate-x-0" : "translate-x-full"}`}
                    />

                    <button
                      onClick={() => handleSwitchAccount("user")}
                      className={`relative z-10 w-1/2 text-xs font-semibold ${accountType === "user" ? "text-white" : "text-[#1F3B64]"
                        }`}
                    >
                      Customer
                    </button>

                    <button
                      onClick={() => handleSwitchAccount("worker")}
                      className={`relative z-10 w-1/2 text-xs font-semibold ${accountType === "worker" ? "text-white" : "text-[#1F3B64]"
                        }`}
                    >
                      Worker
                    </button>
                  </div>
                </div>
              )}

              {/* Auth / Profile */}
              {!isAuthenticated ? (
                <Button
                  variant="gradient-blue"
                  size="md"
                  className="hidden lg:block"
                  onClick={() => setShowWelcomeModal(true)}
                >
                  Login
                </Button>
              ) : (
                <button
                  onClick={handleProfileClick}
                  className="hidden lg:block w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all shadow-md hover:shadow-lg"
                >
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt={userName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Failed to load profile image");
                        setProfilePic(null);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] flex items-center justify-center text-white font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden text-gray-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-md">
            {accountType === "user" ? (
              <>
                <MobileNavItem icon={Home} label="Home" onClick={() => handleNavClick("/home")} />
                <MobileNavItem icon={Bookmark} label="Jobs" onClick={() => handleNavClick("/listed-jobs")} />
              </>
            ) : (
              <>
                <MobileNavItem icon={Home} label="Home" onClick={() => handleNavClick("/home")} />
                <MobileNavItem icon={Bell} label="My Bookings" onClick={() => handleNavClick("/my-bookings")} />
              </>
            )}
            <MobileNavItem icon={Bell} label="Notification" onClick={() => handleNavClick("/notification")} />

            {/* Mobile Account Toggle */}
            {isAuthenticated && (
              <div className="px-4 py-3 border-t">
                <div className="relative flex items-center bg-gray-100 rounded-full p-1 h-10 w-full">
                  <div
                    className={`absolute top-1 left-1 h-8 w-[calc(50%-0.25rem)]
                      bg-gradient-to-r from-[#0B0E92] to-[#69A6F0]
                      rounded-full transition-transform duration-300
                      ${accountType === "user" ? "translate-x-0" : "translate-x-full"}`}
                  />

                  <button
                    onClick={() => handleSwitchAccount("user")}
                    className={`relative z-10 w-1/2 text-xs font-semibold ${accountType === "user" ? "text-white" : "text-[#1F3B64]"
                      }`}
                  >
                    Customer
                  </button>

                  <button
                    onClick={() => handleSwitchAccount("worker")}
                    className={`relative z-10 w-1/2 text-xs font-semibold ${accountType === "worker" ? "text-white" : "text-[#1F3B64]"
                      }`}
                  >
                    Worker
                  </button>
                </div>
              </div>
            )}

            {!isAuthenticated ? (
              <button
                onClick={() => {
                  setShowWelcomeModal(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-blue-600 font-medium hover:bg-gray-100"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3"
              >
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt={userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] flex items-center justify-center text-white font-bold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>Profile</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* ================= AUTH MODALS ================= */}
      <WelcomePage
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onOpenOTP={openOTPModal}
      />

      {showOTPModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
          <OTPVerification
            phoneNumber={phoneNumber}
            onBack={() => setShowOTPModal(false)}
            onClose={handleLoginSuccess}
            onContinue={handleLoginSuccess}
            onResend={() => { }}
          />
        </div>
      )}

      {/* ================= PROFILE SIDEBAR ================= */}
      {showProfileSidebar && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowProfileSidebar(false)}
          />

          <div className="relative w-80 h-full bg-white shadow-xl transform transition-transform duration-300 translate-x-0">
            <ProfileSidebar
              user={{ name: userName }}
              profilePic={profilePic}
              onNavigate={(path: string) => {
                navigate(path);
                setShowProfileSidebar(false);
              }}
              onLogout={() => {
                logout();
                setProfilePic(null);
                setShowProfileSidebar(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

/* ================= HELPERS ================= */

const NavItem = ({ icon: Icon, label, onClick }: any) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const MobileNavItem = ({ icon: Icon, label, onClick }: any) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-3"
  >
    {Icon && <Icon className="w-5 h-5" />}
    <span>{label}</span>
  </button>
);

export default Navbar;
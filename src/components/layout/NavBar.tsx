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

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { accountType } = useAccount();
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
  useEffect(() => {
    const syncUserName = () => {
      setUserName(localStorage.getItem("userName") || "User");
    };

    window.addEventListener("storage", syncUserName);
    return () => window.removeEventListener("storage", syncUserName);
  }, []);

  /* ---------------- Navigation ---------------- */
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
                  className="hidden lg:block w-10 h-10 bg-indigo-500 rounded-full text-white font-bold hover:bg-indigo-600 transition-colors"
                >
                  {userName.charAt(0).toUpperCase()}
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
                <MobileNavItem label="Home" onClick={() => handleNavClick("/home")} />
                <MobileNavItem label="Jobs" onClick={() => handleNavClick("/listed-jobs")} />
              </>
            ) : (
              <>
                <MobileNavItem label="Home" onClick={() => handleNavClick("/home")} />
                <MobileNavItem label="My Bookings" onClick={() => handleNavClick("/my-bookings")} />
              </>
            )}
            <MobileNavItem label="Notification" onClick={() => handleNavClick("/notification")} />

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
                className="w-full text-left px-4 py-3 hover:bg-gray-100"
              >
                Profile
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
            onVerify={() => { }}
            onResend={() => { }}
            onBack={() => setShowOTPModal(false)}
            onClose={handleLoginSuccess}
            onContinue={handleLoginSuccess}
          />
        </div>
      )}
      {/* ================= PROFILE SIDEBAR (RIGHT SLIDE) ================= */}
      {showProfileSidebar && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowProfileSidebar(false)}
          />

          {/* Sidebar Panel */}
          <div className="relative w-80 h-full bg-white shadow-xl transform transition-transform duration-300 translate-x-0">
            <ProfileSidebar
              user={{ name: userName }}

              onNavigate={(path: string) => {
                navigate(path);
                setShowProfileSidebar(false);
              }}
              onLogout={() => {
                logout();
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
    <Icon className="w-4 h-4" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const MobileNavItem = ({ label, onClick }: any) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors"
  >
    {label}
  </button>
);

export default Navbar;

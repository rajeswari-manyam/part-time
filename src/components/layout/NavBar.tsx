// ==================== FILE: src/components/layout/Navbar.tsx ====================
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Bookmark,
  User,
  Bell,
  LogOut,
  Briefcase,
  Home,
} from "lucide-react";

import { useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Buttons";
import typography, { combineTypography } from "../../styles/typography";
import WelcomePage from "../Auth/WelcomePage";
import OTPVerification from "../Auth/OTPVerification";

const languages = ["EN", "ES", "FR"];

const Navbar: React.FC = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
      const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  /* ---------------- Navigation ---------------- */
  const handleNavClick = (path: string) => {
    if (!isAuthenticated) {
      setShowWelcomeModal(true);
      return;
    }
    navigate(path);
  };



const handleProfileClick = () => {
  if (!isAuthenticated) {
    setShowWelcomeModal(true);
    return;
  }

  navigate("/profile", {
    state: { background: location },
  });
};

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /* ---------------- OTP ---------------- */
  const handleLoginSuccess = () => {
    setShowOTPModal(false);
    setShowWelcomeModal(false);
    setTimeout(() => navigate("/", { replace: true }), 100);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>

              <div className="ml-2">
                <h1
                  className={combineTypography(
                    typography.logo.title,
                    "text-blue-800 hidden sm:block"
                  )}
                >
                  ServiceHub
                </h1>
                <p
                  className={combineTypography(
                    typography.logo.subtitle,
                    "hidden lg:block"
                  )}
                >
                  Find Local Service Experts
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center space-x-6">
                <button
                  onClick={() => handleNavClick("/")}
                  className={`flex items-center space-x-1 ${!isAuthenticated
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:text-blue-600"
                    }`}
                >
                  <Home className="w-4 h-4" />
                  <span className={typography.nav.menuItem}>Home</span>
                </button>

                <button
                  onClick={() => handleNavClick("/free-listing")}
                  className={`flex items-center space-x-1 ${!isAuthenticated
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:text-blue-600"
                    }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span className={typography.nav.menuItem}>Free Listing</span>
                </button>

                <button
                  onClick={() => handleNavClick("/jobs")}
                  className={`flex items-center space-x-1 ${!isAuthenticated
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:text-blue-600"
                    }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span className={typography.nav.menuItem}>Jobs</span>
                </button>
              </div>

              {/* Notification */}
              <button
                onClick={() => handleNavClick("/notifications")}
                className={`${!isAuthenticated
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:text-blue-600"
                  }`}
              >
                <Bell className="w-5 h-5" />
              </button>

              {/* Language */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang}>{lang}</option>
                ))}
              </select>

              {/* Login Button */}
              {!isAuthenticated && (
                <Button
                  variant="gradient-blue"
                  size="md"
                  className="hidden lg:block"
                  onClick={() => setShowWelcomeModal(true)}
                >
                  Login / Sign Up
                </Button>
              )}

              {/* Profile Button (ONLY button after login) */}
              {isAuthenticated && (
                <button
                  onClick={handleProfileClick}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================= AUTH MODALS ================= */}
      <WelcomePage
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onOpenOTP={openOTPModal}
      />

      {showOTPModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
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
    </>
  );
};

export default Navbar;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, Bookmark, User, Bell, LogOut, Briefcase, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../ui/Buttons";
import typography, { combineTypography } from "../../styles/typography";
import WelcomePage from "../Auth/WelcomePage";
import OTPVerification from "../Auth/OTPVerification";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "as", label: "অসমীয়া" },
  { code: "ur", label: "اردو" },
];

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Sync i18n with language context on mount and when language changes
  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  /* ---------------- Language Change ---------------- */
  const changeLanguage = (lang: string) => {
    // Use the context's setLanguage which handles both i18n and localStorage
    setLanguage(lang);
  };

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
    navigate("/profile", { state: { background: location } });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /* ---------------- OTP ---------------- */
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
                <h1 className={combineTypography(typography.logo.title, "text-blue-800 hidden sm:block")}>
                  ServiceHub
                </h1>
                <p className={combineTypography(typography.logo.subtitle, "hidden lg:block")}>
                  {t("tagline")}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center space-x-6">
                <button
                  onClick={() => handleNavClick("/")}
                  className={`flex items-center space-x-1 ${!isAuthenticated ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-blue-600"}`}
                >
                  <Home className="w-4 h-4" />
                  <span className={typography.nav.menuItem}>{t("home")}</span>
                </button>

                <button
                  onClick={() => handleNavClick("/free-listing")}
                  className={`flex items-center space-x-1 ${!isAuthenticated ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-blue-600"}`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span className={typography.nav.menuItem}>{t("freeListing")}</span>
                </button>

                <button
                  onClick={() => handleNavClick("/jobs")}
                  className={`flex items-center space-x-1 ${!isAuthenticated ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-blue-600"}`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span className={typography.nav.menuItem}>{t("jobs")}</span>
                </button>
              </div>

              {/* Notification */}
              <button
                onClick={() => handleNavClick("/notifications")}
                className={`${!isAuthenticated ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-blue-600"}`}
              >
                <Bell className="w-5 h-5" />
              </button>

              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>

              {/* Login/Profile */}
              {!isAuthenticated ? (
                <Button
                  variant="gradient-blue"
                  size="md"
                  className="hidden lg:block"
                  onClick={() => setShowWelcomeModal(true)}
                >
                  {t("login")}
                </Button>
              ) : (
                <button onClick={handleProfileClick} className="p-2 rounded-full hover:bg-gray-100">
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
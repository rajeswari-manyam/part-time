import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGlobe, FaBell, FaTimes, FaBars } from "react-icons/fa";
import Button from "../ui/Buttons";
import typography from "../../styles/typography";
import WelcomePage from "../Auth/WelcomePage";

// Cast icons to any to avoid TS2786 error with React 19
const GlobeIcon = FaGlobe as any;
const BellIcon = FaBell as any;
const TimesIcon = FaTimes as any;
const BarsIcon = FaBars as any;

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openWelcomeModal = () => {
    setIsWelcomeModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const closeWelcomeModal = () => {
    setIsWelcomeModalOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">

            {/* Left: Logo */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center">
                <div className="bg-blue-600 p-3 rounded-full">
                  <span className={`text-white font-bold ${typography.logo.icon}`}>⚡</span>
                </div>
                <div className="ml-3">
                  <h1 className={`text-blue-800 ${typography.logo.title}`}>ServiceHub</h1>
                  <p className={`hidden sm:block ${typography.logo.subtitle}`}>Find Local Service Experts</p>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Menu */}
            <div className={`hidden lg:flex gap-10 text-gray-700 ${typography.nav.menuItem}`}>
              <Link to="/" className="hover:text-blue-600 transition">Home</Link>
              {/* Updated: Link to role selection page */}
              <Link to="/role-selection" className="hover:text-blue-600 transition">All Services</Link>
              <Link to="/workers" className="hover:text-blue-600 transition">For Workers</Link>
              <Link to="/help" className="hover:text-blue-600 transition">Help</Link>
            </div>

            {/* Right: Icons and Buttons (Desktop) */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Language selector */}
              <button className={`flex items-center text-gray-700 hover:text-blue-600 gap-2 transition ${typography.nav.button}`}>
                <GlobeIcon size={22} />
                <span>English</span>
              </button>

              {/* Notification */}
              <button className="relative text-gray-700 hover:text-blue-600 transition">
                <BellIcon size={24} />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {/* Action Buttons */}
              <div className="flex items-center gap-8">
                <Button variant="success" to="/leads" size="md">
                  Leads
                </Button>

                <Button variant="gradient-orange" to="/free-listing" size="md">
                  Free Listing
                </Button>

                {/* Login Button - Opens Modal */}
                <button
                  onClick={openWelcomeModal}
                  className="bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] hover:from-[#090B7A] hover:to-[#5A95E0] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  Login / Sign Up
                </button>
              </div>
            </div>

            {/* Mobile: Notification & Menu Button */}
            <div className="flex lg:hidden items-center gap-4">
              {/* Notification - Mobile */}
              <button className="relative text-gray-700 hover:text-blue-600">
                <BellIcon size={24} />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-blue-600 text-3xl"
              >
                {isMobileMenuOpen ? <TimesIcon /> : <BarsIcon />}
              </button>
            </div>

          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-6 space-y-5">
              {/* Mobile Navigation Links */}
              <div className={`flex flex-col space-y-4 text-gray-700 ${typography.nav.menuItem}`}>
                <Link
                  to="/"
                  className="hover:text-blue-600 px-3 py-3 hover:bg-gray-50 rounded transition"
                  onClick={toggleMobileMenu}
                >
                  Home
                </Link>
                {/* Updated: Link to role selection page */}
                <Link
                  to="/role-selection"
                  className="hover:text-blue-600 px-3 py-3 hover:bg-gray-50 rounded transition"
                  onClick={toggleMobileMenu}
                >
                  All Services
                </Link>
                <Link
                  to="/workers"
                  className="hover:text-blue-600 px-3 py-3 hover:bg-gray-50 rounded transition"
                  onClick={toggleMobileMenu}
                >
                  For Workers
                </Link>
                <Link
                  to="/help"
                  className="hover:text-blue-600 px-3 py-3 hover:bg-gray-50 rounded transition"
                  onClick={toggleMobileMenu}
                >
                  Help
                </Link>
              </div>

              {/* Language Selector - Mobile */}
              <button className={`flex items-center text-gray-700 hover:text-blue-600 gap-2 px-3 py-3 w-full hover:bg-gray-50 rounded transition ${typography.nav.button}`}>
                <GlobeIcon size={22} />
                <span>English</span>
              </button>

              {/* Mobile Action Buttons */}
              <div className="flex flex-col gap-4 pt-2">
                <Button variant="success" to="/leads" fullWidth size="md">
                  Leads
                </Button>

                <Button variant="gradient-orange" to="/free-listing" fullWidth size="md">
                  Free Listing
                </Button>

                {/* Login Button - Opens Modal (Mobile) */}
                <button
                  onClick={openWelcomeModal}
                  className="w-full bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] hover:from-[#090B7A] hover:to-[#5A95E0] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md text-center block"
                >
                  Login / Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Welcome Modal */}
      <WelcomePage isOpen={isWelcomeModalOpen} onClose={closeWelcomeModal} />
    </>
  );
};

export default Navbar;
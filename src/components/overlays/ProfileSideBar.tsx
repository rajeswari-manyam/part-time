// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     Heart,
//     Bookmark,
//     User,
//     Globe,
//     Bell,
//     Shield,
//     MessageSquare,
//     HelpCircle,
//     LogOut,
//     X,
//     Briefcase,
//     Gift,
//     Info,
//     Ticket,
// } from "lucide-react";


// type AccountType = "user" | "worker";

// interface ProfileSidebarProps {
//     onNavigate: (path: string) => void;
//     onLogout: () => void;
//     user: {
//         name: string;
//         id?: string;
//         _id?: string;
//     };
//     profilePic?: string | null;
// }

// const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
//     onNavigate,
//     onLogout,
//     user,
//     profilePic: initialProfilePic,
// }) => {
//     const [showLogoutPopup, setShowLogoutPopup] = useState(false);
//     const [userName, setUserName] = useState(user.name || "User");
//     const [profilePic, setProfilePic] = useState<string | null>(initialProfilePic || null);
//     const [accountType, setAccountType] = useState<AccountType>("user");
//     const navigate = useNavigate();
//     const getInitial = (name: string) => {
//         if (!name || name === "User") return "U";
//         return name.charAt(0).toUpperCase();
//     };

//     const initial = getInitial(userName);
// const handleLogout = () => {
//     setShowLogoutPopup(false);

//     if (onLogout) {
//         onLogout(); // clear auth / token / context
//     }

//     navigate("/"); // navigate to homepage
// };


//     return (
//         <>
//             <div className="h-full flex flex-col bg-white">
//                 {/* ================= HEADER ================= */}
//                 <div className="flex items-center justify-between p-6 border-b">
//                     <div className="flex-1">
//                         <h2 className="text-lg font-semibold text-gray-900">
//                             {userName}
//                         </h2>
//                         <button
//                             onClick={() => onNavigate("/profile")}
//                             className="text-sm text-blue-600 hover:underline"
//                         >
//                             Click to view profile
//                         </button>
//                     </div>

//                     {/* Profile Avatar */}
//                     <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white">
//                         {profilePic ? (
//                             <img
//                                 src={profilePic}
//                                 alt={userName}
//                                 className="w-full h-full object-cover"
//                             />
//                         ) : (
//                             <div className="w-full h-full bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] flex items-center justify-center text-white font-bold text-lg">
//                                 {initial}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* ================= PROFILE SECTION ================= */}
//                 <div className="p-4">
//                     <p className="text-xs font-semibold text-gray-500 mb-2 px-3">Profile</p>

//                     <MenuItem
//                         icon={<User className="text-blue-500" />}
//                         label="My Profile"
//                         onClick={() => onNavigate("/my-profile")}
//                     />

//                     <MenuItem
//                         icon={<Globe className="text-blue-500" />}
//                         label="Change Language"
//                         onClick={() => { }}
//                     />

//                     <MenuItem
//                         icon={<Gift className="text-orange-500" />}
//                         label="Refer & Earn"
//                         onClick={() => onNavigate("/refer-and-earn")}
//                     />
//                 </div>

//                 {/* ================= SUPPORT & SETTINGS SECTION ================= */}
//                 <div className="p-4">
//                     <p className="text-xs font-semibold text-gray-500 mb-2 px-3">Support & Settings</p>

//                     <MenuItem
//                         icon={<Shield className="text-yellow-500" />}
//                         label="Privacy Policy"
//                         onClick={() => onNavigate("/policy")}
//                     />

//                     <MenuItem
//                         icon={<Info className="text-gray-500" />}
//                         label="About Us"
//                         onClick={() => onNavigate("/about-us")}
//                     />

//                     <MenuItem
//                         icon={<Ticket className="text-yellow-500" />}
//                         label="Raise Ticket"
//                         onClick={() => onNavigate("/raise-ticket")}
//                     />

//                     <MenuItem
//                         icon={<HelpCircle className="text-red-400" />}
//                         label="Help"
//                         onClick={() => onNavigate("/help")}
//                     />

//                     <MenuItem
//                         icon={<LogOut className="text-red-500" />}
//                         label="Logout"
//                         danger
//                         onClick={() => setShowLogoutPopup(true)}
                        
//                     />
//                 </div>
//             </div>

//             {/* ================= LOGOUT POPUP ================= */}
//             {showLogoutPopup && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//                     <div
//                         className="absolute inset-0 bg-black/40 backdrop-blur-md"
//                         onClick={() => setShowLogoutPopup(false)}
//                     />
                    
// <div className="relative bg-[#F0F0F0] rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-scale-in">
//     <div className="bg-[#1A5F9E] px-6 py-8 text-center">
//         <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
//             <LogOut className="w-10 h-10 text-white" />
//         </div>
//         <h3 className="text-2xl font-bold text-white">
//             Logout?
//         </h3>
//     </div>
// </div>

//                         <div className="p-6">
//                             <p className="text-gray-600 text-center mb-6">
//                                 Are you sure you want to logout?
//                             </p>

//                             <div className="space-y-3">
//                                 <button
//                                     onClick={handleLogout}
//                                     className="w-full py-3 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white rounded-xl font-semibold hover:brightness-110 transition-all"
//                                 >
//                                     Yes, Logout
//                                 </button>
//                                 <button
//                                     onClick={() => setShowLogoutPopup(false)}
//                                     className="w-full py-3 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>

//                         <button
//                             onClick={() => setShowLogoutPopup(false)}
//                             className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
//                         >
//                             <X className="w-5 h-5" />
//                         </button>
//                     </div>
             
//             )}
//         </>
//     );
// };

// /* ================= MENU ITEM ================= */

// interface MenuItemProps {
//     icon: React.ReactNode;
//     label: string;
//     onClick?: () => void;
//     danger?: boolean;
// }

// const MenuItem: React.FC<MenuItemProps> = ({
//     icon,
//     label,
//     onClick,
//     danger = false,
// }) => (
//     <button
//         onClick={onClick}
//         className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${danger
//             ? "text-red-600 hover:bg-red-50"
//             : "text-gray-700 hover:bg-gray-100"
//             }`}
//     >
//         <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
//         <span className="flex-1 text-left">{label}</span>
//         <span className="text-gray-400">›</span>
//     </button>
// );

// export default ProfileSidebar;

















import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Globe,
  Shield,
  HelpCircle,
  LogOut,
  X,
  Gift,
  Info,
  Ticket,
} from "lucide-react";
import Button from "../ui/Buttons";

type AccountType = "user" | "worker";

interface ProfileSidebarProps {
  onNavigate: (path: string) => void;
  onLogout: () => void;
  user: {
    name: string;
    id?: string;
    _id?: string;
  };
  profilePic?: string | null;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  onNavigate,
  onLogout,
  user,
  profilePic: initialProfilePic,
}) => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [userName] = useState(user.name || "User");
  const [profilePic] = useState<string | null>(initialProfilePic || null);
  const [accountType] = useState<AccountType>("user");

  const navigate = useNavigate();

  const getInitial = (name: string) =>
    !name || name === "User" ? "U" : name.charAt(0).toUpperCase();

  const handleLogout = () => {
    setShowLogoutPopup(false);
    onLogout();
    navigate("/");
  };

  return (
    <>
      {/* ================= SIDEBAR ================= */}
      <div className="h-full flex flex-col bg-[#F0F0F0]">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between p-6 border-b bg-white">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {userName}
            </h2>
            <button
              onClick={() => onNavigate("/profile")}
              className="text-sm text-[#1A5F9E] hover:underline"
            >
              Click to view profile
            </button>
          </div>

          {/* Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white">
            {profilePic ? (
              <img
                src={profilePic}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#1A5F9E] flex items-center justify-center text-white font-bold text-lg">
                {getInitial(userName)}
              </div>
            )}
          </div>
        </div>

        {/* ================= PROFILE ================= */}
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-500 mb-2 px-3">
            Profile
          </p>

          <MenuItem
            icon={<User className="text-[#1A5F9E]" />}
            label="My Profile"
            onClick={() => onNavigate("/my-profile")}
          />

          <MenuItem
            icon={<Globe className="text-[#1A5F9E]" />}
            label="Change Language"
          />

          <MenuItem
            icon={<Gift className="text-orange-500" />}
            label="Refer & Earn"
            onClick={() => onNavigate("/refer-and-earn")}
          />
        </div>

        {/* ================= SUPPORT ================= */}
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-500 mb-2 px-3">
            Support & Settings
          </p>

          <MenuItem
            icon={<Shield className="text-yellow-500" />}
            label="Privacy Policy"
            onClick={() => onNavigate("/policy")}
          />

          <MenuItem
            icon={<Info className="text-gray-500" />}
            label="About Us"
            onClick={() => onNavigate("/about-us")}
          />

          <MenuItem
            icon={<Ticket className="text-yellow-500" />}
            label="Raise Ticket"
            onClick={() => onNavigate("/raise-ticket")}
          />

          <MenuItem
            icon={<HelpCircle className="text-red-400" />}
            label="Help"
            onClick={() => onNavigate("/help")}
          />

          <MenuItem
            icon={<LogOut className="text-red-500" />}
            label="Logout"
            danger
            onClick={() => setShowLogoutPopup(true)}
          />
        </div>
      </div>

      {/* ================= LOGOUT MODAL ================= */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setShowLogoutPopup(false)}
          />

          <div className="relative bg-[#F0F0F0] rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-[#1A5F9E] px-6 py-8 text-center">
              <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <LogOut className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Logout?
              </h3>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to logout?
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleLogout}
                  fullWidth
                  className="bg-[#1A5F9E] text-white hover:brightness-110"
                >
                  Yes, Logout
                </Button>

                <Button
                  onClick={() => setShowLogoutPopup(false)}
                  fullWidth
                  variant="secondary"
                  className="bg-[#F0F0F0] hover:brightness-95"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => setShowLogoutPopup(false)}
              className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/* ================= MENU ITEM ================= */

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  onClick,
  danger = false,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${
      danger
        ? "text-red-600 hover:bg-red-50"
        : "text-gray-700 hover:bg-[#F0F0F0]"
    }`}
  >
    <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    <span className="text-gray-400">›</span>
  </button>
);

export default ProfileSidebar;

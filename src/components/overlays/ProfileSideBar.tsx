import React, { useState } from "react";
import {
    Heart,
    Bookmark,
    User,
    Globe,
    Bell,
    Shield,
    MessageSquare,
    HelpCircle,
    LogOut,
    X,
} from "lucide-react";

interface ProfileSidebarProps {
    onNavigate: (path: string) => void;
    onLogout: () => void;
    user: {
        name: string;
        initial: string;
    };
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
    onNavigate,
    onLogout,
    user,
}) => {
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutPopup(true);
    };

    const handleConfirmLogout = () => {
        setShowLogoutPopup(false);
        onLogout();
    };

    const handleCancelLogout = () => {
        setShowLogoutPopup(false);
    };

    return (
        <>
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
                        <button
                            onClick={() => onNavigate("/profile")}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Click to view profile
                        </button>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] flex items-center justify-center text-white font-bold">
                        {user.initial}
                    </div>
                </div>

                {/* Menu */}
                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    <MenuItem icon={<Heart />} label="Favourite" onClick={() => onNavigate("/favorites")} />
                    <MenuItem icon={<Bookmark />} label="Saved" onClick={() => onNavigate("/saved")} />
                    <MenuItem icon={<User />} label="Edit Profile" onClick={() => onNavigate("/profile/edit")} />
                    <MenuItem icon={<Globe />} label="Change Language" />
                    <MenuItem icon={<Bell />} label="Notifications" onClick={() => onNavigate("/notifications")} />

                    <div className="my-3 border-t" />

                    <MenuItem icon={<Shield />} label="Policy" onClick={() => onNavigate("/policy")} />
                    <MenuItem icon={<MessageSquare />} label="Feedback" onClick={() => onNavigate("/feedback")} />
                    <MenuItem icon={<HelpCircle />} label="Help" onClick={() => onNavigate("/help")} />

                    <div className="my-3 border-t" />

                    <MenuItem
                        icon={<LogOut />}
                        label="Logout"
                        danger
                        onClick={handleLogoutClick}
                    />
                </nav>
            </div>

            {/* Logout Confirmation Popup - Modern Design with Blue Gradient */}
            {showLogoutPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Blur Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
                        onClick={handleCancelLogout}
                    />

                    {/* Popup Modal */}
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-popup">
                        {/* Gradient Header */}
                        <div className="bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] px-6 py-8 text-center">
                            <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                                <LogOut className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">
                                Logout?
                            </h3>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-gray-600 text-center mb-6">
                                Are you sure you want to logout? You'll need to login again to access your account.
                            </p>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleConfirmLogout}
                                    className="w-full px-6 py-3.5 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white font-semibold rounded-xl hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Yes, Logout
                                </button>
                                <button
                                    onClick={handleCancelLogout}
                                    className="w-full px-6 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={handleCancelLogout}
                            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes popup {
                    0% {
                        opacity: 0;
                        transform: scale(0.8) translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                .animate-popup {
                    animation: popup 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
            `}</style>
        </>
    );
};

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
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${danger
            ? "text-red-600 hover:bg-red-50"
            : "text-gray-700 hover:bg-gray-100"
            }`}
    >
        <span className="w-5 h-5">{icon}</span>
        <span>{label}</span>
    </button>
);

export default ProfileSidebar;
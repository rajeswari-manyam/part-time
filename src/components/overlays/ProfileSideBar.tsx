import React, { useState } from "react";
import { useAccount } from "../../context/AccountContext"; // Add this import
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
    Briefcase,
} from "lucide-react";

/* ================= TYPES ================= */

type AccountType = "user" | "worker";

interface ProfileSidebarProps {
    onNavigate: (path: string) => void;
    onLogout: () => void;
    user: {
        name: string;
        initial: string;
    };
}

/* ================= SIDEBAR ================= */

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
    onNavigate,
    onLogout,
    user,
}) => {
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const { accountType, setAccountType } = useAccount(); // Use context

    const switchAccount = (type: AccountType) => {
        setAccountType(type); // This will now update the context and navbar
        onNavigate("/home"); // Navigate to home regardless of type
    };

    return (
        <>
            <div className="h-full flex flex-col">
                {/* ================= HEADER ================= */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {user.name}
                        </h2>
                        <button
                            onClick={() =>
                                onNavigate(
                                    accountType === "user"
                                        ? "/profile"
                                        : "/worker-profile"
                                )
                            }
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Click to view profile
                        </button>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] flex items-center justify-center text-white font-bold">
                        {user.initial}
                    </div>
                </div>

                {/* ================= SWITCH ACCOUNT ================= */}
                <div className="px-4 py-4 border-b">
                    <div className="flex items-center justify-between bg-white border rounded-xl px-4 py-3">
                        <div className="flex items-center gap-3 text-[#1F3B64] font-semibold">
                            <Briefcase className="w-5 h-5" />
                            <span>Switch Account</span>
                        </div>

                        <div className="relative flex items-center bg-gray-100 rounded-full p-1 h-10 w-36">
                            <div
                                className={`absolute top-1 left-1 h-8 w-[calc(50%-0.25rem)]
                                bg-gradient-to-r from-[#0B0E92] to-[#69A6F0]
                                rounded-full transition-transform duration-300
                                ${accountType === "user"
                                        ? "translate-x-0"
                                        : "translate-x-full"
                                    }`}
                            />

                            <button
                                onClick={() => switchAccount("user")}
                                className={`relative z-10 w-1/2 text-xs font-semibold
                                ${accountType === "user"
                                        ? "text-white"
                                        : "text-[#1F3B64]"
                                    }`}
                            >
                                Guest
                            </button>

                            <button
                                onClick={() => switchAccount("worker")}
                                className={`relative z-10 w-1/2 text-xs font-semibold
                                ${accountType === "worker"
                                        ? "text-white"
                                        : "text-[#1F3B64]"
                                    }`}
                            >
                                Worker
                            </button>
                        </div>
                    </div>
                </div>

                {/* ================= MENU (ACCOUNT-SPECIFIC) ================= */}
                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    {accountType === "user" ? (
                        <>
                            {/* GUEST NAVIGATION */}
                            <MenuItem
                                icon={<Heart />}
                                label="Home"
                                onClick={() => onNavigate("/home")}
                            />
                            <MenuItem
                                icon={<Bookmark />}
                                label="Free Listing"
                                onClick={() => onNavigate("/free-listing")}
                            />
                        </>
                    ) : (
                        <>
                            {/* WORKER NAVIGATION */}
                            <MenuItem
                                icon={<Globe />}
                                label="Home"
                                onClick={() => onNavigate("/home")}
                            />
                            <MenuItem
                                icon={<Bell />}
                                label="My Bookings"
                                onClick={() => onNavigate("/my-bookings")}
                            />
                        </>
                    )}

                    <div className="my-3 border-t" />

                    {/* COMMON MENU ITEMS */}
                    <MenuItem icon={<Heart />} label="Favourite" onClick={() => onNavigate("/favorites")} />
                    <MenuItem icon={<Bookmark />} label="Saved" onClick={() => onNavigate("/saved")} />
                    <MenuItem
                        icon={<User />}
                        label="Edit Profile"
                        onClick={() =>
                            onNavigate(
                                accountType === "user"
                                    ? "/profile/edit"
                                    : "/worker-profile/edit"
                            )
                        }
                    />

                    <MenuItem icon={<Globe />} label="Change Language" />
                    <MenuItem icon={<Bell />} label="Notifications" onClick={() => onNavigate("/notification/:id")} />

                    <div className="my-3 border-t" />

                    <MenuItem icon={<Shield />} label="Policy" onClick={() => onNavigate("/policy")} />
                    <MenuItem icon={<MessageSquare />} label="Feedback" onClick={() => onNavigate("/feedback/:id")} />
                    <MenuItem icon={<HelpCircle />} label="Help" onClick={() => onNavigate("/help")} />

                    <div className="my-3 border-t" />

                    <MenuItem
                        icon={<LogOut />}
                        label="Logout"
                        danger
                        onClick={() => setShowLogoutPopup(true)}
                    />
                </nav>
            </div>

            {/* ================= LOGOUT POPUP ================= */}
            {showLogoutPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        onClick={() => setShowLogoutPopup(false)}
                    />

                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] px-6 py-8 text-center">
                            <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                <LogOut className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">
                                Logout?
                            </h3>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 text-center mb-6">
                                Are you sure you want to logout?
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={onLogout}
                                    className="w-full py-3 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white rounded-xl font-semibold"
                                >
                                    Yes, Logout
                                </button>
                                <button
                                    onClick={() => setShowLogoutPopup(false)}
                                    className="w-full py-3 bg-gray-100 rounded-xl font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowLogoutPopup(false)}
                            className="absolute top-4 right-4"
                        >
                            <X className="w-5 h-5 text-white" />
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
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${danger
            ? "text-red-600 hover:bg-red-50"
            : "text-gray-700 hover:bg-gray-100"
            }`}
    >
        <span className="w-5 h-5">{icon}</span>
        <span>{label}</span>
    </button>
);

export default ProfileSidebar;
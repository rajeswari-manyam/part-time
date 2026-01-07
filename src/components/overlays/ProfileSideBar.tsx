import React, { useState, useEffect } from "react";
import { useAccount } from "../../context/AccountContext";
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
import { getUserById, API_BASE_URL } from "../../services/api.service";

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
    const [userName, setUserName] = useState(user.name || "User");
    const [profilePic, setProfilePic] = useState<string | null>(initialProfilePic || null);
    const [isLoadingName, setIsLoadingName] = useState(false);
    const { accountType, setAccountType } = useAccount();

    // ✅ Fetch user name and profile picture dynamically on mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Try to get from localStorage first
                const cachedName = localStorage.getItem("userName");
                if (cachedName && cachedName !== "User") {
                    setUserName(cachedName);
                }

                // Get userId from multiple sources
                const userId =
                    user.id ||
                    user._id ||
                    localStorage.getItem("userId");

                if (!userId) {
                    console.log("No userId available");
                    return;
                }

                setIsLoadingName(true);
                console.log("📡 Fetching user profile for:", userId);

                const response = await getUserById(userId);
                console.log("📥 User profile response:", response);

                if (response.success && response.data) {
                    // Update name
                    if (response.data.name) {
                        const fetchedName = response.data.name;
                        setUserName(fetchedName);
                        localStorage.setItem("userName", fetchedName);
                        console.log("✅ Updated user name:", fetchedName);
                    }

                    // Update profile picture
                    if (response.data.profilePic) {
                        const picUrl = response.data.profilePic.startsWith('http')
                            ? response.data.profilePic
                            : `${API_BASE_URL}${response.data.profilePic}`;
                        setProfilePic(picUrl);
                        console.log("✅ Updated profile pic:", picUrl);
                    }
                }
            } catch (error) {
                console.error("❌ Error fetching user profile:", error);
            } finally {
                setIsLoadingName(false);
            }
        };

        fetchUserProfile();
    }, [user.id, user._id]);

    // ✅ Update profile pic when prop changes
    useEffect(() => {
        if (initialProfilePic) {
            setProfilePic(initialProfilePic);
        }
    }, [initialProfilePic]);

    // ✅ Get initial from name
    const getInitial = (name: string) => {
        if (!name || name === "User") return "U";
        return name.charAt(0).toUpperCase();
    };

    const initial = getInitial(userName);

    const switchAccount = (type: AccountType) => {
        setAccountType(type);
        onNavigate("/home");
    };

    return (
        <>
            <div className="h-full flex flex-col">
                {/* ================= HEADER ================= */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {isLoadingName ? (
                                <span className="animate-pulse">Loading...</span>
                            ) : (
                                userName
                            )}
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

                    {/* Profile Avatar - Show picture or initial */}
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white">
                        {profilePic ? (
                            <img
                                src={profilePic}
                                alt={userName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.error("Failed to load profile image in sidebar");
                                    setProfilePic(null);
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] flex items-center justify-center text-white font-bold text-lg">
                                {initial}
                            </div>
                        )}
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
                            <MenuItem
                                icon={<Bookmark />}
                                label="Free Listing"
                                onClick={() => onNavigate("/free-listing")}
                            />
                        </>
                    ) : (
                        <>
                            <MenuItem
                                icon={<Bell />}
                                label="Worker Skills"
                                onClick={() => onNavigate("/worker-skills")}
                            />
                        </>
                    )}

                    <div className="my-3 border-t" />

                    {/* COMMON MENU ITEMS */}
                    <MenuItem
                        icon={<Heart />}
                        label="Favourite"
                        onClick={() => onNavigate("/favorites")}
                    />
                    <MenuItem
                        icon={<Bookmark />}
                        label="Saved"
                        onClick={() => onNavigate("/saved")}
                    />
                    <MenuItem
                        icon={<User />}
                        label="My Profile"
                        onClick={() =>
                            onNavigate(
                                accountType === "user"
                                    ? "/profile/edit"
                                    : "/my-profile"
                            )
                        }
                    />

                    <MenuItem icon={<Globe />} label="Change Language" />
                    <MenuItem
                        icon={<Bell />}
                        label="Notifications"
                        onClick={() => onNavigate("/notification/:id")}
                    />

                    <div className="my-3 border-t" />

                    <MenuItem
                        icon={<Shield />}
                        label="Policy"
                        onClick={() => onNavigate("/policy")}
                    />
                    <MenuItem
                        icon={<MessageSquare />}
                        label="Feedback"
                        onClick={() => onNavigate("/feedback/:id")}
                    />
                    <MenuItem
                        icon={<HelpCircle />}
                        label="Help"
                        onClick={() => onNavigate("/help")}
                    />

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
                                    className="w-full py-3 bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] text-white rounded-xl font-semibold hover:brightness-110 transition-all"
                                >
                                    Yes, Logout
                                </button>
                                <button
                                    onClick={() => setShowLogoutPopup(false)}
                                    className="w-full py-3 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

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
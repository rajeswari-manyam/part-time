import React from "react";

import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ProfileSidebar from "../components/overlays/ProfileSideBar";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Buttons";

import typography, { combineTypography } from "../styles/typography";

const ProfilePage: React.FC = () => {
   
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <div className="fixed inset-0 z-50">
            {/* Background Blur */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => navigate(-1)}
            />

            {/* Right Panel */}
            <div className="absolute right-0 top-0 h-full w-[360px] bg-white shadow-xl flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b">
                    <h2 className={typography.heading.h5}>
                        {"profile.title"}
                    </h2>

                    {/* Close Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="p-2"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>


                {/* Sidebar Content */}
                <ProfileSidebar
                    user={{ name: "RAJESWARI", initial: "R" }}
                    onNavigate={(path) => navigate(path)}
                    onLogout={() => {
                        logout();
                        navigate("/");
                    }}
                />
            </div>
        </div>
    );
};

export default ProfilePage;

import React from "react";
import Button from "../../ui/Buttons";
import typography from "../../../styles/typography";

interface SuccessScreenProps {
    onContinue: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ onContinue }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 text-center">
                {/* Success Icon with Animation */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="animate-check"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                <h2 className={`text-gray-900 font-bold mb-2 ${typography.heading.h3}`}>
                    Welcome to ServiceHub!
                </h2>
                <p className={`text-green-600 font-semibold mb-8 ${typography.body.base}`}>
                    Verification Successful
                </p>

                {/* Continue Button */}
                <Button
                    onClick={onContinue}
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] hover:brightness-110"
                >
                    Continue →
                </Button>

                <style>{`
                    @keyframes scale-in {
                        0% {
                            transform: scale(0);
                            opacity: 0;
                        }
                        50% {
                            transform: scale(1.1);
                        }
                        100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                    
                    @keyframes check {
                        0% {
                            stroke-dasharray: 0, 100;
                        }
                        100% {
                            stroke-dasharray: 100, 0;
                        }
                    }
                    
                    .animate-scale-in {
                        animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                    }
                    
                    .animate-check {
                        stroke-dasharray: 100;
                        animation: check 0.6s 0.3s cubic-bezier(0.65, 0, 0.45, 1) forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default SuccessScreen;
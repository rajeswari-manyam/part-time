import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../ui/Buttons";
import typography from "../../styles/typography";
import OTPVerification from "./OTPVerification";
import voiceIcon from "../../assets/icons/Voice.png";
import VoiceService from "../../services/voiceService";
import { registerWithOtp, verifyOtp } from "../../services/api.service";

interface LoginFormProps {
    onClose: () => void;
    initialMode?: "signup" | "login";
    onBack?: () => void;
    onOpenOTP?: (phone: string) => void;
}

type FormStep = "phone" | "otp";

const LoginForm: React.FC<LoginFormProps> = ({ onClose, initialMode = "signup", onBack, onOpenOTP }) => {
    const navigate = useNavigate();

    const [phoneNumber, setPhoneNumber] = useState("");
    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [isLogin, setIsLogin] = useState(initialMode === "login");
    const [currentStep, setCurrentStep] = useState<FormStep>("phone");
    const [isListening, setIsListening] = useState(false);
    const [voiceError, setVoiceError] = useState<string | null>(null);

    const voiceService = VoiceService.getInstance();

    // Get user's location on component mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    }, []);

    const extractPhoneNumber = (text: string): string => {
        // convert words → digits
        const map: Record<string, string> = {
            zero: "0",
            one: "1",
            two: "2",
            three: "3",
            four: "4",
            five: "5",
            six: "6",
            seven: "7",
            eight: "8",
            nine: "9",
            oh: "0",
        };

        let processed = text.toLowerCase();
        Object.keys(map).forEach(word => {
            processed = processed.replace(new RegExp(word, "g"), map[word]);
        });

        return processed.replace(/\D/g, "").slice(0, 10);
    };

    const handleVoiceInput = () => {
        console.log("Voice button clicked");

        if (!voiceService.isSpeechRecognitionSupported()) {
            const errorMsg = "Voice not supported";
            setVoiceError(errorMsg);
            console.error(errorMsg);
            setTimeout(() => setVoiceError(null), 5000);
            return;
        }

        if (isListening) {
            console.log("Stopping voice input");
            voiceService.stopListening();
            setIsListening(false);
            return;
        }

        console.log("Starting voice input");
        setIsListening(true);
        setVoiceError(null);

        voiceService.startListening(
            (result) => {
                console.log("Voice result received:", result.transcript);
                const extracted = extractPhoneNumber(result.transcript);
                console.log("Extracted phone number:", extracted);

                if (extracted.length > 0) {
                    setPhoneNumber(extracted);
                }

                // Stop automatically when we have 10 digits and it's final
                if (result.isFinal && extracted.length === 10) {
                    console.log("Complete phone number received, stopping");
                    voiceService.stopListening();
                    setIsListening(false);
                }
            },
            (error) => {
                console.error("Voice error:", error);
                setVoiceError(error);
                setIsListening(false);
                setTimeout(() => setVoiceError(null), 5000);
            }
        );
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        setPhoneNumber(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (phoneNumber.length !== 10) return;

        try {
            const response = await registerWithOtp({
                phone: phoneNumber,
                name,
                latitude: latitude ?? 0,
                longitude: longitude ?? 0,
            });

            if (response.success) {
                console.log("OTP sent:", response.otp);

                if (onOpenOTP) {
                    onOpenOTP(phoneNumber); // Navbar OTP screen
                } else {
                    setCurrentStep("otp"); // Inline OTP
                }
            } else {
                alert(response.message || "Registration failed");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to register. Please try again.");
        }
    };

    const handleOTPVerify = async (otp: string) => {
        console.log("Verifying OTP:", otp);

        try {
            const response = await verifyOtp({
                phone: phoneNumber,
                otp: otp,
            });

            if (response.success && response.data) {
                // ✅ CRITICAL: Save user data to localStorage
                const userData = response.data;
                console.log("User authenticated:", userData);

                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("token", response.token || ""); // If your API returns a token

                // Close the login modal
                onClose();

                // Optional: Navigate to profile or home page
                // navigate("/profile");

                // Show success message
                alert("Login successful!");
            } else {
                alert(response.message || "Invalid OTP");
            }
        } catch (error: any) {
            console.error("OTP verification error:", error);
            alert(error.response?.data?.message || "Failed to verify OTP");
        }
    };

    const handleOTPResend = async () => {
        console.log("Resending OTP to:", phoneNumber);

        try {
            const response = await registerWithOtp({
                phone: phoneNumber,
                name,
                latitude: latitude ?? 0,
                longitude: longitude ?? 0,
            });

            if (response.success) {
                console.log("OTP resent:", response.otp);
                alert("OTP sent successfully!");
            } else {
                alert(response.message || "Failed to resend OTP");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to resend OTP. Please try again.");
        }
    };

    const handleBackToPhone = () => {
        setCurrentStep("phone");
    };

    // Only show inline OTP if onOpenOTP is NOT provided
    if (currentStep === "otp" && !onOpenOTP) {
        return (
            <OTPVerification
                phoneNumber={phoneNumber}
                onVerify={handleOTPVerify}
                onResend={handleOTPResend}
                onBack={handleBackToPhone}
            />
        );
    }

    return (
        <div className="space-y-8">
            {/* Back Button */}
            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-black absolute top-6 left-6"
                >
                    ← Back
                </button>
            )}

            <div className="text-center pt-6">
                <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] p-4 rounded-full">
                        <span className={`text-white ${typography.logo.icon}`}>⚡</span>
                    </div>
                </div>
                <h1 className={`text-gray-900 mb-2 ${typography.heading.h3}`}>
                    ServiceHub
                </h1>
                <p className={`text-gray-600 ${typography.body.base}`}>
                    {isLogin ? "Welcome Back" : "Find Professionals"}
                </p>
            </div>

            {/* Voice Assistance Button */}
            <button
                type="button"
                onClick={handleVoiceInput}
                className={`w-full rounded-full py-3 px-6 text-center transition-all flex items-center justify-center gap-2 ${isListening
                    ? "bg-red-600 animate-pulse"
                    : "bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] hover:brightness-110"
                    }`}
            >
                <img src={voiceIcon} alt="Voice" className="w-5 h-5" />
                <p className={`text-white ${typography.body.small}`}>
                    {isListening ? "Listening" : "Voice Assistance"}
                </p>
            </button>

            {/* Phone Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="phone"
                        className={`block mb-2 text-gray-700 ${typography.form.label}`}
                    >
                        Mobile Number
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <span className={`text-gray-500 ${typography.body.base}`}>+91</span>
                        </div>
                        <input
                            type="tel"
                            id="phone"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="98765 43210"
                            maxLength={10}
                            className={`w-full pl-16 pr-14 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors duration-200 ${typography.form.input}`}
                            required
                        />

                        <button
                            type="button"
                            onClick={handleVoiceInput}
                            className={`absolute inset-y-0 right-0 flex items-center pr-4 transition-colors duration-200 ${isListening
                                ? "text-red-500 animate-pulse"
                                : "text-gray-400 hover:text-blue-600"
                                }`}
                            title={isListening ? "Stop listening" : "Use voice input"}
                        >
                            {isListening ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="8" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {voiceError && (
                        <p className={`mt-2 text-red-500 ${typography.form.helper}`}>
                            {voiceError}
                        </p>
                    )}
                    {!isLogin && !voiceError && (
                        <p className={`mt-2 text-gray-500 ${typography.form.helper}`}>
                            Verify Text
                        </p>
                    )}
                </div>

                {/* Name Input */}
                <div>
                    <label className={`block mb-2 text-gray-700 ${typography.form.label}`}>
                        Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className={`w-full py-4 px-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 ${typography.form.input}`}
                        required
                    />
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    variant="gradient-blue"
                    disabled={phoneNumber.length < 10}
                >
                    Send OTP
                </Button>

                {/* Terms & Conditions */}
                {!isLogin && (
                    <p className={`text-center text-gray-500 ${typography.body.xs}`}>
                        Agree to{" "}
                        <a
                            href="/terms"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Terms
                        </a>{" "}
                        and{" "}
                        <a
                            href="/privacy"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Privacy
                        </a>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginForm;
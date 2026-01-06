import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VoiceService from "../../services/voiceService";
import { useAuth } from "../../context/AuthContext";
import OTPInputForm from "./OtpVerification/OTPInputForm";
import SuccessScreen from "./OtpVerification/SuccessScreen";
import { extractDigits } from "../../utils/OTPUtils";
import { verifyOtp, resendOtp, getUserById } from "../../services/api.service"; // ✅ Added getUserById

interface VoiceRecognitionResult {
    transcript: string;
    confidence: number;
    isFinal: boolean;
}

interface OTPVerificationProps {
    phoneNumber: string;
    onVerify?: (otp: string) => void;
    onResend?: () => void;
    onBack: () => void;
    onContinue?: () => void;
    onClose?: () => void;
}

interface OTPVerifyResponse {
    success: boolean;
    message?: string;
    user?: {
        id?: string;
        _id?: string;
        phone: string;
        name: string;
        token?: string;
    };
    token?: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
    phoneNumber,
    onResend,
    onBack,
    onContinue,
    onClose,
}) => {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(60);
    const [isListening, setIsListening] = useState(false);
    const [voiceError, setVoiceError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const voiceService = VoiceService.getInstance();
    const navigate = useNavigate();
    const { login } = useAuth();

    // Timer countdown
    useEffect(() => {
        if (timer > 0 && !showSuccess) {
            const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer, showSuccess]);

    // ✅ SIMPLIFIED: Verify OTP and save data
    const handleVerifyOTP = async (otpString: string) => {
        if (!otpString || otpString.length !== 6) {
            console.log("Invalid OTP length:", otpString.length);
            return;
        }

        try {
            setIsVerifying(true);
            console.log("🔐 Verifying OTP:", otpString, "for phone:", phoneNumber);

            // Step 1: Verify OTP
            const response: OTPVerifyResponse = await verifyOtp({
                phone: phoneNumber,
                otp: otpString,
            });

            console.log("📥 Verify OTP response:", response);

            if (response.success) {
                console.log("✅ OTP verified successfully!");

                // Step 2: Extract userId from response
                let userId = response.user?.id || response.user?._id;
                let userData = response.user;

                // ✅ NEW: If no userId in response, try to fetch by phone using existing endpoint
                if (!userId) {
                    console.log("⚠️ No userId in response");

                    // Try to use the phone number to construct a search
                    // Since we know getUserById works, we'll use phone as temporary ID
                    // and fetch real ID in MyProfile later
                    console.log("Using phone as temporary identifier");
                    userId = phoneNumber; // Temporary fallback
                }

                // Step 3: Save data to localStorage immediately
                console.log("💾 Saving data to localStorage...");

                // Save userId (or phone as fallback)
                if (userId && !userId.startsWith("phone_")) {
                    localStorage.setItem("userId", userId);
                    console.log("✅ Saved userId:", userId);
                }

                // ✅ CRITICAL: Always save phone number
                localStorage.setItem("userPhone", phoneNumber);
                console.log("✅ Saved phone:", phoneNumber);

                // Save user name
                const userName = userData?.name || response.message?.includes("Registration") ? "User" : "User";
                localStorage.setItem("userName", userName);
                console.log("✅ Saved name:", userName);

                // Save token if available
                const token = response.token || userData?.token;
                if (token) {
                    localStorage.setItem("token", token);
                    console.log("✅ Saved token");
                }

                // Step 4: Create user object for context
                const user = {
                    _id: userId,
                    id: userId,
                    phone: phoneNumber,
                    name: userName,
                    isVerified: true,
                    latitude: undefined,
                    longitude: undefined,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                // Save complete user data
                localStorage.setItem("userData", JSON.stringify(user));
                console.log("✅ Saved complete userData");

                // Step 5: Login user through context
                console.log("🔐 Logging in user:", user);
                login(user);

                // Step 6: Show success screen
                setShowSuccess(true);

                console.log("🎉 Login complete! localStorage contents:");
                console.log("- userId:", localStorage.getItem("userId"));
                console.log("- userPhone:", localStorage.getItem("userPhone"));
                console.log("- userName:", localStorage.getItem("userName"));
                console.log("- token:", localStorage.getItem("token") ? "Present" : "Not present");

            } else {
                console.error("❌ OTP verification failed:", response.message);
                alert(response.message || "Invalid OTP. Please try again.");
            }
        } catch (error: any) {
            console.error("❌ OTP verify error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    // 🔁 Resend OTP
    const handleResend = async () => {
        try {
            setTimer(60);
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();

            const response = await resendOtp(phoneNumber);

            if (response.success) {
                console.log("📨 OTP resent successfully");
                alert("OTP sent successfully!");
            } else {
                alert(response.message || "Failed to resend OTP");
            }

            if (onResend) onResend();
        } catch (error) {
            console.error("Resend OTP error:", error);
            alert("Failed to resend OTP. Please try again.");
        }
    };

    // 🎤 Voice Input
    const handleVoiceInput = () => {
        if (!voiceService.isSpeechRecognitionSupported()) {
            setVoiceError("Voice recognition not supported. Use Chrome or Edge.");
            setTimeout(() => setVoiceError(null), 5000);
            return;
        }

        if (isListening) {
            voiceService.stopListening();
            setIsListening(false);
            return;
        }

        setIsListening(true);
        setVoiceError(null);

        voiceService.startListening(
            (result: VoiceRecognitionResult) => {
                const digits = extractDigits(result.transcript);

                if (digits.length > 0) {
                    const otpArray = digits.slice(0, 6).split("");
                    const filledOtp = [...otpArray, ...Array(6 - otpArray.length).fill("")];

                    setOtp(filledOtp);

                    const nextIndex = Math.min(otpArray.length, 5);
                    inputRefs.current[nextIndex]?.focus();

                    if (digits.length >= 6 && result.isFinal) {
                        voiceService.stopListening();
                        setIsListening(false);
                        setTimeout(() => handleVerifyOTP(digits.slice(0, 6)), 400);
                    }
                }
            },
            (error: string) => {
                setVoiceError(error);
                setIsListening(false);
                setTimeout(() => setVoiceError(null), 5000);
            }
        );
    };

    // ✅ Success screen continue
    const handleSuccessContinue = () => {
        console.log("🎉 Success continue clicked");

        if (onClose) onClose();
        if (onContinue) onContinue();

        console.log("🚀 Navigating to /role-selection");
        navigate("/role-selection", { replace: true });
    };

    // 🎉 Show Success Screen
    if (showSuccess) {
        return <SuccessScreen onContinue={handleSuccessContinue} />;
    }

    // 🔢 Show OTP Input Form
    return (
        <OTPInputForm
            phoneNumber={phoneNumber}
            otp={otp}
            setOtp={setOtp}
            timer={timer}
            isListening={isListening}
            voiceError={voiceError}
            isVerifying={isVerifying}
            inputRefs={inputRefs}
            onBack={onBack}
            onVerify={handleVerifyOTP}
            onResend={handleResend}
            onVoiceInput={handleVoiceInput}
        />
    );
};

export default OTPVerification;
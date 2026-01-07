import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VoiceService from "../../services/voiceService";
import { useAuth } from "../../context/AuthContext";
import OTPInputForm from "./OtpVerification/OTPInputForm";
import SuccessScreen from "./OtpVerification/SuccessScreen";
import UserModal from "../../modal/UserModal";
import { extractDigits } from "../../utils/OTPUtils";
import { verifyOtp, resendOtp, getUserById } from "../../services/api.service";

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
    userId?: string;
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
    const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
    const [userId, setUserId] = useState<string>("");

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const voiceService = VoiceService.getInstance();
    const navigate = useNavigate();
    const { login } = useAuth();

    // Timer countdown
    useEffect(() => {
        if (timer > 0 && !showSuccess && !showFirstTimeModal) {
            const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer, showSuccess, showFirstTimeModal]);

    // ✅ Check if user is first-time user
    const isFirstTimeUser = (message?: string) => {
        // Check if message contains "Registration completed"
        if (message?.toLowerCase().includes("registration")) {
            return true;
        }
        // Also check localStorage flag
        const firstTimeFlag = localStorage.getItem("isFirstTimeUser");
        return firstTimeFlag !== "false";
    };

    // ✅ Verify OTP with first-time user detection
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

                // Step 2: Extract userId
                const extractedUserId = response.userId || response.user?.id || response.user?._id || "";
                setUserId(extractedUserId);

                // Step 3: Save to localStorage
                if (extractedUserId) {
                    localStorage.setItem("userId", extractedUserId);
                    console.log("✅ Saved userId:", extractedUserId);
                }

                localStorage.setItem("userPhone", phoneNumber);
                console.log("✅ Saved phone:", phoneNumber);

                const token = response.token || response.user?.token;
                if (token) {
                    localStorage.setItem("token", token);
                    console.log("✅ Saved token");
                }

                // Step 4: Check if first-time user
                const isFirstTime = isFirstTimeUser(response.message);
                console.log("🆕 Is first time user:", isFirstTime);

                if (isFirstTime) {
                    // Show first-time user modal
                    console.log("📝 Showing first-time user modal");
                    setShowFirstTimeModal(true);
                } else {
                    // Existing user - fetch their name and proceed
                    console.log("👤 Existing user - fetching profile");
                    await handleExistingUser(extractedUserId);
                }
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

    // ✅ Handle existing user
    const handleExistingUser = async (userId: string) => {
        try {
            console.log("📡 Fetching user data for:", userId);

            const userResponse = await getUserById(userId);
            console.log("📥 User data response:", userResponse);

            if (userResponse.success && userResponse.data) {
                const userData = userResponse.data;
                const userName = userData.name || "User";

                // Save user data
                localStorage.setItem("userName", userName);
                localStorage.setItem("isFirstTimeUser", "false");
                localStorage.setItem("userData", JSON.stringify(userData));

                console.log("✅ Saved user data:", userName);

                // Login user
                const user = {
                    _id: userId,
                    id: userId,
                    phone: phoneNumber,
                    name: userName,
                    isVerified: true,
                    latitude: userData.latitude,
                    longitude: userData.longitude,
                    createdAt: userData.createdAt,
                    updatedAt: userData.updatedAt,
                };

                login(user);
                console.log("🔐 User logged in:", user);

                // Show success screen
                setShowSuccess(true);
            } else {
                // Fallback to User name
                localStorage.setItem("userName", "User");
                localStorage.setItem("isFirstTimeUser", "false");

                const user = {
                    _id: userId,
                    id: userId,
                    phone: phoneNumber,
                    name: "User",
                    isVerified: true,
                    latitude: undefined,
                    longitude: undefined,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                login(user);
                setShowSuccess(true);
            }
        } catch (error) {
            console.error("❌ Error fetching user data:", error);

            // Fallback
            localStorage.setItem("userName", "User");
            localStorage.setItem("isFirstTimeUser", "false");

            const user = {
                _id: userId,
                id: userId,
                phone: phoneNumber,
                name: "User",
                isVerified: true,
                latitude: undefined,
                longitude: undefined,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            login(user);
            setShowSuccess(true);
        }
    };

    // ✅ Handle first-time user name submission
    const handleFirstTimeComplete = async (userName: string) => {
        console.log("📝 First-time user completed with name:", userName);

        // Create user object
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

        // Login user
        login(user);

        // Close modal and show success
        setShowFirstTimeModal(false);
        setShowSuccess(true);
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

    // 📝 Show First-Time User Modal
    if (showFirstTimeModal) {
        return (
            <>
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
                <UserModal
                    phoneNumber={phoneNumber}
                    userId={userId}
                    onComplete={handleFirstTimeComplete}
                />
            </>
        );
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
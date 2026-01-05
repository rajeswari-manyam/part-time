import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VoiceService from "../../services/voiceService";
import { useAuth } from "../../context/AuthContext";
import OTPInputForm from "./OtpVerification/OTPInputForm";
import SuccessScreen from "./OtpVerification/SuccessScreen";
import { extractDigits } from "../../utils/OTPUtils";
import { verifyOtp, resendOtp } from "../../services/api.service";

// Voice recognition result interface
interface VoiceRecognitionResult {
    transcript: string;
    confidence: number;
    isFinal: boolean;
}

// Props for OTPVerification component
interface OTPVerificationProps {
    phoneNumber: string;
    onVerify?: (otp: string) => void;
    onResend?: () => void;
    onBack: () => void;
    onContinue?: () => void;
    onClose?: () => void;
}

// OTP verify response from API
interface OTPVerifyResponse {
    success: boolean;
    message?: string;
    user?: {
        id: string;
        phone: string;
        name: string;
        token?: string;
    };
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

    // ✅ Verify OTP
    const handleVerifyOTP = async (otpString: string) => {
        if (!otpString || otpString.length !== 6) return;

        try {
            setIsVerifying(true);

            const response: OTPVerifyResponse = await verifyOtp({
                phone: phoneNumber,
                otp: otpString,
            });

            if (response.success && response.user) {
                console.log("OTP verified successfully:", response.user);

                // Transform API user to match User interface
                const user = {
                    _id: response.user.id,       // _id expected by AuthContext
                    id: response.user.id,
                    phone: response.user.phone,
                    name: response.user.name,
                    isVerified: true,            // assume verified after OTP
                    latitude: undefined,
                    longitude: undefined,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                // Save token separately if provided
                if (response.user.token) localStorage.setItem("token", response.user.token);

                // ✅ Login user
                login(user);

                setShowSuccess(true);
            } else {
                alert(response.message || "OTP verification failed");
            }
        } catch (error) {
            console.error("OTP verify error:", error);
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
                console.log("OTP resent:", response.otp);
                alert("OTP resent successfully!");
            } else {
                alert(response.message || "Failed to resend OTP");
            }

            if (onResend) onResend();
        } catch (error) {
            console.error("Resend OTP error:", error);
            alert("Something went wrong while resending OTP");
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

                    // Auto-submit when 6 digits captured
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
        if (onClose) onClose();
        if (onContinue) onContinue();
        setTimeout(() => navigate("/role-selection", { replace: true }), 100);
    };

    // 🎉 Show Success Screen
    if (showSuccess) return <SuccessScreen onContinue={handleSuccessContinue} />;

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

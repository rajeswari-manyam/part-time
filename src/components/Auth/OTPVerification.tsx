import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VoiceService from "../../services/voiceService";
import { useAuth } from "../../context/AuthContext";
import OTPInputForm from "./OtpVerification/OTPInputForm";
import SuccessScreen from "./OtpVerification/SuccessScreen";
import { extractDigits } from "../../utils/OTPUtils";

interface VoiceRecognitionResult {
    transcript: string;
    confidence: number;
    isFinal: boolean;
}

interface OTPVerificationProps {
    phoneNumber: string;
    onVerify: (otp: string) => void;
    onResend: () => void;
    onBack: () => void;
    onContinue?: () => void;
    onClose?: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
    phoneNumber,
    onVerify,
    onResend,
    onBack,
    onContinue,
    onClose,
}) => {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(30);
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
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer, showSuccess]);

    const handleVerifyOTP = (otpString: string) => {
        setIsVerifying(true);
        setTimeout(() => {
            onVerify(otpString);
            setIsVerifying(false);
            setShowSuccess(true);
        }, 1000);
    };

    const handleResend = () => {
        setTimer(30);
        setOtp(["", "", "", "", "", ""]);
        onResend();
        inputRefs.current[0]?.focus();
    };

    const handleVoiceInput = () => {
        if (!voiceService.isSpeechRecognitionSupported()) {
            const errorMsg =
                "Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.";
            setVoiceError(errorMsg);
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
                    const newOtp = [...otpArray, ...Array(6 - otpArray.length).fill("")];
                    setOtp(newOtp);

                    const nextIndex = Math.min(otpArray.length, 5);
                    inputRefs.current[nextIndex]?.focus();

                    if (digits.length >= 6) {
                        voiceService.stopListening();
                        setIsListening(false);
                        setTimeout(() => {
                            handleVerifyOTP(digits.slice(0, 6));
                        }, 500);
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

    // 🔥 FIXED: Proper sequence for closing popup and navigating
    const handleSuccessContinue = () => {
        // Step 1: Set authentication state
        login();

        // Step 2: Close the popup FIRST
        if (onClose) {
            onClose();
        }

        // Step 3: Call parent's continue handler if provided
        if (onContinue) {
            onContinue();
        }

        // Step 4: Navigate to home (only if not already there)
        // Small delay to ensure popup state updates first
        setTimeout(() => {
            navigate("/Role-selection", { replace: true });
        }, 100);
    };

    if (showSuccess) {
        return <SuccessScreen onContinue={handleSuccessContinue} />;
    }

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
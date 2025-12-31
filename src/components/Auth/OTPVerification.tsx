import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VoiceService from "../../services/voiceService";
import { useAuth } from "../../context/AuthContext";
import OTPInputForm from "./OtpVerification/OTPInputForm";
import SuccessScreen from "./OtpVerification/SuccessScreen";
import { extractDigits } from "../../utils/OTPUtils";
import { verifyOtp } from "../../services/api.service";
import { resendOtp } from "../../services/api.service"; // <-- import the new API


interface VoiceRecognitionResult {
    transcript: string;
    confidence: number;
    isFinal: boolean;
}

interface OTPVerificationProps {
    phoneNumber: string;
    onVerify?: (otp: string) => void;
    onResend: () => void;
    onBack: () => void;
    onContinue?: () => void;
    onClose?: () => void;
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

    // ⏱ Timer
    useEffect(() => {
        if (timer > 0 && !showSuccess) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer, showSuccess]);

    // ✅ VERIFY OTP
    const handleVerifyOTP = async (otpString: string) => {
        try {
            setIsVerifying(true);

            const response = await verifyOtp(phoneNumber, otpString);

            if (response.success) {
                console.log("OTP verified successfully");

                // ✅ Login user
                login(response.user);


                // ✅ Show success screen
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


    // 🔁 RESEND OTP
    const handleResend = async () => {
        try {
            setTimer(60);
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();

            const response = await resendOtp(phoneNumber);

            if (response.success) {
                console.log("OTP resent:", response.otp);
                alert("OTP resent successfully");
            } else {
                alert(response.message || "Failed to resend OTP");
            }

            // Optional: call parent callback
            if (onResend) onResend();
        } catch (error) {
            console.error("Resend OTP error:", error);
            alert("Something went wrong while resending OTP");
        }
    };

    // 🎤 VOICE INPUT
    const handleVoiceInput = () => {
        if (!voiceService.isSpeechRecognitionSupported()) {
            setVoiceError(
                "Voice recognition not supported. Use Chrome or Edge."
            );
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
                    const filledOtp = [
                        ...otpArray,
                        ...Array(6 - otpArray.length).fill("")
                    ];

                    setOtp(filledOtp);

                    const nextIndex = Math.min(otpArray.length, 5);
                    inputRefs.current[nextIndex]?.focus();

                    if (digits.length >= 6) {
                        voiceService.stopListening();
                        setIsListening(false);
                        setTimeout(() => {
                            handleVerifyOTP(digits.slice(0, 6));
                        }, 400);
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

    // ✅ SUCCESS → ROLE SELECTION
    const handleSuccessContinue = () => {
        if (onClose) onClose();
        if (onContinue) onContinue();

        setTimeout(() => {
            navigate("/role-selection", { replace: true });
        }, 100);
    };

    // 🎉 SUCCESS SCREEN
    if (showSuccess) {
        return <SuccessScreen onContinue={handleSuccessContinue} />;
    }

    // 🔢 OTP INPUT FORM
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

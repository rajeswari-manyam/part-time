import React, { useState, useRef, useEffect } from "react";
import VoiceService from "../../services/voiceService";
import Button from "../ui/Buttons";
import typography from "../../styles/typography";
import voiceIcon from "../../assets/icons/Voice.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Define the interface here since it's needed
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
    onContinue?: () => void; // Optional callback for continue button on success screen
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
    phoneNumber,
    onVerify,
    onResend,
    onBack,
    onContinue,
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

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = pastedData.split("");
        setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);

        const lastIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join("");
        if (otpString.length === 6) {
            setIsVerifying(true);

            // Simulate verification delay
            setTimeout(() => {
                onVerify(otpString);
                setIsVerifying(false);
                setShowSuccess(true);
            }, 1000);
        }
    };

    const handleResend = () => {
        setTimer(30);
        setOtp(["", "", "", "", "", ""]);
        onResend();
        inputRefs.current[0]?.focus();
    };

    const handleReadAloud = () => {
        const otpString = otp.join("");
        if (otpString && otpString.replace(/\s/g, "")) {
            const speech = new SpeechSynthesisUtterance(otpString.split("").join(" "));
            speech.rate = 0.8;
            window.speechSynthesis.speak(speech);
        }
    };

    const extractDigits = (text: string): string => {
        const numberWords: Record<string, string> = {
            zero: "0", one: "1", two: "2", three: "3", four: "4",
            five: "5", six: "6", seven: "7", eight: "8", nine: "9",
            oh: "0"
        };

        let processed = text.toLowerCase();
        Object.keys(numberWords).forEach(word => {
            processed = processed.replace(new RegExp(word, "g"), numberWords[word]);
        });

        return processed.replace(/\D/g, "");
    };

    const handleVoiceInput = () => {
        console.log("Voice input clicked for OTP");

        if (!voiceService.isSpeechRecognitionSupported()) {
            const errorMsg = "Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.";
            setVoiceError(errorMsg);
            setTimeout(() => setVoiceError(null), 5000);
            return;
        }

        if (isListening) {
            console.log("Stopping voice input");
            voiceService.stopListening();
            setIsListening(false);
            return;
        }

        console.log("Starting voice input for OTP");
        setIsListening(true);
        setVoiceError(null);

        voiceService.startListening(
            (result: VoiceRecognitionResult) => {
                console.log("OTP Voice result:", result.transcript);

                const digits = extractDigits(result.transcript);
                console.log("Extracted OTP digits:", digits);

                if (digits.length > 0) {
                    const otpArray = digits.slice(0, 6).split("");
                    const newOtp = [...otpArray, ...Array(6 - otpArray.length).fill("")];
                    setOtp(newOtp);

                    const nextIndex = Math.min(otpArray.length, 5);
                    inputRefs.current[nextIndex]?.focus();

                    // Auto-submit if we have 6 digits
                    if (digits.length >= 6) {
                        console.log("Complete OTP received via voice, auto-submitting");
                        voiceService.stopListening();
                        setIsListening(false);

                        setTimeout(() => {
                            setIsVerifying(true);
                            const completeOtp = digits.slice(0, 6);

                            setTimeout(() => {
                                onVerify(completeOtp);
                                setIsVerifying(false);
                                setShowSuccess(true);
                            }, 1000);
                        }, 500);
                    }
                }
            },
            (error: string) => {
                console.error("OTP Voice error:", error);
                setVoiceError(error);
                setIsListening(false);
                setTimeout(() => setVoiceError(null), 5000);
            }
        );
    };
    const handleSuccessContinue = () => {
        login();               // ✅ mark auth success
        navigate("/role-selection"); // ✅ go to role selection
    };



    const isOtpComplete = otp.every((digit) => digit !== "");

    // Success Screen
    if (showSuccess) {
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
                        onClick={handleSuccessContinue}
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
    }

    // OTP Verification Screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 relative">
                {/* Back Arrow Button */}
                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 text-gray-700 hover:text-gray-900 transition-colors"
                    aria-label="Go back"
                    disabled={isVerifying}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Header */}
                <div className="text-center space-y-2 mb-8 mt-4">
                    <h2 className={`text-gray-900 font-bold ${typography.heading.h3}`}>
                        Verify OTP
                    </h2>
                    <p className={`text-gray-600 ${typography.body.small}`}>
                        Enter the 6-digit code sent to
                    </p>
                    <p className={`text-gray-900 font-semibold ${typography.body.base}`}>
                        +91 {phoneNumber}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* OTP Input - 6 separate boxes in one line */}
                    <div className="flex justify-center gap-3 py-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                disabled={isVerifying}
                                className={`w-14 h-16 text-center text-3xl font-bold bg-white border-b-2 transition-colors ${digit
                                    ? "text-gray-900 border-blue-600"
                                    : "text-gray-400 border-gray-300"
                                    } focus:outline-none focus:border-blue-600 focus:text-gray-900 ${isVerifying ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    {/* Voice Error Message */}
                    {voiceError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm text-center">
                            {voiceError}
                        </div>
                    )}

                    {/* Voice Input Button */}
                    <button
                        type="button"
                        onClick={handleVoiceInput}
                        disabled={isVerifying}
                        className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${isListening
                            ? "bg-red-600 hover:bg-red-700 animate-pulse"
                            : "bg-gradient-to-r from-[#0B0E92] to-[#69A6F0] hover:brightness-110"
                            } ${isVerifying ? "opacity-50 cursor-not-allowed" : ""} ${typography.body.base}`}
                    >
                        {isListening ? (
                            <>
                                <div className="w-5 h-5 bg-white rounded-sm" />
                                Stop Listening
                            </>
                        ) : (
                            <>
                                <img
                                    src={voiceIcon}
                                    alt="Voice Input"
                                    className="w-5 h-5"
                                />
                                Voice Input
                            </>
                        )}

                    </button>

                    {/* Read OTP Aloud Button */}
                    <Button
                        type="button"
                        onClick={handleReadAloud}
                        variant="primary"
                        size="lg"
                        fullWidth
                        disabled={!otp.some(digit => digit !== "") || isVerifying}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="inline mr-2"
                        >
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                        Read OTP Aloud
                    </Button>

                    {/* Verify Button */}
                    <Button
                        type="submit"
                        disabled={!isOtpComplete || isVerifying}
                        variant="primary"
                        size="lg"
                        fullWidth
                        className={(!isOtpComplete || isVerifying) ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        {isVerifying ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Verifying...
                            </span>
                        ) : (
                            "Verify & Continue"
                        )}
                    </Button>

                    {/* Resend Section */}
                    <div className="text-center space-y-3">
                        <p className={`text-gray-600 ${typography.body.small}`}>
                            Didn't receive code?
                        </p>

                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={timer > 0 || isVerifying}
                            className={`w-full py-3 rounded-xl font-semibold transition-all border-2 ${timer > 0 || isVerifying
                                ? "border-gray-300 text-gray-400 cursor-not-allowed bg-white"
                                : "border-blue-600 text-blue-600 hover:bg-blue-50 bg-white"
                                } ${typography.body.base}`}
                        >
                            Resend OTP
                        </button>

                        {timer > 0 && (
                            <p className={`text-green-600 flex items-center justify-center gap-1 ${typography.body.small}`}>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 6v6l4 2" />
                                </svg>
                                Resend available in {timer}s
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OTPVerification;
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
        name?: string;
        token?: string;
    };
    token?: string;
    data?: any;
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

    useEffect(() => {
        if (timer > 0 && !showSuccess && !showFirstTimeModal) {
            const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer, showSuccess, showFirstTimeModal]);

    // ✅ Validate if string is a valid MongoDB ObjectId
    const isValidMongoId = (id: string): boolean => {
        const mongoIdRegex = /^[a-f\d]{24}$/i;
        return mongoIdRegex.test(id);
    };

    // ✅ NEW: Check if this phone number has logged in before
    const hasLoggedInBefore = (phone: string): boolean => {
        const loggedInPhones = localStorage.getItem("loggedInPhones");
        if (!loggedInPhones) return false;

        try {
            const phones = JSON.parse(loggedInPhones);
            const hasLoggedIn = phones.includes(phone);
            console.log(`📱 Phone ${phone} has logged in before:`, hasLoggedIn);
            return hasLoggedIn;
        } catch {
            return false;
        }
    };

    // ✅ NEW: Mark this phone number as logged in
    const markPhoneAsLoggedIn = (phone: string) => {
        const loggedInPhones = localStorage.getItem("loggedInPhones");
        let phones: string[] = [];

        try {
            phones = loggedInPhones ? JSON.parse(loggedInPhones) : [];
        } catch {
            phones = [];
        }

        if (!phones.includes(phone)) {
            phones.push(phone);
            localStorage.setItem("loggedInPhones", JSON.stringify(phones));
            console.log(`✅ Marked phone ${phone} as logged in before`);
        }
    };

    // ✅ Extract and validate userId
    const extractUserId = (response: OTPVerifyResponse): string => {
        console.log("🔍 === EXTRACTING USER ID ===");
        console.log("Full API Response:", JSON.stringify(response, null, 2));

        const possibleUserIds = [
            { source: "response.userId", value: response.userId },
            { source: "response.user?.id", value: response.user?.id },
            { source: "response.user?._id", value: response.user?._id },
            { source: "response.data?.userId", value: response.data?.userId },
            { source: "response.data?.user?.id", value: response.data?.user?.id },
            { source: "response.data?.user?._id", value: response.data?.user?._id },
            { source: "response.data?.id", value: response.data?.id },
            { source: "response.data?._id", value: response.data?._id },
        ];

        console.log("🔍 Checking all possible userId locations:");
        for (const { source, value } of possibleUserIds) {
            console.log(`  - ${source}: ${value || "undefined"}`);

            if (value && typeof value === 'string') {
                if (value === phoneNumber) {
                    console.warn(`  ⚠️ ${source} contains phone number, skipping...`);
                    continue;
                }

                if (isValidMongoId(value)) {
                    console.log(`  ✅ Found valid MongoDB ObjectId: ${value}`);
                    return value;
                }

                if (value.length > 10) {
                    console.log(`  ⚠️ Found ID but not valid MongoDB format: ${value}`);
                    return value;
                }
            }
        }

        console.error("❌ === NO VALID USER ID FOUND ===");
        console.error("Response structure:", response);
        return "";
    };

    // ✅ Verify OTP and decide flow
    const handleVerifyOTP = async (otpString: string) => {
        if (!otpString || otpString.length !== 6) {
            console.log("Invalid OTP length:", otpString.length);
            return;
        }

        try {
            setIsVerifying(true);
            console.log("🔐 === OTP VERIFICATION START ===");
            console.log("Phone:", phoneNumber);
            console.log("OTP:", otpString);

            // ✅ ACTUAL API CALL
            const response: OTPVerifyResponse = await verifyOtp({
                phone: phoneNumber,
                otp: otpString,
            });

            console.log("📥 === OTP VERIFICATION RESPONSE ===");
            console.log(JSON.stringify(response, null, 2));

            if (response.success) {
                console.log("✅ OTP verified successfully!");

                // Extract userId
                const extractedUserId = extractUserId(response);

                if (!extractedUserId) {
                    console.error("❌ CRITICAL ERROR: No userId found!");
                    alert("Authentication error: Could not retrieve user ID. Please contact support.");
                    return;
                }

                if (extractedUserId === phoneNumber) {
                    console.error("❌ CRITICAL ERROR: UserId is same as phone number!");
                    alert("Authentication error: Invalid user data received. Please try again or contact support.");
                    return;
                }

                if (!isValidMongoId(extractedUserId)) {
                    console.warn("⚠️ WARNING: UserId doesn't match MongoDB ObjectId format:", extractedUserId);
                }

                console.log("✅ === USER ID VALIDATED ===");
                console.log("UserId:", extractedUserId);
                console.log("Length:", extractedUserId.length);
                console.log("Is MongoDB format:", isValidMongoId(extractedUserId));

                setUserId(extractedUserId);

                // Clear and store new data
                localStorage.removeItem("userId");
                localStorage.removeItem("userData");
                localStorage.setItem("userId", extractedUserId);
                localStorage.setItem("userPhone", phoneNumber);

                console.log("💾 === STORED IN LOCALSTORAGE ===");
                console.log("userId:", extractedUserId);
                console.log("userPhone:", phoneNumber);

                const token = response.token || response.user?.token || response.data?.token;
                if (token) {
                    localStorage.setItem("token", token);
                    console.log("✅ Token saved");
                }

                // Verify storage
                const storedUserId = localStorage.getItem("userId");
                const storedPhone = localStorage.getItem("userPhone");
                console.log("🔍 === VERIFICATION: WHAT'S IN LOCALSTORAGE ===");
                console.log("Stored userId:", storedUserId);
                console.log("Stored phone:", storedPhone);
                console.log("Match check - userId !== phone:", storedUserId !== storedPhone);

                if (storedUserId === storedPhone) {
                    console.error("❌ STORAGE ERROR: userId and phone are the same!");
                    alert("Storage error occurred. Please try logging in again.");
                    return;
                }

                // ✅ CHECK IF THIS IS A FIRST-TIME LOGIN FOR THIS PHONE NUMBER
                await checkUserProfileAndProceed(extractedUserId);

            } else {
                console.error("❌ OTP verification failed:", response.message);
                alert(response.message || "Invalid OTP. Please try again.");
            }
        } catch (error: any) {
            console.error("❌ === OTP VERIFICATION ERROR ===");
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    // ✅ UPDATED: Check user profile and decide whether to show modal
    const checkUserProfileAndProceed = async (userId: string) => {
        try {
            // ✅ CHECK IF THIS PHONE HAS LOGGED IN BEFORE
            const isFirstTimeForThisPhone = !hasLoggedInBefore(phoneNumber);

            console.log("🆕 === FIRST LOGIN CHECK ===");
            console.log("Phone:", phoneNumber);
            console.log("Is first time for this phone?", isFirstTimeForThisPhone);

            if (isFirstTimeForThisPhone) {
                // 🎉 FIRST TIME USER - SHOW MODAL
                console.log("📝 === FIRST TIME USER - SHOWING MODAL ===");
                setShowFirstTimeModal(true);
            } else {
                // 👤 RETURNING USER - SKIP MODAL
                console.log("👤 === RETURNING USER - SKIPPING MODAL ===");
                console.log("Fetching user profile to proceed...");

                const userResponse = await getUserById(userId);
                console.log("📥 User data response:", userResponse);

                if (userResponse.success && userResponse.data) {
                    const userData = userResponse.data;

                    // Save existing user data
                    localStorage.setItem("userName", userData.name || "User");
                    localStorage.setItem("isFirstTimeUser", "false");
                    localStorage.setItem("userData", JSON.stringify(userData));

                    const user = {
                        _id: userId,
                        id: userId,
                        phone: phoneNumber,
                        name: userData.name,
                        isVerified: true,
                        latitude: userData.latitude,
                        longitude: userData.longitude,
                        createdAt: userData.createdAt,
                        updatedAt: userData.updatedAt,
                    };

                    login(user);
                    console.log("🔐 User logged in (returning user)");
                } else {
                    // Fallback if API fails
                    console.log("⚠️ Could not fetch user data, using minimal data");

                    const user = {
                        _id: userId,
                        id: userId,
                        phone: phoneNumber,
                        name: "User",
                        isVerified: true,
                    };

                    localStorage.setItem("isFirstTimeUser", "false");
                    login(user);
                }

                setShowSuccess(true);
            }
        } catch (error) {
            console.error("❌ Error checking user profile:", error);
            // On error, show modal to be safe
            console.log("⚠️ Error occurred, showing modal to be safe");
            setShowFirstTimeModal(true);
        }
    };

    // ✅ UPDATED: Handle first-time user completing profile
    const handleFirstTimeComplete = async (userName: string) => {
        console.log("📝 === NAME SETUP COMPLETE ===");
        console.log("Name:", userName);
        console.log("UserId:", userId);
        console.log("Phone:", phoneNumber);

        // ✅ CRITICAL: MARK THIS PHONE AS HAVING LOGGED IN BEFORE
        markPhoneAsLoggedIn(phoneNumber);

        console.log("✅ Phone marked as logged in:", phoneNumber);
        console.log("📋 Current logged in phones:", localStorage.getItem("loggedInPhones"));

        // Fetch updated user data
        try {
            const userResponse = await getUserById(userId);

            if (userResponse.success && userResponse.data) {
                const userData = userResponse.data;

                localStorage.setItem("userName", userName);
                localStorage.setItem("isFirstTimeUser", "false");
                localStorage.setItem("userData", JSON.stringify(userData));

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
                console.log("🔐 User logged in with new name");
            } else {
                // Fallback
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

                localStorage.setItem("userName", userName);
                localStorage.setItem("isFirstTimeUser", "false");
                localStorage.setItem("userData", JSON.stringify(user));
                login(user);
            }
        } catch (error) {
            console.error("Error fetching updated user data:", error);

            // Fallback
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

            localStorage.setItem("userName", userName);
            localStorage.setItem("isFirstTimeUser", "false");
            localStorage.setItem("userData", JSON.stringify(user));
            login(user);
        }

        setShowFirstTimeModal(false);
        setShowSuccess(true);
    };

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

    const handleSuccessContinue = () => {
        console.log("🎉 Proceeding to role selection");

        if (onClose) onClose();
        if (onContinue) onContinue();

        navigate("/role-selection", { replace: true });
    };

    if (showSuccess) {
        return <SuccessScreen onContinue={handleSuccessContinue} />;
    }

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
import React, { useEffect, useState } from "react";
import Button from "../components/ui/Buttons";
import typography from "../styles/typography";
import VoiceService from "../services/voiceService";
import { VoiceRecognitionResult } from "../types/search.types";
import VoiceIcon from "../assets/icons/Voice.png";

type VoiceField = "all" | "fullName" | "email" | "bio" | null;

const WorkerProfileScreen: React.FC = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [isListening, setIsListening] = useState<VoiceField>(null);
    const [voiceError, setVoiceError] = useState<string | null>(null);

    const [voiceService] = useState(() => VoiceService.getInstance());
    const [isVoiceSupported, setIsVoiceSupported] = useState(true);

    useEffect(() => {
        setIsVoiceSupported(voiceService.isSpeechRecognitionSupported());
    }, [voiceService]);

    const handleVoiceResult = (field: VoiceField) => (result: VoiceRecognitionResult) => {
        if (!result.isFinal) return;

        switch (field) {
            case "fullName":
                setFullName(result.transcript);
                break;
            case "email":
                setEmail(result.transcript.replace(/\s/g, ""));
                break;
            case "bio":
                setBio(prev => `${prev} ${result.transcript}`.trim());
                break;
            case "all":
                setBio(result.transcript);
                break;
        }

        stopListening();
    };

    const handleVoiceError = (message: string) => {
        setVoiceError(message);
        stopListening();
        setTimeout(() => setVoiceError(null), 3000);
    };

    const startListening = (field: VoiceField) => {
        if (!isVoiceSupported) {
            setVoiceError("Voice recognition is not supported in your browser");
            return;
        }

        setIsListening(field);
        voiceService.startListening(
            handleVoiceResult(field),
            handleVoiceError
        );
    };

    const stopListening = () => {
        voiceService.stopListening();
        setIsListening(null);
    };

    const handleSubmit = () => {
        const profileData = { fullName, email, bio };
        console.log("Profile Data:", profileData);
        alert("Profile saved successfully!");
    };

    const isFormValid = fullName.trim() !== "";

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl p-4">
                    <h2 className={`${typography.heading.h3} text-gray-800 mb-6`}>
                        Create Your Profile
                    </h2>

                    {/* Voice All */}
                    <Button
                        onClick={() => startListening("all")}
                        disabled={!isVoiceSupported}
                        variant="gradient-blue"
                        size="lg"
                        className={`w-full mb-6 flex items-center justify-center gap-3 ${isListening === "all" ? "animate-pulse" : ""}`}
                    >
                        <img src={VoiceIcon} className="w-5 h-5" />
                        Fill profile using voice
                    </Button>

                    {voiceError && (
                        <p className={`${typography.form.error} mb-4`}>
                            {voiceError}
                        </p>
                    )}

                    {/* Full Name */}
                    <div className="mb-6">
                        <label className={typography.form.label}>Full Name</label>
                        <div className="flex gap-2">
                            <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="flex-1 px-4 py-3 border-2 rounded-xl"
                                placeholder="Your full name"
                            />
                            <Button
                                variant="primary"
                                onClick={() => startListening("fullName")}
                                className={isListening === "fullName" ? "animate-pulse" : ""}
                            >
                                <img src={VoiceIcon} className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-6">
                        <label className={typography.form.label}>Email (Optional)</label>
                        <div className="flex gap-2">
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-4 py-3 border-2 rounded-xl"
                                placeholder="your@email.com"
                            />
                            <Button
                                variant="primary"
                                onClick={() => startListening("email")}
                                className={isListening === "email" ? "animate-pulse" : ""}
                            >
                                <img src={VoiceIcon} className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="mb-8">
                        <label className={typography.form.label}>Bio / Experience</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={5}
                            className="w-full px-4 py-3 border-2 rounded-xl resize-none"
                            placeholder="Tell us about your skills..."
                        />
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => startListening("bio")}
                            className={`mt-3 flex gap-2 ${isListening === "bio" ? "animate-pulse" : ""}`}
                        >
                            <img src={VoiceIcon} className="w-4 h-4" />
                            Speak Bio
                        </Button>
                    </div>

                    {/* Submit */}
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        size="xl"
                        fullWidth
                        className="
        rounded-2xl 
        bg-gradient-to-r from-[#0B0E92] to-[#69A6F0]
        text-white 
        hover:opacity-90 
        hover:scale-105
        transition-all
    "
                    >
                        Save & Continue
                    </Button>

                </div>
            </div>
        </div>
    );
};

export default WorkerProfileScreen;

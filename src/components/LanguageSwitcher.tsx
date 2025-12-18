import React from "react";
import { useLanguage } from "../context/LanguageContext";

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex gap-2">
            {["en", "hi", "ta", "te"].map((lang) => (
                <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 rounded ${
                        language === lang ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;

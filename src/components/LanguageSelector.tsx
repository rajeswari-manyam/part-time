import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const LanguageSelector = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: "en", name: "English", native: "English" },
        { code: "hi", name: "Hindi", native: "हिंदी" },
        { code: "ta", name: "Tamil", native: "தமிழ்" },
        { code: "te", name: "Telugu", native: "తెలుగు" },
        { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
        { code: "ml", name: "Malayalam", native: "മലയാളം" },
        { code: "bn", name: "Bengali", native: "বাংলা" },
        { code: "mr", name: "Marathi", native: "मराठी" },
        { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
        { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
        { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
        { code: "as", name: "Assamese", native: "অসমীয়া" },
        { code: "ur", name: "Urdu", native: "اردو" },
    ];

    const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

    const handleLanguageChange = (langCode: string) => {
        setLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-white border border-gray-300 rounded-lg md:rounded-xl hover:shadow-md transition-all duration-200"
            >
                <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="text-sm md:text-base font-medium text-gray-700 hidden sm:inline">
                    {currentLanguage.native}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 md:w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 max-h-96 overflow-y-auto">
                        <div className="py-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors flex items-center justify-between ${language === lang.code ? "bg-blue-50 text-blue-700" : "text-gray-700"
                                        }`}
                                >
                                    <span className="flex flex-col">
                                        <span className="font-medium text-sm">{lang.native}</span>
                                        <span className="text-xs text-gray-500">{lang.name}</span>
                                    </span>
                                    {language === lang.code && (
                                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LanguageSelector;
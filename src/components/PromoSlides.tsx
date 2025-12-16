import React from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "./ui/Carousel";
import { fontSize, fontWeight, responsiveFontSize } from "../styles/typography";

interface PromoSlide {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    gradient: string;
    textColor: string;
    path: string;
}

interface PromoSlidesProps {
    className?: string;
}

const PromoSlides: React.FC<PromoSlidesProps> = ({ className = "" }) => {
    const navigate = useNavigate();

    const slides: PromoSlide[] = [
        {
            id: "1",
            title: "💼 Find Part-Time Jobs",
            subtitle: "Flexible Opportunities Await",
            description: "Discover thousands of part-time positions perfect for students, professionals, and anyone seeking flexible work.",
            buttonText: "Browse Jobs",
            gradient: "from-purple-600 via-pink-600 to-red-600",
            textColor: "text-white",
            path: "/jobs",
        },
        {
            id: "2",
            title: "🏠 Work From Home",
            subtitle: "Remote Opportunities",
            description: "Find remote part-time jobs that let you work from anywhere. Perfect for work-life balance.",
            buttonText: "View Remote Jobs",
            gradient: "from-blue-600 via-indigo-600 to-purple-600",
            textColor: "text-white",
            path: "/remote-jobs",
        },
        {
            id: "3",
            title: "🎓 Student-Friendly Jobs",
            subtitle: "Earn While You Learn",
            description: "Part-time positions designed around your class schedule. Gain experience and earn money simultaneously.",
            buttonText: "Student Jobs",
            gradient: "from-green-600 via-teal-600 to-cyan-600",
            textColor: "text-white",
            path: "/student-jobs",
        },
        {
            id: "4",
            title: "⏰ Flexible Hours",
            subtitle: "Work On Your Schedule",
            description: "Choose jobs with evening, weekend, or flexible shifts. Perfect for those with other commitments.",
            buttonText: "Find Flexible Jobs",
            gradient: "from-orange-600 via-red-600 to-pink-600",
            textColor: "text-white",
            path: "/flexible-jobs",
        },
        {
            id: "5",
            title: "💰 High-Paying Gigs",
            subtitle: "Maximize Your Earnings",
            description: "Discover part-time positions with competitive pay. Earn more in less time with premium opportunities.",
            buttonText: "View High-Paying Jobs",
            gradient: "from-yellow-600 via-orange-600 to-red-600",
            textColor: "text-white",
            path: "/high-paying-jobs",
        },
    ];

    return (
        <div className={`w-full ${className}`}>
            <Carousel
                autoplay={true}
                autoplayDelay={4000}
                showDots={true}
                showArrows={true}
                className="h-80 rounded-xl shadow-lg"
            >
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className={`relative h-80 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r ${slide.gradient}`}
                    >
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]" />
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:60px_60px]" />
                        </div>

                        <div className="relative z-10 text-center px-4 md:px-8 max-w-3xl">
                            <div className="space-y-3 md:space-y-4">
                                {/* Title - Using typography */}
                                <h1 className={`${responsiveFontSize["3xl"]} ${fontWeight.bold} ${slide.textColor} tracking-wide drop-shadow-lg`}>
                                    {slide.title}
                                </h1>

                                {/* Subtitle - Using typography */}
                                <h2 className={`${responsiveFontSize.xl} ${fontWeight.semibold} ${slide.textColor} tracking-wide drop-shadow-md`}>
                                    {slide.subtitle}
                                </h2>

                                {/* Description - Using typography */}
                                <p className={`${responsiveFontSize.sm} ${slide.textColor} max-w-2xl mx-auto drop-shadow-md`}>
                                    {slide.description}
                                </p>

                                {/* Button - Using typography */}
                                <button
                                    onClick={() => navigate(slide.path)}
                                    className={`mt-4 md:mt-6 bg-white text-gray-800 px-6 md:px-8 py-2.5 md:py-3 rounded-full ${fontWeight.bold} ${responsiveFontSize.base} hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105`}
                                >
                                    {slide.buttonText} →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default PromoSlides;
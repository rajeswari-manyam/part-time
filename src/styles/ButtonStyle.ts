// File location: src/styles/buttonStyles.ts

import { colors } from './colors';

export const buttonStyles = {
    // Base styles
    base: "rounded font-medium transition inline-block text-center cursor-pointer",

    // Size styles
    sizes: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        xl: "px-8 py-4 text-xl",
    },

    // Variant styles
    variants: {
        primary: `bg-[${colors.primary.main}] text-white hover:brightness-110`,
        secondary: `bg-[${colors.secondary.main}] text-gray-700 hover:bg-gray-200`,
        success: "bg-green-500 text-white hover:brightness-110",
        "gradient-orange": "bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:brightness-110",
        "gradient-blue": `bg-[${colors.primary.main}] text-white hover:brightness-110`,
        outline: `border-2 border-[${colors.primary.main}] text-[${colors.primary.main}] hover:bg-[${colors.secondary.main}]`,
        danger: "bg-red-600 text-white hover:bg-red-700",
    },

    // Search specific buttons
    search: {
        voice: {
            default:
                `px-4 py-2 mx-2 rounded-lg bg-[${colors.secondary.main}] text-gray-600 hover:bg-gray-200 transition-all duration-200`,
            listening:
                "px-4 py-2 mx-2 rounded-lg bg-red-500 text-white animate-pulse transition-all duration-200",
        },
        submit:
            `px-8 py-4 bg-[${colors.primary.main}] text-white font-bold text-base rounded-r-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`,
        clear: "px-3 text-gray-400 hover:text-gray-600 transition-colors duration-200",
    },

    // States
    states: {
        disabled: "opacity-50 cursor-not-allowed",
        loading: "opacity-75 cursor-wait",
    },

    // Width options
    width: {
        auto: "",
        full: "w-full",
    },
};

export default buttonStyles;

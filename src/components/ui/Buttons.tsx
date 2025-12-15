import React from "react";
import { Link } from "react-router-dom";
import buttonStyles from "../../styles/ButtonStyle";

type ButtonVariant = "primary" | "secondary" | "success" | "gradient-orange" | "gradient-blue" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    to?: string; // For Link component
    href?: string; // For external links
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    size = "md",
    to,
    href,
    onClick,
    type = "button",
    disabled = false,
    fullWidth = false,
    className = "",
}) => {
    // Combine all styles using buttonStyles configuration
    const combinedStyles = `
        ${buttonStyles.base} 
        ${buttonStyles.sizes[size]} 
        ${buttonStyles.variants[variant]} 
        ${disabled ? buttonStyles.states.disabled : ""} 
        ${fullWidth ? buttonStyles.width.full : buttonStyles.width.auto} 
        ${className}
    `.trim().replace(/\s+/g, ' ');

    // If it's a Link (internal navigation)
    if (to && !disabled) {
        return (
            <Link to={to} className={combinedStyles}>
                {children}
            </Link>
        );
    }

    // If it's an external link
    if (href && !disabled) {
        return (
            <a href={href} className={combinedStyles} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    }

    // Regular button
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={combinedStyles}
        >
            {children}
        </button>
    );
};

export default Button;
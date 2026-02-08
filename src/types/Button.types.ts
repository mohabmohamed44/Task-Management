import { type ButtonHTMLAttributes , type ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    // Button Sizes
    size?: "default" | "lg" | "sm" | "icon";
    
    // Loading State
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}
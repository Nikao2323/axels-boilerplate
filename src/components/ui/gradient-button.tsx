"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GradientButtonProps {
  href: string;
  children: ReactNode;
  size?: "default" | "large";
  variant?: "primary" | "dark";
  className?: string;
}

export function GradientButton({
  href,
  children,
  size = "default",
  variant = "primary",
  className = "",
}: GradientButtonProps) {
  const sizeClasses =
    size === "large"
      ? "px-10 py-5 md:px-16 md:py-7 rounded-[20px]"
      : "px-6 py-3 sm:px-10 sm:py-4 rounded-xl";

  const styles =
    variant === "dark"
      ? {
          background:
            "radial-gradient(80% 150% at 50% -20%, #3a3a3a 0%, #222222 100%)",
          boxShadow:
            "rgba(0, 0, 0, 0.4) 0px 4px 16px 0px, rgba(0, 0, 0, 0.2) 0px 2px 4px 0px, rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset",
        }
      : {
          background:
            "radial-gradient(80% 150% at 50% -20%, #818cf8 0%, #6366f1 100%)",
          boxShadow:
            "rgba(99, 102, 241, 0.3) 0px 4px 16px 0px, rgba(0, 0, 0, 0.15) 0px 2px 4px 0px, rgba(255, 255, 255, 0.25) 0px 1px 1px 0px inset",
        };

  return (
    <motion.div
      className={`relative overflow-hidden ${sizeClasses} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      style={styles}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            variant === "dark"
              ? "radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.12) 0%, transparent 50%)"
              : "radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.25) 0%, transparent 50%)",
        }}
      />
      <Link
        href={href}
        className="relative z-10 block text-center whitespace-nowrap"
      >
        {children}
      </Link>
    </motion.div>
  );
}

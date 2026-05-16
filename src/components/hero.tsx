"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { GradientButton } from "@/components/ui/gradient-button";

export function Hero() {
  return (
    <motion.section
      className="mx-auto flex max-w-5xl flex-col items-center px-4 pt-24 pb-12 sm:pt-40 sm:pb-16"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Badge */}
      <motion.div
        className="mb-6 flex shrink-0 items-center gap-2 rounded-full px-3 py-2 whitespace-nowrap sm:mb-8 sm:px-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.7)",
        }}
        variants={staggerItem}
      >
        <span
          className="text-xs font-semibold sm:text-sm"
          style={{
            fontFamily: "var(--font-datatype)",
            color: "rgba(0, 0, 0, 0.8)",
          }}
        >
          For [your target audience]
        </span>
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        className="mb-4 text-center text-4xl sm:mb-6 sm:text-7xl md:text-[84px]"
        style={{
          fontFamily: "var(--font-bitcount-single)",
          fontWeight: 800,
          letterSpacing: "-2px",
          color: "rgb(15, 23, 42)",
          lineHeight: "1.1em",
        }}
        variants={staggerItem}
      >
        Your big headline.
        <br />
        Your value prop.
      </motion.h1>

      {/* Subheading */}
      <motion.h2
        className="mb-6 text-center text-lg leading-relaxed font-medium sm:mb-8 sm:text-2xl sm:whitespace-nowrap md:text-[28px]"
        style={{
          fontFamily: "var(--font-datatype)",
          color: "rgba(0, 0, 0, 0.7)",
        }}
        variants={staggerItem}
      >
        One sentence that explains what your product does differently.
      </motion.h2>

      {/* CTA Button */}
      <motion.div className="mb-4" variants={staggerItem}>
        <GradientButton href="#pricing" variant="dark" className="sm:px-36">
          <span
            className="text-sm font-semibold sm:text-base"
            style={{
              fontFamily: "var(--font-datatype)",
              color: "rgba(255, 255, 255, 0.95)",
            }}
          >
            Get Started — $XX
          </span>
        </GradientButton>
      </motion.div>

      {/* Subtext */}
      <motion.p
        className="text-center text-sm font-semibold sm:text-base"
        style={{
          fontFamily: "var(--font-datatype)",
          color: "rgba(0, 0, 0, 0.6)",
        }}
        variants={staggerItem}
      >
        Risk-free guarantee or pricing note.
      </motion.p>
    </motion.section>
  );
}

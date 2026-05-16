"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";
import { GradientButton } from "@/components/ui/gradient-button";

export function CtaSection() {
  return (
    <section id="pricing" className="relative w-full overflow-hidden">
      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center md:flex-row md:items-start md:justify-between md:gap-8 md:px-8 md:py-32 md:text-left"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        {/* Text - Left */}
        <motion.div variants={staggerItem}>
          <h2
            className="text-4xl font-extrabold md:text-[56px]"
            style={{
              letterSpacing: "-2px",
              color: "rgb(15, 23, 42)",
              lineHeight: "1.1em",
            }}
          >
            Stop waiting. Start building.
          </h2>
          <p
            className="mt-4 max-w-lg text-lg font-medium md:mt-6 md:text-[28px]"
            style={{
              lineHeight: "1.5em",
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Your closing line. Make it action-oriented.
          </p>
        </motion.div>

        {/* Button - Right */}
        <motion.div
          className="flex flex-shrink-0 flex-col items-center"
          variants={staggerItem}
        >
          <GradientButton href="#pricing" size="large" variant="dark">
            <span
              className="text-lg font-semibold md:text-2xl"
              style={{ color: "rgba(255, 255, 255, 0.95)" }}
            >
              Get Started — $XX
            </span>
          </GradientButton>
          <p
            className="mt-4 text-sm font-semibold"
            style={{ color: "rgba(0, 0, 0, 0.6)" }}
          >
            Risk-free guarantee or pricing note.
          </p>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <div className="relative z-10 mx-auto mt-24 max-w-5xl px-4 pb-12 text-center md:mt-32 md:px-8">
        <p
          className="text-base font-medium"
          style={{
            fontFamily: "var(--font-datatype)",
            color: "rgba(0, 0, 0, 0.7)",
          }}
        >
          © {new Date().getFullYear()} YourSaaS
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <a
            href="#"
            className="text-sm font-medium text-slate-900 hover:underline"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-sm font-medium text-slate-900 hover:underline"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </section>
  );
}

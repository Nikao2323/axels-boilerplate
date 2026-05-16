"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";
import { GradientButton } from "@/components/ui/gradient-button";

export function CtaSection() {
  return (
    <section id="contact" className="relative w-full overflow-hidden">
      <motion.div
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center md:flex-row md:items-start md:justify-between md:gap-8 md:px-8 md:py-32 md:text-left"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <motion.div variants={staggerItem}>
          <h2
            className="text-4xl font-extrabold md:text-[56px]"
            style={{
              letterSpacing: "-2px",
              color: "rgb(15, 23, 42)",
              lineHeight: "1.1em",
            }}
          >
            დაიწყეთ თქვენი პროექტი დღეს.
          </h2>
          <p
            className="mt-4 max-w-lg text-lg font-medium md:mt-6 md:text-[28px]"
            style={{
              lineHeight: "1.5em",
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            გვიკავშირდით და ერთად ავაშენებთ თქვენს ოცნებას.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-shrink-0 flex-col items-center"
          variants={staggerItem}
        >
          <GradientButton href="#contact" size="large" variant="dark">
            <span
              className="text-lg font-semibold md:text-2xl"
              style={{ color: "rgba(255, 255, 255, 0.95)" }}
            >
              დაგვიკავშირდით
            </span>
          </GradientButton>
          <p
            className="mt-4 text-sm font-semibold"
            style={{ color: "rgba(0, 0, 0, 0.6)" }}
          >
            უფასო კონსულტაცია პირველ შეხვედრაზე
          </p>
        </motion.div>
      </motion.div>

      <div className="relative z-10 mx-auto mt-24 max-w-5xl px-4 pb-12 text-center md:mt-32 md:px-8">
        <p
          className="text-base font-medium"
          style={{
            fontFamily: "var(--font-datatype)",
            color: "rgba(0, 0, 0, 0.7)",
          }}
        >
          © {new Date().getFullYear()} არსი
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="#" className="text-sm font-medium text-slate-900 hover:underline">
            კონფიდენციალურობა
          </a>
          <a href="#" className="text-sm font-medium text-slate-900 hover:underline">
            წესები და პირობები
          </a>
        </div>
      </div>
    </section>
  );
}

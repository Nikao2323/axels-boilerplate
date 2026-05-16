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
          სამშენებლო კომპანია
        </span>
      </motion.div>

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
        ვაშენებთ. ვავითარებთ.
        <br />
        ვქმნით.
      </motion.h1>

      <motion.h2
        className="mb-6 text-center text-lg leading-relaxed font-medium sm:mb-8 sm:text-2xl sm:whitespace-nowrap md:text-[28px]"
        style={{
          fontFamily: "var(--font-datatype)",
          color: "rgba(0, 0, 0, 0.7)",
        }}
        variants={staggerItem}
      >
        კომპანია არსი — ხარისხიანი მშენებლობა და განვითარება
      </motion.h2>

      <motion.div className="mb-4" variants={staggerItem}>
        <GradientButton href="#contact" variant="dark" className="sm:px-36">
          <span
            className="text-sm font-semibold sm:text-base"
            style={{
              fontFamily: "var(--font-datatype)",
              color: "rgba(255, 255, 255, 0.95)",
            }}
          >
            დაგვიკავშირდით
          </span>
        </GradientButton>
      </motion.div>

      <motion.p
        className="text-center text-sm font-semibold sm:text-base"
        style={{
          fontFamily: "var(--font-datatype)",
          color: "rgba(0, 0, 0, 0.6)",
        }}
        variants={staggerItem}
      >
        უფასო კონსულტაცია პირველ შეხვედრაზე
      </motion.p>
    </motion.section>
  );
}

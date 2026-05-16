"use client";

import { User } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, defaultViewport } from "@/lib/motion";

const AVATAR_COUNT = 18;

export function SocialProof() {
  return (
    <motion.section
      className="mx-auto flex max-w-5xl flex-col items-center px-4 pt-12 pb-16 sm:pt-16 sm:pb-32"
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={fadeUp}
    >
      {/* Heading */}
      <p
        className="mb-6 text-center text-[13px] font-semibold leading-relaxed"
        style={{
          fontFamily: "var(--font-datatype)",
          fontSize: "13px",
          fontWeight: 600,
          lineHeight: "1.5em",
          color: "rgba(0, 0, 0, 0.6)",
        }}
      >
        Join [X]+ users who already [benefit of your product]
      </p>

      {/* Avatar Marquee */}
      <div
        className="w-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 12.5%, rgb(0, 0, 0) 87.5%, rgba(0, 0, 0, 0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 12.5%, rgb(0, 0, 0) 87.5%, rgba(0, 0, 0, 0) 100%)",
          padding: "10px",
        }}
      >
        <div className="animate-marquee flex items-center gap-12">
          {Array.from({ length: AVATAR_COUNT }, (_, i) => (
            <div
              key={i}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
              style={{
                border: "2px solid rgba(0, 0, 0, 0.3)",
                backgroundColor: "rgba(0, 0, 0, 0.06)",
              }}
            >
              <User
                className="h-4 w-4"
                style={{ color: "rgba(0, 0, 0, 0.3)" }}
              />
            </div>
          ))}
          {Array.from({ length: AVATAR_COUNT }, (_, i) => (
            <div
              key={`dup-${i}`}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
              style={{
                border: "2px solid rgba(0, 0, 0, 0.3)",
                backgroundColor: "rgba(0, 0, 0, 0.06)",
              }}
            >
              <User
                className="h-4 w-4"
                style={{ color: "rgba(0, 0, 0, 0.3)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

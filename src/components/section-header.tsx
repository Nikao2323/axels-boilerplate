"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

interface SectionHeaderProps {
  badge: string;
  heading: string[];
  description: string | string[];
}

export function SectionHeader({
  badge,
  heading,
  description,
}: SectionHeaderProps) {
  const badgeBorderColor = "rgba(99, 102, 241, 0.2)";
  const headingColor = "rgb(15, 23, 42)";
  const descriptionColor = "rgb(71, 85, 105)";

  const descriptions = Array.isArray(description) ? description : [description];

  return (
    <motion.div
      className="flex justify-center px-4 pt-16 pb-8 md:pt-32 md:pb-12"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
    >
      <div className="max-w-2xl">
        {/* Badge */}
        <motion.div
          className="mb-4 inline-block rounded-full px-4 py-1 whitespace-nowrap md:mb-6"
          style={{ border: `1px solid ${badgeBorderColor}` }}
          variants={staggerItem}
        >
          <p
            className="text-sm font-medium md:text-base"
            style={{
              lineHeight: "150%",
              color: "rgb(99, 102, 241)",
            }}
          >
            {badge}
          </p>
        </motion.div>

        {/* Heading */}
        <motion.div className="mb-4 md:mb-6" variants={staggerItem}>
          {heading.map((line, i) => (
            <h2
              key={i}
              className="text-4xl font-extrabold md:text-[56px]"
              style={{
                fontFamily: "var(--font-bitcount-single)",
                fontWeight: 800,
                letterSpacing: "-2px",
                textAlign: "left",
                lineHeight: "1.1em",
                color: headingColor,
              }}
            >
              {line}
            </h2>
          ))}
        </motion.div>

        {/* Description */}
        <motion.div className="space-y-2" variants={staggerItem}>
          {descriptions.map((desc, i) => (
            <p
              key={i}
              className="text-lg font-medium md:text-[28px]"
              style={{
                lineHeight: "1.5em",
                textAlign: "left",
                color: descriptionColor,
              }}
            >
              {desc}
            </p>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

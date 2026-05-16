"use client";

import { motion } from "framer-motion";
import {
  MonitorPlay,
  CloudDownload,
  AudioLines,
  ImageIcon,
} from "lucide-react";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";
import { GradientButton } from "@/components/ui/gradient-button";

const features = [
  {
    id: "feature-1",
    title: "Showcase Feature One",
    description:
      "Describe a key product capability. Focus on the benefit — what does the user get out of this?",
    icon: MonitorPlay,
  },
  {
    id: "feature-2",
    title: "Showcase Feature Two",
    description:
      "Describe another product capability. Keep it concise and benefit-focused.",
    icon: CloudDownload,
  },
  {
    id: "feature-3",
    title: "Showcase Feature Three",
    description:
      "Describe a third capability. What makes this special compared to alternatives?",
    icon: AudioLines,
  },
];

export function ShowcaseSection() {
  return (
    <section className="bg-white px-4 py-16 md:py-32">
      {/* Header */}
      <motion.div
        className="mx-auto mb-8 max-w-2xl text-center md:mb-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <motion.h2
          className="text-4xl font-extrabold md:text-[56px]"
          style={{
            letterSpacing: "-2px",
            color: "rgb(15, 23, 42)",
            lineHeight: "1.1em",
          }}
          variants={staggerItem}
        >
          Ready to go. Every time.
        </motion.h2>
        <motion.p
          className="mt-4 text-lg font-medium md:mt-6 md:text-[28px]"
          style={{
            lineHeight: "1.5em",
            color: "rgb(71, 85, 105)",
          }}
          variants={staggerItem}
        >
          Describe the overall value proposition of this feature group. What
          outcome do users get?
        </motion.p>
      </motion.div>

      {/* Content */}
      <div className="mx-auto max-w-5xl">
        {/* Image with gradient border */}
        <motion.div
          className="rounded-[25px] p-[2px]"
          style={{
            background:
              "conic-gradient(from 323deg, rgb(255, 255, 0) 0deg, rgb(0, 255, 255) 120deg, rgb(255, 0, 255) 237deg, rgb(255, 255, 0) 360deg)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{ duration: 0.6 }}
        >
          <div
            className="rounded-3xl bg-white p-2"
            style={{ borderRadius: "24px" }}
          >
            <div
              className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.03)",
                boxShadow: "rgba(0, 0, 0, 0.15) 0px 8px 32px 4px",
                border: "1px solid rgba(15, 23, 42, 0.06)",
              }}
            >
              <ImageIcon className="h-10 w-10 text-slate-300" />
            </div>
          </div>
        </motion.div>

        {/* Features - below image */}
        <motion.div
          className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              className="rounded-3xl p-4 text-left md:p-6"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.03)",
              }}
              variants={staggerItem}
            >
              <div className="mb-2 flex items-center gap-3">
                <feature.icon
                  className="h-6 w-6"
                  style={{ color: "rgb(148, 163, 184)" }}
                />
                <h3 className="text-base font-semibold text-slate-900 md:text-xl">
                  {feature.title}
                </h3>
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-500 md:text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Button */}
      <motion.div
        className="mt-12 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={defaultViewport}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <GradientButton href="#pricing" className="md:px-16 md:py-4">
          <span
            className="text-sm font-semibold text-white/95 md:text-base"
            style={{
              fontFamily: "var(--font-datatype)",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.95)",
            }}
          >
            Get Started — $XX
          </span>
        </GradientButton>
      </motion.div>
    </section>
  );
}

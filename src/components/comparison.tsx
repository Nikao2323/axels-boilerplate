"use client";

import { motion } from "framer-motion";
import { Zap, Shield, BarChart3, Globe } from "lucide-react";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

const advantages = [
  { icon: Zap, label: "Advantage 1" },
  { icon: Shield, label: "Advantage 2" },
  { icon: BarChart3, label: "Advantage 3" },
  { icon: Globe, label: "Advantage 4" },
];

export function Comparison() {
  return (
    <section className="bg-white px-4 py-16 md:py-32">
      {/* Header */}
      <motion.div
        className="mx-auto mb-10 max-w-2xl text-center md:mb-16"
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
          Your time back
        </motion.h2>
        <motion.p
          className="mt-4 text-lg font-medium md:mt-6 md:text-[28px]"
          style={{
            lineHeight: "1.5em",
            color: "rgb(71, 85, 105)",
          }}
          variants={staggerItem}
        >
          Describe how your product saves time compared to the old way of doing
          things. Quantify the difference if you can.
        </motion.p>
      </motion.div>

      {/* Chart Card */}
      <motion.div
        className="mx-auto max-w-3xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={defaultViewport}
        transition={{ duration: 0.5 }}
      >
        <div
          className="rounded-2xl bg-white p-6 md:rounded-[32px] md:p-8"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.05) 0px 4px 24px 0px, rgba(0, 0, 0, 0.08) 0px 2px 8px 0px",
          }}
        >
          {/* Your Product Row */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(79, 70, 229) 100%)",
                }}
              />
              <span className="text-base font-semibold text-slate-900 md:text-xl">
                YourSaaS
              </span>
            </div>

            <div className="flex gap-3 md:gap-4">
              <motion.div
                className="flex h-16 w-[18%] items-center justify-center rounded-2xl md:h-20"
                style={{
                  background:
                    "linear-gradient(90deg, rgb(99, 102, 241) 0%, rgb(79, 70, 229) 100%)",
                  boxShadow: "rgba(99, 102, 241, 0.3) 0px 4px 20px 0px",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />

              <motion.div
                className="flex h-16 flex-1 items-center justify-center gap-3 rounded-2xl md:h-20 md:gap-5"
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "2px dashed rgb(148, 163, 184)",
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                {advantages.map((adv, i) => (
                  <div key={i} className="flex items-center gap-1.5 md:gap-2">
                    <adv.icon
                      className="h-4 w-4 md:h-5 md:w-5"
                      style={{ color: "rgb(15, 23, 42)" }}
                    />
                    <span className="hidden text-xs font-medium text-slate-900 md:block">
                      {adv.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Competitor Row */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ background: "rgb(148, 163, 184)" }}
              />
              <span className="text-base font-semibold text-slate-900 md:text-xl">
                The old way / competitors
              </span>
            </div>

            <div
              className="relative h-16 overflow-hidden rounded-2xl md:h-20"
              style={{ background: "rgb(241, 245, 249)" }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-2xl"
                style={{ background: "rgb(148, 163, 184)" }}
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Time Scale */}
          <div className="flex justify-between">
            <span
              className="text-sm font-medium text-slate-400 md:text-base"
              style={{
                fontFamily: "var(--font-datatype)",
                fontWeight: 500,
                lineHeight: "150%",
                color: "rgb(148, 163, 184)",
              }}
            >
              0 min
            </span>
            <span
              className="text-sm font-medium text-slate-400 md:text-base"
              style={{
                fontFamily: "var(--font-datatype)",
                fontWeight: 500,
                lineHeight: "150%",
                color: "rgb(148, 163, 184)",
              }}
            >
              30 min
            </span>
          </div>
        </div>

        {/* Caption */}
        <motion.p
          className="mt-6 text-center text-sm font-medium text-slate-500 md:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          Total time to [complete task] — your product vs. the old way
        </motion.p>
      </motion.div>
    </section>
  );
}

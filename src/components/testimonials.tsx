"use client";

import { motion } from "framer-motion";
import { MessageCircle, Briefcase, User } from "lucide-react";
import { staggerContainer, staggerItem, defaultViewport } from "@/lib/motion";

const testimonials = [
  {
    name: "Alex Johnson",
    handle: "@alexjohnson",
    quote:
      "Replace this with a real testimonial. Mention specific features and outcomes. Social proof works best when it's specific and relatable.",
    social: "twitter" as const,
    rotate: -2,
  },
  {
    name: "Sarah Chen",
    handle: "@sarahchen",
    quote:
      "Another testimonial placeholder. Focus on the transformation — what was life like before vs. after using the product?",
    social: "twitter" as const,
    rotate: 1,
  },
  {
    name: "Mike Roberts",
    handle: "@mikeroberts",
    quote:
      "Third testimonial. Include the user's role or context so readers can identify with them. 'As a [role], this solved [problem].'",
    social: "twitter" as const,
    rotate: 2,
  },
  {
    name: "Emily Park",
    handle: "Head of Product",
    quote:
      "A LinkedIn-style testimonial. Great for B2B credibility. Include the company or role to add authority.",
    social: "linkedin" as const,
    rotate: -1,
  },
  {
    name: "David Kim",
    handle: "@davidkim",
    quote:
      "Fifth testimonial. Variety in length and tone keeps this section feeling authentic rather than templated.",
    social: "twitter" as const,
    rotate: 0,
  },
  {
    name: "Lisa Wang",
    handle: "@lisawang",
    quote:
      "Short and punchy works too. 'Best [product category] I've used. Period.' Sometimes less is more.",
    social: "twitter" as const,
    rotate: 1,
  },
  {
    name: "James Taylor",
    handle: "@jamestaylor",
    quote:
      "Seventh testimonial. Mix up the sentiments — some about ease of use, some about results, some about support.",
    social: "twitter" as const,
    rotate: -2,
  },
  {
    name: "Maria Garcia",
    handle: "CTO at StartupCo",
    quote:
      "LinkedIn testimonial with technical credibility. Great for products that need enterprise trust signals.",
    social: "linkedin" as const,
    rotate: 2,
  },
  {
    name: "Chris Anderson",
    handle: "@chrisanderson",
    quote:
      "Ninth testimonial. End on a strong note — this should be one of your most compelling quotes.",
    social: "twitter" as const,
    rotate: 0,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-white px-4 py-16 md:py-32">
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
            fontFamily: "var(--font-bitcount-single)",
            fontWeight: 800,
            letterSpacing: "-2px",
            color: "rgb(15, 23, 42)",
            lineHeight: "1.1em",
          }}
          variants={staggerItem}
        >
          They switched. They stayed.
        </motion.h2>
        <motion.p
          className="mt-4 text-lg font-medium md:mt-6 md:text-[28px]"
          style={{
            fontFamily: "var(--font-datatype)",
            lineHeight: "1.5em",
            color: "rgb(71, 85, 105)",
          }}
          variants={staggerItem}
        >
          Hear it from the people who actually use it every day.
        </motion.p>
      </motion.div>

      {/* Testimonial Grid */}
      <div className="mx-auto max-w-5xl">
        <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              className="mb-6 break-inside-avoid"
              style={{ transform: `rotate(${testimonial.rotate}deg)` }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
            >
              <motion.div
                className="rounded-2xl bg-white p-4 md:rounded-[32px] md:p-6"
                style={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.05) 0px 4px 24px 0px, rgba(0, 0, 0, 0.08) 0px 2px 8px 0px",
                }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full md:h-12 md:w-12"
                      style={{
                        backgroundColor: "rgba(15, 23, 42, 0.06)",
                        border: "1px solid rgba(15, 23, 42, 0.08)",
                      }}
                    >
                      <User className="h-5 w-5 text-slate-300 md:h-6 md:w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 md:text-base">
                        {testimonial.name}
                      </p>
                      <p className="text-sm font-medium text-slate-400 md:text-base">
                        {testimonial.handle}
                      </p>
                    </div>
                  </div>
                  {testimonial.social === "twitter" ? (
                    <MessageCircle className="h-5 w-5 text-slate-400" />
                  ) : (
                    <Briefcase className="h-5 w-5 text-slate-400" />
                  )}
                </div>

                {/* Quote */}
                <p className="text-sm font-medium leading-relaxed text-slate-500 md:text-base">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

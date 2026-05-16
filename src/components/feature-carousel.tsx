"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  BarChart3,
  Sparkles,
  Globe,
  ImageIcon,
} from "lucide-react";

const features = [
  {
    title: "Feature One",
    description:
      "Describe your first key feature. What does it do? How does it help the user? Keep it concise and benefit-focused.",
    icon: Zap,
  },
  {
    title: "Feature Two",
    description:
      "Describe your second key feature. Focus on the outcome the user gets, not just the technical details.",
    icon: Shield,
  },
  {
    title: "Feature Three",
    description:
      "Describe your third key feature. What pain point does this solve? Why should users care?",
    icon: BarChart3,
  },
  {
    title: "Feature Four",
    description:
      "Describe your fourth key feature. How does this differentiate you from competitors?",
    icon: Sparkles,
  },
  {
    title: "Feature Five",
    description:
      "Describe your fifth key feature. What's the 'wow' factor that makes people tell their friends?",
    icon: Globe,
  },
];

const CARD_HEIGHT = 480;

export function FeatureCarousel() {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative w-full overflow-visible pb-16 md:pb-32">
      <div className="relative">
        <ul
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-4 pt-8 pb-8 md:gap-10 md:px-8 md:pt-16 md:pb-16"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <li className="w-4 flex-shrink-0 md:w-8" aria-hidden="true" />

          {features.map((feature, i) => (
            <motion.li
              key={i}
              className="flex-shrink-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Mobile card */}
              <div
                className="relative overflow-hidden rounded-2xl p-5 md:hidden"
                style={{
                  minHeight: "280px",
                  width: "280px",
                  background:
                    "linear-gradient(rgb(255, 255, 255) 0%, rgb(255, 255, 255) 75%, rgb(245, 245, 255) 100%)",
                  border: "1px solid rgb(199, 210, 254)",
                  boxShadow:
                    "rgba(199, 210, 254, 0.25) 0px 16px 64px 4px, rgba(0, 0, 0, 0.1) 0px 8px 32px 0px",
                }}
              >
                <div className="relative z-10">
                  <div className="mb-2 flex items-center gap-2">
                    <feature.icon
                      className="h-5 w-5"
                      style={{ color: "rgb(15, 23, 42)" }}
                    />
                    <h3 className="text-base font-semibold text-slate-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-slate-500">
                    {feature.description}
                  </p>
                </div>
                <div
                  className="absolute right-0 bottom-0 left-0 flex h-32 items-center justify-center"
                  style={{
                    backgroundColor: "rgba(15, 23, 42, 0.05)",
                    borderTop: "1px solid rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <ImageIcon className="h-6 w-6 text-slate-300" />
                </div>
              </div>

              {/* Desktop card */}
              <div
                className="relative hidden overflow-hidden rounded-3xl p-8 md:block"
                style={{
                  height: `${CARD_HEIGHT}px`,
                  width: "360px",
                  background:
                    "linear-gradient(rgb(255, 255, 255) 0%, rgb(255, 255, 255) 75%, rgb(245, 245, 255) 100%)",
                  border: "1px solid rgb(199, 210, 254)",
                  boxShadow:
                    "rgba(199, 210, 254, 0.25) 0px 16px 64px 4px, rgba(0, 0, 0, 0.1) 0px 8px 32px 0px",
                }}
              >
                <div className="relative z-10">
                  <div className="mb-2 flex items-center gap-2">
                    <feature.icon
                      className="h-6 w-6"
                      style={{ color: "rgb(15, 23, 42)" }}
                    />
                    <h3
                      className="text-xl font-semibold text-slate-900"
                      style={{
                        fontFamily: "var(--font-datatype)",
                        fontSize: "20px",
                        fontWeight: 600,
                        lineHeight: "150%",
                        color: "rgb(15, 23, 42)",
                      }}
                    >
                      {feature.title}
                    </h3>
                  </div>
                  <p
                    className="font-medium leading-relaxed text-slate-500"
                    style={{
                      fontFamily: "var(--font-datatype)",
                      fontWeight: 500,
                      lineHeight: "150%",
                      color: "rgb(71, 85, 105)",
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
                <div
                  className="absolute right-0 bottom-0 left-0 flex h-48 items-center justify-center"
                  style={{
                    backgroundColor: "rgba(15, 23, 42, 0.05)",
                    borderTop: "1px solid rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <ImageIcon className="h-8 w-8 text-slate-300" />
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* Navigation Buttons */}
        <div
          className="pointer-events-none absolute right-0 left-0 hidden items-center justify-between px-8 md:flex"
          style={{
            top: `calc(64px + ${CARD_HEIGHT / 2}px)`,
            transform: "translateY(-50%)",
          }}
        >
          <motion.button
            onClick={() => scroll("left")}
            className="pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-opacity"
            style={{
              background: "rgb(99, 102, 241)",
              opacity: canScrollLeft ? 1 : 0,
              pointerEvents: canScrollLeft ? "auto" : "none",
            }}
            aria-label="Previous"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </motion.button>
          <motion.button
            onClick={() => scroll("right")}
            className="pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-opacity"
            style={{
              background: "rgb(99, 102, 241)",
              opacity: canScrollRight ? 1 : 0,
              pointerEvents: canScrollRight ? "auto" : "none",
            }}
            aria-label="Next"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </motion.button>
        </div>
      </div>

      <style jsx>{`
        ul::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

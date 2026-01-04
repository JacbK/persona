"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Experience() {
  return (
    <section className="py-32 px-4 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="font-mono text-xs text-accent tracking-widest uppercase mb-4">
          01 / Selected Experience
        </h2>
        <div className="h-px w-full bg-[#f2f0e4]/10" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-24">
        {/* Sticky Year */}
        <div className="md:col-span-3">
          <div className="sticky top-32">
            <span className="font-serif text-6xl md:text-8xl text-[#f2f0e4]/10 leading-none">
              2025
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-9">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative"
          >
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

            <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-6">
              <h3 className="font-serif text-4xl md:text-5xl text-[#f2f0e4]">
                Palantir
              </h3>
              <span className="font-mono text-secondary text-sm">
                Forward Deployed Software Engineer, Warp Speed
              </span>
            </div>

            <p className="font-sans text-lg md:text-xl text-[#f2f0e4]/80 leading-relaxed max-w-2xl mb-8">
              Deploying <span className="text-accent">AI solutions</span> to help teams increase productivity and operational capacity.
              Building tools that bridge complex systems with intelligent automation.
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                "AI-powered tooling",
                "Data reconciliation systems",
                "LLM integrations",
                "Industrial tech",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-mono text-sm text-[#f2f0e4]/60">
                  <ArrowRight className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        {/* Sticky Year */}
        <div className="md:col-span-3">
          <div className="sticky top-32">
            <span className="font-serif text-6xl md:text-8xl text-[#f2f0e4]/10 leading-none">
              2024
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-9">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative"
          >
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

            <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-6">
              <h3 className="font-serif text-4xl md:text-5xl text-[#f2f0e4]">
                Uber
              </h3>
              <span className="font-mono text-secondary text-sm">
                Software Engineer, Competitive Intelligence
              </span>
            </div>

            <p className="font-sans text-lg md:text-xl text-[#f2f0e4]/80 leading-relaxed max-w-2xl mb-8">
              Helped architect the <span className="text-accent">Ingestion Platform</span> powering Uber's competitive strategy.
              Transformed diverse datasets into actionable intelligence metrics.
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                "High-throughput data pipelines",
                "Metric synthesis & transformation",
                "AI-assisted developer workflows",
                "400+ data source integrations",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 font-mono text-sm text-[#f2f0e4]/60">
                  <ArrowRight className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

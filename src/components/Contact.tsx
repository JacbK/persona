"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="py-32 px-4 md:px-12 max-w-7xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative z-10"
      >
        <p className="font-mono text-xs text-accent tracking-widest uppercase mb-8">
          03 / Initialization
        </p>

        <h2 className="font-serif text-5xl md:text-8xl text-[#f2f0e4] mb-12">
          Let's Build<br />The Future
        </h2>

        <a
          href="mailto:hello@mayarodriguez.design"
          className="inline-block relative group"
        >
          <span className="font-mono text-xl md:text-2xl text-[#f2f0e4] group-hover:text-accent transition-colors duration-300">
            hello@mayarodriguez.design
          </span>
          <span className="absolute -bottom-2 left-0 w-full h-px bg-[#f2f0e4]/30 group-hover:bg-accent transition-colors duration-300" />
          <span className="absolute -bottom-2 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-500 ease-out" />
        </a>
      </motion.div>

      <footer className="mt-32 pt-8 border-t border-[#f2f0e4]/10 flex flex-col md:flex-row items-center justify-between text-[#f2f0e4]/40 font-mono text-xs">
        <p>&copy; {new Date().getFullYear()} Maya Rodriguez.</p>
        <p>System Status: <span className="text-accent">OPERATIONAL</span></p>
      </footer>
    </section>
  );
}

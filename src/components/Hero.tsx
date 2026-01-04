"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Abstract Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--color-secondary)_0%,_transparent_25%)] opacity-10 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--color-accent)_0%,_transparent_30%)] opacity-10 blur-[120px]" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(242,240,228,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(242,240,228,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
      </div>

      <div className="z-10 text-center mix-blend-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-2 px-3 py-1 border border-accent/30 rounded-full bg-accent/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-accent uppercase">
              Online • Seattle
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[12vw] leading-[0.8] tracking-tighter text-[#f2f0e4]"
        >
          JACOB
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#f2f0e4] to-[#f2f0e4]/50">
            KIESER
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12"
        >
          <p className="font-mono text-sm md:text-base text-accent tracking-widest uppercase">
            // Software Engineer
          </p>
          <span className="hidden md:block w-px h-4 bg-[#f2f0e4]/20" />
          <p className="font-sans text-[#f2f0e4]/60 max-w-md text-sm md:text-base leading-relaxed text-balance">
            Building high-fidelity data platforms and digital experiences.
            Currently a Forward Deployed Engineer at <span className="text-white font-medium">Palantir</span>.
          </p>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] text-[#f2f0e4]/40 uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#f2f0e4]/40 to-transparent" />
      </motion.div>
    </section>
  );
}

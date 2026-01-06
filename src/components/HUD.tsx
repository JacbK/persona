"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity, Clock, Command, Mail } from "lucide-react";

export default function HUD() {
  const [time, setTime] = useState("");
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setScrolled(Number.isNaN(scroll) ? 0 : scroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8, type: "spring" }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 p-2 bg-[#0a1f1c]/80 backdrop-blur-md border border-[#f2f0e4]/10 rounded-full shadow-2xl shadow-accent/5"
    >
      <div className="flex items-center gap-2 px-4 py-2 border-r border-[#f2f0e4]/10">
        <Activity className="w-4 h-4 text-accent animate-pulse" />
        <span className="font-mono text-xs text-[#f2f0e4]/60">SYS.ONLINE</span>
      </div>

      <div className="hidden md:flex items-center gap-2 px-4 py-2 font-mono text-xs">
        <Clock className="w-3 h-3 text-secondary" />
        <span>{time}</span>
        <span className="text-[#f2f0e4]/40">|</span>
        <span className="text-accent">{Math.round(scrolled * 100)}%</span>
      </div>

      <div className="flex items-center gap-1 pl-2">
        <a
          href="mailto:hello@mayarodriguez.design"
          className="p-2 hover:bg-[#f2f0e4]/10 rounded-full transition-colors group relative"
        >
          <Mail className="w-5 h-5 text-[#f2f0e4] group-hover:text-accent transition-colors" />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-accent text-bg text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            CONTACT
          </span>
        </a>
        <button
            onClick={() => window.open('https://github.com/mayarodriguez', '_blank')}
            className="p-2 hover:bg-[#f2f0e4]/10 rounded-full transition-colors group relative"
        >
           <Command className="w-5 h-5 text-[#f2f0e4] group-hover:text-secondary transition-colors" />
             <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-secondary text-bg text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            GITHUB
          </span>
        </button>
      </div>
    </motion.nav>
  );
}

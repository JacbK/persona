import HUD from "@/components/HUD";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="relative bg-[#0a1f1c] text-[#f2f0e4] selection:bg-[#ccff00] selection:text-[#0a1f1c]">
      <HUD />
      <Hero />
      <Experience />
      <Projects />
      <Contact />
    </main>
  );
}
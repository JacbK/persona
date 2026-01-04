"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  color: string;
}

const projects: Project[] = [
  {
    title: "Persona",
    description: "An AI-native framework for building authentic, unique developer portfolios. It rejects templates in favor of generated designs based on personality archetypes.",
    tags: ["TypeScript", "Next.js", "AI Agents", "Tailwind"],
    github: "https://github.com/JacbK/persona",
    color: "var(--color-accent)",
  },
  {
    title: "Vetera",
    description: "An AI-powered veterinary assistant simplifying pet healthcare. It provides 24/7 access to medical records, automated scheduling, and personalized health insights for pet parents.",
    tags: ["AI", "HealthTech", "Product Design"],
    link: "https://veteravet.com",
    color: "var(--color-secondary)",
  },
];

export default function Projects() {
  return (
    <section className="py-32 px-4 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-20 flex items-center justify-between"
      >
        <h2 className="font-mono text-xs text-accent tracking-widest uppercase">
          02 / Selected Works
        </h2>
        <div className="h-px w-32 bg-[#f2f0e4]/10" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="group relative bg-[#f2f0e4]/5 border border-[#f2f0e4]/10 p-8 md:p-12 hover:bg-[#f2f0e4]/10 transition-colors duration-500 overflow-hidden"
          >
            {/* Decoration */}
            {(project.link || project.github) && (
              <a
                href={project.link || project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hover:scale-110"
                style={{ color: project.color }}
              >
                <ExternalLink className="w-6 h-6" />
              </a>
            )}

            <h3 className="font-serif text-3xl md:text-4xl text-[#f2f0e4] mb-4 group-hover:translate-x-2 transition-transform duration-500">
              {project.title}
            </h3>
            
            <p className="font-sans text-[#f2f0e4]/60 mb-8 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-mono border border-[#f2f0e4]/20 rounded-full text-[#f2f0e4]/80"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-mono text-accent hover:text-[#f2f0e4] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Site
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-mono text-accent hover:text-[#f2f0e4] transition-colors"
                >
                  <Github className="w-4 h-4" />
                  View Source
                </a>
              )}
            </div>

            {/* Hover Glow */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none mix-blend-screen"
              style={{ background: `radial-gradient(circle at bottom right, ${project.color}, transparent 60%)` }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

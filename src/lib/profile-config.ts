import * as yaml from "js-yaml";

export type DesignDescription = {
  typography: string;
  colors: string;
  layout: string;
  spacing: string;
  motion: string;
  details: string;
};

type InspirationExample = {
  name: string;
  url: string;
  screenshot: string;
  design: DesignDescription;
};

export type InspirationArchetype = {
  id: number;
  name: string;
  description: string;
  color: string;
  examples: InspirationExample[];
};

export type ProfileConfig = {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
  cli: string;
  sections: Record<string, boolean>;
  design: {
    creativity: number;
    simplicity: number;
    playfulness: number;
    animation: number;
    color_intensity: number;
    notes: string;
  };
  content: {
    tone: string;
    length: string;
    focus: string;
  };
  ai: {
    quality_bar: number;
    research_depth: number;
    copy_creativity: number;
  };
  notes: string;
};

export function parseDesignAttributes(design: DesignDescription) {
  const fontMatch = design.typography.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/);
  const sizeMatch = design.typography.match(/(\d+)(?:-(\d+))?px/);
  const weightMatch = design.typography.match(/(\d{3})\s*weight/);
  const trackingMatch = design.typography.match(/([-\d.]+)em\s*tracking/);
  const hexMatches = design.colors.match(/#[0-9A-Fa-f]{3,6}/g) ?? [];
  const widthMatch = design.layout.match(/(\d+)px/);
  const spacingMatch = design.spacing.match(/(\d+)(?:-(\d+))?px/);
  const paddingMatch = design.spacing.match(/(\d+)px\s*padding/);
  const durationMatch = design.motion.match(/(\d+)ms/);
  const borderMatch = design.details.match(/(\d+)px\s*border/);

  return {
    fontFamily: fontMatch?.[1] ?? "Inter",
    fontSize: sizeMatch
      ? sizeMatch[2]
        ? Math.round((Number(sizeMatch[1]) + Number(sizeMatch[2])) / 2)
        : Number(sizeMatch[1])
      : 16,
    fontWeight: weightMatch ? Number(weightMatch[1]) : 400,
    letterSpacing: trackingMatch ? `${trackingMatch[1]}em` : "normal",
    colorBg: hexMatches[0] ?? "#000000",
    colorText: hexMatches[1] ?? "#ffffff",
    colorAccent: hexMatches[2] ?? hexMatches[0] ?? "#5e6ad2",
    maxWidth: widthMatch ? Number(widthMatch[1]) : 1200,
    alignment: design.layout.toLowerCase().includes("centered")
      ? "centered"
      : design.layout.toLowerCase().includes("full")
        ? "full-width"
        : "left",
    sectionSpacing: spacingMatch
      ? spacingMatch[2]
        ? Math.round((Number(spacingMatch[1]) + Number(spacingMatch[2])) / 2)
        : Number(spacingMatch[1])
      : 100,
    padding: paddingMatch ? Number(paddingMatch[1]) : 40,
    motionDuration: durationMatch ? Number(durationMatch[1]) : 200,
    motionStyle: design.motion.toLowerCase().includes("slide")
      ? "slide"
      : design.motion.toLowerCase().includes("snap")
        ? "snap"
        : "fade",
    borderWidth: design.details.toLowerCase().includes("no border")
      ? 0
      : borderMatch
        ? Number(borderMatch[1])
        : 1,
    borderRadius:
      design.details.toLowerCase().includes("sharp") ||
      design.details.toLowerCase().includes("clean edges")
        ? 0
        : design.details.toLowerCase().includes("rounded")
          ? 8
          : 0,
  };
}

export function generateProfileYaml(
  config: ProfileConfig,
  selectedExamples: string[],
  archetypes: InspirationArchetype[],
): string {
  const examples = archetypes.flatMap((archetype) => archetype.examples);
  const designInspirations = selectedExamples.flatMap((url) => {
    const example = examples.find((item) => item.url === url);
    if (!example) return [];
    return [
      {
        name: example.name,
        url: example.url,
        attributes: parseDesignAttributes(example.design),
        descriptions: example.design,
      },
    ];
  });

  const output = {
    name: config.name || "Your Name",
    email: config.email,
    github: config.github,
    linkedin: config.linkedin,
    twitter: config.twitter,
    website: config.website,
    cli: config.cli,
    sections: Object.entries(config.sections)
      .filter(([, enabled]) => enabled)
      .map(([section]) => section),
    design: config.design,
    ...(designInspirations.length > 0
      ? { design_inspirations: designInspirations }
      : {}),
    content: config.content,
    ai: config.ai,
    notes: config.notes,
  };

  return yaml.dump(output, {
    noRefs: true,
    lineWidth: 100,
  });
}

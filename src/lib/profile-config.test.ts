import * as yaml from "js-yaml";
import { describe, expect, it } from "vitest";
import {
  generateProfileYaml,
  parseDesignAttributes,
  type InspirationArchetype,
  type ProfileConfig,
} from "./profile-config";

const config: ProfileConfig = {
  name: 'Ava "AJ" Jones',
  email: "ava@example.com",
  github: "https://github.com/ava",
  linkedin: "",
  twitter: "",
  website: "",
  cli: "codex",
  sections: { hero: true, projects: true, blog: false },
  design: {
    creativity: 7,
    simplicity: 8,
    playfulness: 4,
    animation: 3,
    color_intensity: 5,
    notes: "",
  },
  content: { tone: "conversational", length: "concise", focus: "projects" },
  ai: { quality_bar: 8, research_depth: 6, copy_creativity: 5 },
  notes: "First line\nSecond: line",
};

const archetypes: InspirationArchetype[] = [
  {
    id: 1,
    name: "Minimal",
    description: "Quiet",
    color: "from-black to-white",
    examples: [
      {
        name: "Example",
        url: "https://example.com",
        screenshot: "/example.png",
        design: {
          typography: "Inter, 14-18px, 500 weight",
          colors: "Black #000000, white #ffffff, blue #5e6ad2",
          layout: "Centered, 1200px max",
          spacing: "80-120px, 40px padding",
          motion: "Subtle fades, 200ms",
          details: "1px border, rounded cards",
        },
      },
    ],
  },
];

describe("generateProfileYaml", () => {
  it("round-trips user text and enabled sections safely", () => {
    const output = generateProfileYaml(config, [], archetypes);
    const parsed = yaml.load(output) as Record<string, unknown>;

    expect(parsed.name).toBe(config.name);
    expect(parsed.notes).toBe(config.notes);
    expect(parsed.sections).toEqual(["hero", "projects"]);
  });

  it("includes only selected design inspirations", () => {
    const output = generateProfileYaml(config, ["https://example.com"], archetypes);
    const parsed = yaml.load(output) as { design_inspirations: Array<{ name: string }> };

    expect(parsed.design_inspirations).toEqual([
      expect.objectContaining({ name: "Example" }),
    ]);
  });
});

describe("parseDesignAttributes", () => {
  it("turns design descriptions into stable values", () => {
    expect(parseDesignAttributes(archetypes[0].examples[0].design)).toEqual(
      expect.objectContaining({
        fontFamily: "Inter",
        fontSize: 16,
        fontWeight: 500,
        maxWidth: 1200,
        sectionSpacing: 100,
      }),
    );
  });
});

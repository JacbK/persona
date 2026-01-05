---
name: design
description: Create unique visual designs by synthesizing from inspirations and preferences. Covers typography, color, layout, spacing, and animation philosophy.
---

# Skill: Design

Create a unique visual design by synthesizing from inspirations and preferences.

---

## Philosophy

**Don't follow templates.** Every portfolio should feel like it was designed specifically for this person.

- Blend inspirations, don't copy them
- Let the person's story drive the design
- Be bold - safe designs are forgettable

---

## Using Design Inspirations

If `design_inspirations` is provided in profile.yaml, each has attributes you can reference:

```yaml
design_inspirations:
  - name: "Linear"
    attributes:
      fontFamily: "Inter"
      fontSize: 15
      colorBg: "#000000"
      colorAccent: "#5e6ad2"
      maxWidth: 1200
      sectionSpacing: 100
      borderRadius: 0
      # ... etc
```

### How to Synthesize

Don't just average the values. Think about what makes each inspiration special:

1. **Identify the essence** of each inspiration
   - Linear: Clean precision, subtle animations, developer-focused
   - Stripe: Gradient magic, depth, polish
   - Brutalist site: Raw honesty, no decoration

2. **Find the common thread** for this person
   - What do their chosen inspirations say about their taste?
   - What feeling should the portfolio evoke?

3. **Create something new**
   - Take the typography approach from one
   - The color philosophy from another
   - The layout concept from a third
   - But make it cohesive

### Example Synthesis

User picked: Linear + Poolsuite + The Verge

- Linear → Clean typography, dark mode, precision
- Poolsuite → Playful, retro, personality
- The Verge → Bold headers, editorial feel

Synthesis: A dark, clean base (Linear) with playful accent moments (Poolsuite) and bold editorial typography (Verge). Not a mashup - a new thing.

---

## Typography

See `.agent/skills/fonts.md` for font selection.

**Rules**: 1-2 fonts max, clear hierarchy, match the person's vibe.

---

## Color

See `.agent/skills/colors.md` for palettes.

**Rules**: 60-30-10 ratio, good contrast, avoid purple/blue gradients.

---

## Layout

### Think Structure First

Before designing, ask:
- How much content does this person have?
- What's most important to show?
- How do visitors want to consume this?

### Avoid the Resume Trap

**Don't create a resume disguised as a website.** The rigid hero → about → experience → education → skills → contact structure is a failure state. That's what everyone does, and it makes every portfolio feel interchangeable.

Instead, think about:
- **What makes this person's story unique?** Lead with that.
- **What's the one thing visitors should remember?** Structure around it.
- **How can information flow naturally** instead of being boxed into sections?

Bad: "About Me" followed by "My Experience" followed by "My Skills"
Good: A narrative that weaves work, personality, and projects together

### Layout Options

| Approach | Good For |
|----------|----------|
| Single page scroll | Simple, narrative flow |
| Multi-page | Lots of content, distinct sections |
| Single screen | Minimal, high impact |
| Case study format | Project-focused, detailed work |
| Timeline/narrative | Career progression story |
| Interactive/exploratory | Creative technologists |
| Conversational/story | Personality-driven, writers |
| Work-first | Let projects speak, minimal bio |

### Breaking the Mold

Don't default to sections. Consider:
- What if there's no "About" section and the bio is woven throughout?
- What if projects aren't in a grid but in a narrative?
- What if the whole page is one big statement?
- What if experience is shown through projects instead of a job list?
- What if the contact isn't a section but integrated naturally?

---

## Spacing & Rhythm

### Principles

- **Generous whitespace** > cramped content
- **Consistent rhythm** - Pick a scale (8px, 16px, 32px, 64px) and stick to it
- **Let content breathe** - Especially on luxury/minimal designs

### From Inspirations

If inspirations have `sectionSpacing` and `padding` attributes, use them as starting points but adjust for the content.

---

## Animation & Motion

Based on `design.animation` preference (1-10):

| Level | Approach |
|-------|----------|
| 1-3 | Static, hover states only |
| 4-6 | Subtle page transitions, gentle fades |
| 7-8 | Scroll animations, choreographed entrance |
| 9-10 | Rich motion, interactive elements |

### Tools

- Tailwind transitions for simple effects
- Framer Motion for complex animations
- CSS animations for repeating motion

---

## Preference Sliders

### Creativity (1-10)
- Low: Safe, conventional, expected
- High: Experimental, surprising, risky

### Simplicity (1-10)
- Low: Dense, information-rich, complex
- High: Minimal, focused, essential only

### Playfulness (1-10)
- Low: Serious, professional, formal
- High: Fun, personality-driven, casual

### Color Intensity (1-10)
- Low: Monochrome, muted, subtle
- High: Vibrant, bold, saturated

---

## Making It Not Look AI-Generated

1. **Imperfection** - Slight asymmetry, varied spacing, human touches
2. **Specificity** - Generic = AI. Specific = human.
3. **Personality** - Let the person's voice come through
4. **Unexpected choices** - Do something that surprises
5. **Real content** - No placeholders, no lorem ipsum

---

## Execution Checklist

Before calling the design done:

- [ ] Typography creates clear hierarchy
- [ ] Colors work together and have meaning
- [ ] Layout serves the content (not the other way around)
- [ ] Spacing feels intentional
- [ ] Mobile experience is considered
- [ ] It doesn't look like a template
- [ ] It feels right for THIS person

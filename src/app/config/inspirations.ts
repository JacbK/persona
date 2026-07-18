import type { InspirationArchetype } from "@/lib/profile-config";


export const ARCHETYPE_EXAMPLES = [
  {
    id: 1,
    name: 'Brutalist',
    description: 'Sharp edges, monospace, high contrast',
    color: 'from-neutral-900 to-neutral-800',
    examples: [
      {
        name: 'Brutalist Web Design',
        url: 'https://brutalist-web.design',
        screenshot: '/inspirations/brutalist-web-design.png',
        design: {
          typography: 'System monospace, no custom fonts, 16px base',
          colors: 'Pure black/white, no grays, high contrast',
          layout: 'Single column, left-aligned, no grid, HTML default flow',
          spacing: 'Minimal padding, browser defaults, dense',
          motion: 'None - completely static',
          details: 'No shadows, underlined links, raw HTML aesthetic'
        }
      },
      {
        name: 'Neobrutalism',
        url: 'https://neobrutalism.dev',
        screenshot: '/inspirations/neobrutalism.png',
        design: {
          typography: 'Bold sans-serif headers (800+ weight), monospace body',
          colors: 'Black backgrounds, white text, neon accent (yellow/cyan)',
          layout: 'Boxy cards, thick borders (4-8px), no border-radius',
          spacing: 'Generous padding (24-48px), clear sections',
          motion: 'Sharp snap animations, no easing curves',
          details: 'Heavy drop shadows (8-12px), stark borders, grid-based'
        }
      },
      {
        name: 'Mono Company',
        url: 'https://mono.company',
        screenshot: '/inspirations/mono-company.png',
        design: {
          typography: 'Monospace everywhere (IBM Plex Mono), 14-16px',
          colors: 'True monochrome (black/white/grays), no color',
          layout: 'Fixed-width (1200px max), centered, strict grid',
          spacing: 'Consistent 8px grid, mathematical spacing',
          motion: 'Minimal hover states, fade transitions only',
          details: 'Thin borders (1px), subtle shadows, pixel-perfect alignment'
        }
      },
    ],
  },
  {
    id: 2,
    name: 'Editorial',
    description: 'Magazine layouts, serif headers',
    color: 'from-amber-900 to-amber-800',
    examples: [
      {
        name: 'NY Times',
        url: 'https://www.nytimes.com',
        screenshot: '/inspirations/nytimes.png',
        design: {
          typography: 'Georgia/Serif headers (28-48px), Sans body (16-18px)',
          colors: 'Black text, white bg, minimal red accents',
          layout: 'Multi-column grid, asymmetric breakup, sidebars',
          spacing: 'Tight line-height (1.4), dense paragraph spacing',
          motion: 'None - static content focus',
          details: 'Thin divider lines (1px), occasional images, text-heavy'
        }
      },
      {
        name: 'The Pudding',
        url: 'https://pudding.cool',
        screenshot: '/inspirations/pudding.png',
        design: {
          typography: 'Bold serif headlines (60-80px), sans body (18-21px)',
          colors: 'Vibrant accent colors, white/cream backgrounds',
          layout: 'Asymmetric columns (70/30 split), overlapping elements',
          spacing: 'Generous (100-200px section gaps), breathable',
          motion: 'Scroll-triggered animations, data visualizations',
          details: 'Large pull quotes, colored text blocks, image/text overlap'
        }
      },
      {
        name: 'The Verge',
        url: 'https://www.theverge.com',
        screenshot: '/inspirations/theverge.png',
        design: {
          typography: '__Optimist/serif headlines (32-56px), sans body (17px)',
          colors: 'Black/white base, neon accent (hot pink/lime)',
          layout: 'Card-based grid, featured hero, sidebar modules',
          spacing: 'Moderate (40-60px gaps), card padding (24px)',
          motion: 'Smooth image lazy-loads, hover scale effects',
          details: 'Rounded cards (8px), soft shadows, category tags'
        }
      },
    ],
  },
  {
    id: 3,
    name: 'Terminal',
    description: 'Command-line aesthetic, CRT colors',
    color: 'from-green-900 to-green-800',
    examples: [
      {
        name: 'Terminal Sexy',
        url: 'https://terminal.sexy',
        screenshot: '/inspirations/terminal-sexy.png',
        design: {
          typography: 'Monospace (Fira Code/JetBrains), 14px fixed',
          colors: 'Dark bg (#0d0d0d), green text (#00ff41), cursor blink',
          layout: 'Fixed-width (80ch), single column, text-only',
          spacing: 'Line-height 1.5, no padding, terminal default',
          motion: 'Blinking cursor, typewriter effect on load',
          details: 'ASCII borders, prompt symbols (>), CRT scanlines'
        }
      },
      {
        name: 'Robin Sloan',
        url: 'https://www.robinsloan.com',
        screenshot: '/inspirations/robin-sloan.png',
        design: {
          typography: 'Monospace (Courier/Consolas), 16px, serif fallback',
          colors: 'Black bg, white text, no colors',
          layout: 'Narrow column (60ch), left-aligned, essay format',
          spacing: 'Generous line-height (1.8), wide margins',
          motion: 'None - reading-focused',
          details: 'Underlined links, minimal decoration, text-first'
        }
      },
      {
        name: 'GitHub',
        url: 'https://github.com',
        screenshot: '/inspirations/github.png',
        design: {
          typography: 'Monospace code (SF Mono), sans UI (14px)',
          colors: 'Dark mode (#0d1117), white text, blue accents',
          layout: 'File tree sidebar, content main, 3-column',
          spacing: 'Compact (8-16px gaps), dense information',
          motion: 'Instant transitions, no delays',
          details: 'Syntax highlighting, line numbers, code blocks'
        }
      },
    ],
  },
  {
    id: 4,
    name: 'Retro Arcade',
    description: 'Pixel fonts, neon colors, 8-bit',
    color: 'from-fuchsia-900 to-purple-900',
    examples: [
      {
        name: 'Poolsuite',
        url: 'https://poolsuite.net',
        screenshot: '/inspirations/poolsuite.png',
        design: {
          typography: 'Rounded sans (Comic Sans-adjacent), 16-20px, playful',
          colors: 'Pastel (pink/blue/yellow), gradients, retro palette',
          layout: 'Centered cards, floating elements, sticker aesthetic',
          spacing: 'Varied (24-80px), playful asymmetry',
          motion: 'Wobble animations, parallax scrolling, float effects',
          details: 'Soft shadows, rounded corners (16-24px), illustrations'
        }
      },
      {
        name: 'Bruno Simon',
        url: 'https://bruno-simon.com',
        screenshot: '/inspirations/bruno-simon.png',
        design: {
          typography: 'Bold sans-serif, 14-18px, clean UI',
          colors: 'Dark bg, white text, colorful 3D elements',
          layout: '3D canvas full-screen, minimal UI overlay',
          spacing: 'UI elements: compact (12-16px), spacious canvas',
          motion: '3D physics, interactive elements, smooth 60fps',
          details: 'WebGL rendering, car/road metaphor, gamified'
        }
      },
      {
        name: 'Windows 93',
        url: 'https://www.windows93.net',
        screenshot: '/inspirations/windows93.png',
        design: {
          typography: 'Pixel font (Press Start 2P), 8-12px, bitmap',
          colors: 'Neon (magenta/cyan/yellow), black bg, high saturation',
          layout: 'OS window metaphor, draggable windows, desktop UI',
          spacing: 'Pixelated 8px grid, retro OS spacing',
          motion: 'Glitch effects, cursor trails, animated backgrounds',
          details: 'Pixel art icons, window chrome, 90s nostalgia'
        }
      },
    ],
  },
  {
    id: 5,
    name: 'Geometric',
    description: 'Color blocking, shapes, bold',
    color: 'from-blue-900 to-blue-800',
    examples: [
      {
        name: 'Linear',
        url: 'https://linear.app',
        screenshot: '/inspirations/linear.png',
        design: {
          typography: 'Inter/SF Pro, 14-16px, -0.02em tracking, 500 weight',
          colors: 'True black (#000), white (#fff), purple accent (#5e6ad2)',
          layout: 'Centered, max-width 1200px, symmetric grid',
          spacing: 'Generous (80-120px sections), 40px padding',
          motion: 'Subtle fades (200ms), smooth scroll, polished',
          details: 'No borders, soft gradients, clean edges, minimal'
        }
      },
      {
        name: 'Stripe',
        url: 'https://stripe.com',
        screenshot: '/inspirations/stripe.png',
        design: {
          typography: 'Camphor/sans-serif, 16-18px, medium weight',
          colors: 'White bg, black text, blue (#635bff) accent',
          layout: 'Asymmetric hero, grid-based content, diagonal dividers',
          spacing: 'Variable (60-100px), responsive scaling',
          motion: 'Animated gradients, smooth scroll reveals',
          details: 'Gradient meshes, geometric shapes, depth layers'
        }
      },
      {
        name: 'Vercel',
        url: 'https://vercel.com',
        screenshot: '/inspirations/vercel.png',
        design: {
          typography: 'Geist/mono hybrid, 14-16px, tight spacing',
          colors: 'True black (#000), white (#fff), no color',
          layout: 'Full-width sections, edge-to-edge, no max-width',
          spacing: 'Extreme (120-200px section gaps), minimal padding',
          motion: 'Fast (100ms), instant feedback, no delays',
          details: 'Thin borders (1px), sharp corners, monochromatic'
        }
      },
    ],
  },
  {
    id: 6,
    name: 'Luxury',
    description: 'Elegant serifs, large whitespace',
    color: 'from-stone-900 to-stone-800',
    examples: [
      {
        name: 'Apple',
        url: 'https://www.apple.com',
        screenshot: '/inspirations/apple.png',
        design: {
          typography: 'SF Pro Display, 21-80px headlines, light/medium weights',
          colors: 'White bg, black text, minimal color (product images)',
          layout: 'Large hero images, centered text, single column flow',
          spacing: 'Massive (150-300px gaps), generous padding',
          motion: 'Smooth scrollytelling, parallax, video backgrounds',
          details: 'High-res images, soft shadows, rounded corners (12px)'
        }
      },
      {
        name: 'Rolex',
        url: 'https://www.rolex.com',
        screenshot: '/inspirations/rolex.png',
        design: {
          typography: 'Serif headers (28-48px), light sans body (14-16px)',
          colors: 'Black/white/gold (#d4af37), minimal palette',
          layout: 'Narrow column (700px), centered, ample margins',
          spacing: 'Luxurious (100-200px), single element focus',
          motion: 'Slow fades (600ms), elegant transitions',
          details: 'Elegant dividers, gold accents, serif details'
        }
      },
      {
        name: 'Bottega Veneta',
        url: 'https://www.bottegaveneta.com',
        screenshot: '/inspirations/bottega-veneta.png',
        design: {
          typography: 'Light serif (300 weight), 18-24px, letter-spacing +0.05em',
          colors: 'Cream/beige bg, black text, earth tones',
          layout: 'Image-first, minimal text overlay, editorial flow',
          spacing: 'Extreme whitespace (200-400px), breathing room',
          motion: 'Slow reveals (800ms), lazy image loads',
          details: 'Thin borders, elegant typography, refined aesthetic'
        }
      },
    ],
  },
] satisfies InspirationArchetype[];

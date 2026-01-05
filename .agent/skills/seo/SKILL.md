---
name: seo
description: Optimize portfolios for search engines and set up analytics. Covers meta tags, OG images, structured data, analytics options, and performance optimization.
---

# Skill: SEO & Analytics

Optimize the portfolio for search engines and set up analytics to track visitors.

---

## SEO Essentials

### Meta Tags (in layout.tsx)

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Name | Role',
  description: 'One compelling sentence about what makes them unique.',
  keywords: ['developer', 'portfolio', 'react', ...relevant terms],
  authors: [{ name: 'Full Name' }],
  creator: 'Full Name',

  // Open Graph (social sharing)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com',
    siteName: 'Name Portfolio',
    title: 'Name | Role',
    description: 'Same compelling description',
    images: [{
      url: '/og-image.png',  // 1200x630px recommended
      width: 1200,
      height: 630,
      alt: 'Name - Role'
    }]
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Name | Role',
    description: 'Same compelling description',
    images: ['/og-image.png'],
    creator: '@twitterhandle'
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  }
}
```

### OG Image

Create `/public/og-image.png` (1200x630px) with:
- Name prominently displayed
- Role/title
- Simple, on-brand design
- No small text (won't be readable)

**Quick option**: Use a solid color background with large text.

### Favicon

Add these to `/public`:
- `favicon.ico` (32x32)
- `apple-touch-icon.png` (180x180)
- `favicon-16x16.png`
- `favicon-32x32.png`

In layout.tsx:
```typescript
export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}
```

---

## Content SEO

### Title Strategy

```
Homepage: "Name | Role" or "Name - Tagline"
  Example: "Jane Doe | Senior Frontend Engineer"
  Example: "Jane Doe - Building beautiful web experiences"
```

Keep under 60 characters.

### Description

```
150-160 characters that:
- Say who they are
- Mention key skills/focus
- Include a hook
```

Example: "Frontend engineer specializing in React and TypeScript. Building fast, accessible web apps. Previously at Stripe, now freelancing."

### Structured Data (JSON-LD)

Add to layout.tsx for rich search results:

```typescript
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Full Name',
              url: 'https://example.com',
              jobTitle: 'Role',
              sameAs: [
                'https://github.com/username',
                'https://linkedin.com/in/username',
                'https://twitter.com/username'
              ]
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## Analytics Options

### 1. Vercel Analytics (Recommended for Vercel deployments)

```bash
npm install @vercel/analytics
```

In layout.tsx:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Pros**: Zero config on Vercel, privacy-friendly, free tier
**Enable**: Vercel Dashboard → Project → Analytics tab

### 2. Vercel Speed Insights

```bash
npm install @vercel/speed-insights
```

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next'

// Add alongside Analytics
<SpeedInsights />
```

### 3. Plausible (Privacy-focused)

```typescript
// In layout.tsx <head>
<script
  defer
  data-domain="yourdomain.com"
  src="https://plausible.io/js/script.js"
/>
```

**Pros**: Privacy-first, no cookie banner needed, simple dashboard
**Cost**: $9/month or self-host free

### 4. Google Analytics

```bash
npm install @next/third-parties
```

```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

**Note**: May require cookie consent banner in EU.

### 5. Simple Page Views (Self-hosted)

For minimal tracking, create an API route:

```typescript
// app/api/view/route.ts
export async function POST(request: Request) {
  const { page } = await request.json()
  // Log to your preferred service (database, file, etc.)
  console.log(`Page view: ${page}`)
  return Response.json({ success: true })
}
```

---

## Search Console Setup

### Google Search Console

1. Go to: https://search.google.com/search-console
2. Add property (URL prefix method)
3. Verify with HTML file or DNS

**Add verification file:**
Download `googleXXXXXXX.html` to `/public`

Or add meta tag to layout.tsx:
```typescript
export const metadata: Metadata = {
  verification: {
    google: 'your-verification-code',
  },
}
```

### Bing Webmaster Tools

1. Go to: https://www.bing.com/webmasters
2. Import from Google Search Console (easiest)
3. Or verify manually

---

## Sitemap & Robots

### Sitemap (Auto-generated by Next.js)

Create `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // Add additional pages if multi-page
  ]
}
```

### Robots.txt

Create `app/robots.ts`:

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

---

## Performance Optimization

### Images

```typescript
import Image from 'next/image'

// Always use next/image for optimization
<Image
  src="/photo.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
  priority  // For above-the-fold images
/>
```

### Check Performance

Run Lighthouse audit:
1. Open Chrome DevTools
2. Lighthouse tab
3. Generate report

Target scores:
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

---

## Quick Checklist

**Before Launch:**
- [ ] Title and description set
- [ ] OG image created (1200x630)
- [ ] Favicon added
- [ ] All images have alt text
- [ ] Structured data added
- [ ] Analytics installed

**After Launch:**
- [ ] Submit to Google Search Console
- [ ] Verify sitemap accessible
- [ ] Run Lighthouse audit
- [ ] Test social sharing (share on Twitter/LinkedIn to preview)

---

## Common Issues

### OG Image Not Showing

- Must be absolute URL in production
- File must be in `/public`
- Clear social media cache:
  - Twitter: https://cards-dev.twitter.com/validator
  - LinkedIn: https://www.linkedin.com/post-inspector/
  - Facebook: https://developers.facebook.com/tools/debug/

### Slow Page Load

- Optimize images (use WebP/AVIF)
- Check for large JS bundles
- Use `next/dynamic` for heavy components
- Enable Vercel Edge caching

### Not Indexed

- Check robots.txt isn't blocking
- Submit sitemap to Search Console
- Wait 1-2 weeks for indexing
- Request indexing manually in Search Console

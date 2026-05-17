# InsightTube 2.0 — Design System

> **AI-Powered YouTube Analytics SaaS**
> A cinematic, premium design system built for creators who demand precision.

---

## 1. Brand Identity

### Brand Name
**InsightTube AI** — Precision Analytics for YouTube Creators

### Brand Personality
- **Premium & Professional** — Enterprise-grade feel, not hobbyist
- **Cinematic & Dynamic** — Every interaction feels alive
- **Data-Driven & Intelligent** — AI-first, visually intelligent
- **Bold & Confident** — Strong typographic hierarchy, assertive CTAs

### Tagline
*"AI That Engineers Your YouTube Growth."*

---

## 2. Color Palette

### Primary Brand Color
| Token | Hex | Usage |
|---|---|---|
| `brand-red` | `#FF2B2B` | Primary CTA, accent, gradients, active states |
| `brand-red-hover` | `#E0002A` | Hover state for primary actions |
| `brand-red-deep` | `#CC0000` | Gradient terminus, shadows |
| `brand-red-light` | `#FF4D4D` | Gradient midpoint, softer highlights |

### Dashboard Red Variants
| Token | Hex | Context |
|---|---|---|
| `dashboard-red` | `#FF1744` | Dashboard primary accent (light mode) |
| `dashboard-red-dark` | `#FF3B3B` | Dashboard primary accent (dark mode) |

### Neutral Scale
| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `bg-primary` | `#F5F5F7` | `#070707` | Page background (landing) |
| `bg-dashboard` | `#F5F5F7` / `#F8F9FA` | `#0B0B0F` | Dashboard/settings background |
| `bg-card` | `white / 75%` | `#121218 / 75%` | Card surfaces |
| `bg-card-alt` | `#F5F5F7 / 80%` | `#1A1A24 / 50%` | Nested/inset surfaces |
| `bg-elevated` | `white` | `#2A2A35` | Elevated pill/icon backgrounds |
| `text-primary` | `#111111` | `#FFFFFF` | Headings, primary text |
| `text-secondary` | `#555555` | `#A1A1AA` | Body text, descriptions |
| `text-muted` | `#666666` | `#A1A1AA` | Labels, metadata |
| `border-subtle` | `rgba(0,0,0,0.05)` | `rgba(255,255,255,0.06)` | Card borders, dividers |
| `border-input` | `gray-200` | `gray-800` | Form input borders |

### Semantic Colors
| Token | Value | Usage |
|---|---|---|
| `success` | `#10B981` | Connected status, positive trend |
| `info` | `#00B4D8` | Secondary data, subscriber badge |
| `warning` | `#F59E0B` | Caution states |
| `danger` | `#FF1744` | Danger zone, destructive actions |

### Accent Opacity Scale
Used extensively for backgrounds and glows:
- `/5` — Ambient glow spheres, background tints
- `/10` — Active nav highlight, feature icon background, hover tint
- `/20` — Focus ring, glow intensity (dark mode)
- `/30` — Button shadow, shimmer overlay
- `/40` — Backdrop blur, mouse glow opacity
- `/50` — Hover shadow intensity

---

## 3. Typography

### Font Family
**Inter** — loaded via Google Fonts with weights 400–900.

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Type Scale
| Element | Size | Weight | Tracking | Context |
|---|---|---|---|---|
| Hero Title | `text-6xl` → `text-9xl` | 900 (Black) | `tracking-tighter` | Main headline, gradient text |
| Hero Subtitle | `text-3xl` → `text-6xl` | 700 (Bold) | `tracking-tight` | Supporting headline |
| Section Title | `text-4xl` → `text-5xl` | 900 (Black) | `tracking-tight` | Feature/pricing section heads |
| Card Title | `text-xl` → `text-2xl` | 700 (Bold) | default | Card headings |
| Dashboard Metric | `text-3xl` | 900 (Black) | `tracking-tight` | KPI values |
| Section Label | `text-[10px]` → `text-xs` | 700 (Bold) | `tracking-widest uppercase` | Category labels, metadata |
| Body | `text-sm` → `text-lg` | 400–500 | default | Paragraphs, descriptions |
| Button | `text-sm` → `text-lg` | 600–700 (Semibold–Bold) | default | CTA labels |
| Input Label | `text-[11px]` | 700 (Bold) | `tracking-wider uppercase` | Floating labels |
| Legal/Caption | `text-xs` | 400 | default | Footer, fine print |

### Logo Typography
- **"InsightTube"** — `text-xl` to `text-2xl`, `font-extrabold` / `font-black`, color `brand-red`
- **"AI Command Center"** — `text-[10px]`, `font-bold`, `tracking-widest uppercase`, muted color

---

## 4. Spacing & Layout

### Max Widths
| Context | Width |
|---|---|
| Landing page content | `max-w-7xl` (1280px) |
| Hero content | `max-w-5xl` |
| Settings page | `max-w-[1400px]` |
| Dashboard main | `max-w-7xl` |
| Description paragraphs | `max-w-2xl` |

### Section Padding
- Landing sections: `py-24 px-6`
- Dashboard main: `p-8`
- Cards: `p-6` → `p-8` → `p-10`
- Form insets: `p-4` → `p-6`

### Grid System
| Context | Columns |
|---|---|
| Feature cards | `1 / 2 / 3` cols (responsive) |
| Pricing cards | `1 / 3` cols |
| Dashboard stats | `1 / 2 / 4` cols |
| Dashboard main + sidebar | `1 / 3` cols (2:1 split) |
| Settings layout | Sidebar (72/w-72) + Content (flex-1, max-w-4xl) |
| Form fields | `1 / 2` cols |

### Dashboard Layout
- **Sidebar**: Fixed left, `w-64`, full height
- **Top Nav**: Fixed top, `h-20`, `ml-64`
- **Main Content**: `ml-64`, `pt-20`

---

## 5. Shape & Borders

### Border Radius
| Token | Value | Usage |
|---|---|---|
| `rounded-full` | 9999px | Avatars, pills, toggles, notification dots |
| `rounded-[2rem]` / `rounded-[28px]` | 28–32px | Settings section cards, modals |
| `rounded-3xl` | 24px | Dashboard cards, stat cards |
| `rounded-2xl` | 16px | Glass cards, inner cards, nav items |
| `rounded-xl` | 12px | Buttons, inputs, form fields |
| `rounded-lg` | 8px | Nav links, small thumbnails |

### Borders
- Cards: `border border-black/5 dark:border-white/[0.06]`
- Inputs: `border border-gray-200 dark:border-gray-800`
- Active/popular: `ring-2 ring-brand-red`
- Danger zone: `border border-red-200 dark:border-red-900/30`
- Dashed empty states: `border-2 border-dashed border-gray-200 dark:border-gray-800`

---

## 6. Elevation & Shadows

### Shadow Scale
| Level | Value | Usage |
|---|---|---|
| Subtle | `shadow-sm` | Default card elevation |
| Standard | `shadow-lg` | Navbar, elevated cards |
| Dramatic | `shadow-xl` | Hover state on cards |
| Cinematic (dark) | `shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_-10px_rgba(255,43,43,0.15)]` | Glass card dark mode |
| Brand glow | `shadow-[0_0_20px_rgba(255,23,68,0.3)]` | Primary buttons |
| Brand glow hover | `shadow-[0_0_25px_rgba(255,23,68,0.5)]` | Primary button hover |
| Soft container | `shadow-[0_8px_30px_rgb(0,0,0,0.04)]` / `dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]` | Settings cards |

---

## 7. Glassmorphism System

The design system's signature visual treatment. Applied via `.glass-card` and `.nav-blur` utility classes.

### Glass Card
```css
/* Light Mode */
background: rgba(255, 255, 255, 0.70);
backdrop-filter: blur(24px);        /* backdrop-blur-xl */
border: 1px solid rgba(0, 0, 0, 0.08);
border-radius: 16px;                /* rounded-2xl */
box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);

/* Dark Mode */
background: rgba(17, 17, 17, 0.50);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 0 30px 60px -15px rgba(0,0,0,0.8), 0 0 40px -10px rgba(255,43,43,0.15);
```

### Dashboard Card
```css
/* Light Mode */
background: rgba(255, 255, 255, 0.75);
backdrop-filter: blur(24px);        /* backdrop-blur-xl */
border: 1px solid rgba(0, 0, 0, 0.05);
border-radius: 24px;                /* rounded-3xl */

/* Dark Mode */
background: rgba(18, 18, 24, 0.75);
border: 1px solid rgba(255, 255, 255, 0.06);
```

### Nav Blur
```css
backdrop-filter: blur(40px);        /* backdrop-blur-2xl */
background: rgba(255, 255, 255, 0.60);   /* light */
background: rgba(7, 7, 7, 0.60);         /* dark */
```

---

## 8. Motion & Animation

### Library
**Framer Motion** (`framer-motion ^12.38.0`) — used for all interactive animations.

### Entrance Animations
| Pattern | Config | Usage |
|---|---|---|
| Fade In | `opacity: 0 → 1`, 0.5s ease-out | General reveal |
| Slide Up | `y: 20→0, opacity: 0→1`, 0.5–0.8s | Cards, sections, staggered lists |
| Scale In | `scale: 0.95→1, opacity: 0→1` | Modals, main graph |
| Slide Right | `x: 20→0, opacity: 0→1` | Live activity panel |
| Stagger | `delay: 0.1 × index` | Stat cards, table rows, activity items |

### Interaction Animations
| Pattern | Config | Usage |
|---|---|---|
| Hover Lift | `y: -2 → -5px`, `transition-all duration-300–500` | Feature cards, stat cards, channel rows |
| Scale Bounce | `hover:scale-105`, `active:scale-95` | Buttons, avatars |
| Active Pill (layoutId) | Spring: `stiffness: 350–400, damping: 30` | Navbar, sidebar, auth tabs, date tabs |
| Theme Toggle | Rotate 90°, slide Y, `mode="wait"` | Sun/Moon icon swap |
| Button Shimmer | `translateX: -100% → 100%`, 1.5s infinite | Primary CTA hover |

### Background Animations
| Pattern | Config | Usage |
|---|---|---|
| Floating Elements | `y: [0, -15, 0]`, 5–6s infinite | Hero floating badges |
| Ambient Pulse | `animate-pulse` | Background glow spheres |
| Mouse Glow | Spring-based cursor tracking | `GlowBackground` component |
| Progress Bar | `width: 0 → 75%`, 1s | Stat card micro-bars |
| Underline Reveal | `width: 0% → 100%`, 1s delay | Hero subtitle decoration |

### 3D Perspective Effect
Hero section uses cursor-responsive 3D tilt:
```
perspective: 1000px
rotateX: ±10°  (Y-axis mouse)
rotateY: ±10°  (X-axis mouse)
spring: stiffness 150, damping 20
translateZ: 20–50px (layered depth)
```

### Timing Functions
- Standard: `duration-300` (300ms)
- Smooth: `duration-500` (500ms)
- Dramatic: `duration-700` (700ms)
- Cubic: `cubic-bezier(0.2, 0.8, 0.2, 1)` — slide-up entrance
- Spring: `type: "spring"` — layout animations

---

## 9. Component Patterns

### Buttons

#### Primary (`.btn-primary`)
```css
background: linear-gradient(to bottom-right, #FF2B2B, #DA0000);
color: white;
padding: 10px 24px;
border-radius: 12px;
font-weight: 600;
box-shadow: 0 10px 15px -3px rgba(255,43,43,0.3);
/* hover: shadow grows, scale 1.05, translateY -2px */
/* active: scale 0.95 */
/* shimmer overlay on hover */
```

#### Ghost (`.btn-ghost`)
```css
padding: 10px 24px;
border-radius: 12px;
font-weight: 600;
color: #555555;  /* dark: gray-400 */
/* hover: text darkens, bg brand-red/5 */
```

#### Secondary (Dashboard)
```css
background: #111111;  /* dark: white */
color: white;          /* dark: #111111 */
border-radius: 12px;
/* Inverted color scheme for contrast */
```

#### Destructive
```css
background: linear-gradient(to right, #FF1744, #B9001D);
color: white;
box-shadow: 0 10px 15px rgba(220,38,38,0.2);
```

### Cards
1. **Glass Card** — Landing page: glassmorphism, hover lift
2. **Dashboard Card** — Semi-transparent, `rounded-3xl`, subtle border
3. **Settings Card** — Solid bg, `rounded-[28px]`, soft shadow, hover glow reveal
4. **Stat Card** — Gradient progress bar, oversized background icon, trend badge

### Inputs
- Floating label pattern (Settings page)
- Icon-prefixed pattern (Auth modal)
- Unified style: `bg-transparent border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3`
- Focus: `border-[#FF1744] ring-1 ring-[#FF1744]`

### Toggles
Custom toggle: `w-12 h-6` track, `w-5 h-5` thumb, checked = `bg-[#FF1744]`

### Navigation
- **Floating Navbar** — Centered, max-width, glassmorphism, scroll-responsive positioning
- **Sidebar** — Fixed left, 64px wide, spring-animated active indicator
- **Tabs** — `layoutId` animated active pill

---

## 10. Background & Atmosphere

### Landing Page (`GlowBackground`)
1. **Gradient base**: `from-[#f5f5f7] to-[#e8e8ea]` / `dark: from-[#070707] to-[#110505]`
2. **Grid overlay**: 40px grid, masked gradient, `opacity-30` / `dark:opacity-20`
3. **Noise texture**: SVG fractalNoise, `opacity-3%` / `dark:opacity-5%`
4. **Ambient spheres**: 600–800px radial glows, `brand-red/5–10%`, blur 100–120px, `animate-pulse`
5. **Mouse glow**: Dual-layer cursor-following radial gradient, spring-interpolated

### Dashboard Background (Dark Mode)
1. Two large `brand-red/5` blurred spheres (top-right, bottom-left)
2. Dot pattern via base64 SVG, `opacity-50`

### Settings Background
Ambient glows: `brand-red/10` and `blue-500/5`, positioned top-right and bottom-left

---

## 11. Dark Mode Strategy

**Implementation**: `class`-based toggle via `html.dark`.
**Persistence**: `localStorage.getItem('theme')`, fallback to `prefers-color-scheme`.

### Key Transformations
| Element | Light | Dark |
|---|---|---|
| Page BG | `#F5F5F7` | `#070707` / `#0B0B0F` |
| Card BG | `white/75%` | `#121218/75%` |
| Text Primary | `#111111` | `#FFFFFF` |
| Text Secondary | `#555555` / `#666666` | `#A1A1AA` |
| Borders | `rgba(0,0,0,0.05–0.08)` | `rgba(255,255,255,0.06–0.10)` |
| Brand Red | `#FF1744` / `#FF2B2B` | `#FF3B3B` |
| Glow intensity | Lower opacity | Higher opacity |
| Blend mode (cursor) | `mix-blend-multiply` | `mix-blend-screen` |

---

## 12. Iconography

### Library
**Lucide React** (`lucide-react ^1.14.0`)

### Sizing Convention
| Context | Size |
|---|---|
| Navigation icons | 18–20px |
| Feature card icons | 24px |
| Button inline icons | 18–20px |
| Stat card background | 80px (decorative) |
| Input prefix icons | 18px |
| Toggle/action icons | 14–16px |
| Danger/alert | 24px |

### Icon Styling
- Default: `text-[#666666] dark:text-[#A1A1AA]`
- Active: `text-brand-red` / `text-[#FF1744] dark:text-[#FF3B3B]`
- Contained: In `rounded-full` or `rounded-xl` background with `bg-brand-red/10`

---

## 13. Charts & Data Visualization

### Library
**Recharts** (`recharts ^3.8.1`)

### Theme
| Element | Style |
|---|---|
| Primary stroke | `#FF1744`, `strokeWidth: 4` |
| Area fill | Linear gradient: `#FF1744/30%` → `#FF1744/0%` |
| Line glow | `drop-shadow: rgba(255,23,68,0.5–0.8)` |
| Tooltip BG | `rgba(18,18,24,0.9)`, `border-radius: 12px` |
| Tooltip text | White, bold accent in `#FF3B3B` |
| Cursor line | `rgba(255,23,68,0.2)`, dashed |
| Pie chart | `innerRadius: 80, outerRadius: 100, paddingAngle: 5` (donut) |
| Custom grid | Column dividers via absolute-positioned borders |

### Data Colors
- Primary data: `#FF1744`
- Secondary data: `#00B4D8`
- Neutral data: `#E0E0E0`

---

## 14. Responsive Breakpoints

Follows Tailwind defaults:
| Prefix | Min Width | Usage |
|---|---|---|
| `sm` | 640px | Button layout shifts, sign-in visibility |
| `md` | 768px | Grid 2-col, desktop nav links, form grids |
| `lg` | 1024px | Grid 3-col, floating hero elements, date tabs |
| `xl` | 1280px | Dashboard 3-col main grid |

### Mobile Patterns
- Hamburger menu with AnimatePresence dropdown
- Single-column card layouts
- Hidden floating hero badges (`hidden lg:flex`)
- Touch-friendly tap targets (min 44px)

---

## 15. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 19.2.5 |
| Build | Vite | 8.0.10 |
| Styling | Tailwind CSS | 4.2.4 |
| Animations | Framer Motion | 12.38.0 |
| Icons | Lucide React | 1.14.0 |
| Charts | Recharts | 3.8.1 |
| Routing | React Router DOM | 7.14.2 |
| Backend | Supabase (Auth + Realtime + Postgres) | 2.105.3 |
| Notifications | React Hot Toast | 2.6.0 |
| Font | Inter (Google Fonts) | 400–900 |

---

## 16. File Architecture

```
src/
├── App.jsx                    # Root router + providers
├── main.jsx                   # React DOM entry
├── index.css                  # Global design tokens + utility classes
│
├── components/
│   ├── Navbar.jsx             # Floating glassmorphic navbar
│   ├── Hero.jsx               # 3D perspective hero with CTA
│   ├── Features.jsx           # 6-card feature grid
│   ├── Pricing.jsx            # 3-tier pricing with toggle
│   ├── Footer.jsx             # Minimal footer
│   ├── GlowBackground.jsx    # Cursor-reactive ambient glow
│   ├── AuthModal.jsx          # Auth modal (sign in / sign up)
│   ├── ConnectionStatus.jsx   # Supabase connection indicator
│   └── ErrorBoundary.jsx      # React error boundary
│
├── context/
│   └── AuthContext.jsx        # Auth state + session management
│
├── layouts/
│   ├── MainLayout.jsx         # Landing page shell (Navbar + Footer)
│   └── DashboardLayout.jsx    # Dashboard shell (Sidebar + TopNav)
│
├── lib/
│   └── supabase.js            # Supabase client + API functions
│
├── pages/
│   ├── Home.jsx               # Landing page composition
│   ├── Features.jsx           # Features page
│   ├── Pricing.jsx            # Pricing page
│   ├── Dashboard.jsx          # Main analytics dashboard
│   ├── Settings.jsx           # Full settings experience
│   ├── Login.jsx              # (redirects to dashboard)
│   └── Signup.jsx             # (redirects to dashboard)
│
├── hooks/                     # (Reserved for custom hooks)
├── utils/                     # (Reserved for utility functions)
└── assets/                    # Static assets
```

---

## 17. Design Principles

1. **Cinematic First** — Every surface has depth: glows, blurs, gradients, and layered shadows create a theatrical atmosphere.

2. **Motion as Meaning** — Animations aren't decorative; they communicate state changes, hierarchy, and spatial relationships via spring physics and layout animations.

3. **Glass & Light** — Glassmorphism is the primary surface treatment. Semi-transparent cards with backdrop-blur create depth without visual heaviness.

4. **Red Thread** — `brand-red` runs through every interaction: CTAs, active states, glows, gradients, chart strokes, and notification accents. It's the brand's heartbeat.

5. **Dark Mode Native** — Dark mode isn't an afterthought. The entire palette, glow system, and shadow strategy are tuned for both modes with distinct dark-mode tokens.

6. **Data Density** — Dashboard layouts prioritize information density without clutter, using micro-typography labels, compact stat cards, and inline progress indicators.

7. **Touch-Ready Desktop** — Generous tap targets, hover-lift affordances, and spring-animated state transitions make the interface feel physically responsive.

---

*Last updated: May 2026*
*InsightTube 2.0 — Precision Analytics for Creators*

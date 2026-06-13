<div align="center">

# Box Siege — Official Game Website

**Interactive Game Showcase — React + TypeScript + Vite + Framer Motion**

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.3-646cff?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-06b6d4?logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4-0055ff?logo=framer)](https://www.framer.com/motion)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000000)](https://ui.shadcn.com)
[![License](https://img.shields.io/badge/License-Unlicensed-lightgrey)](./LICENSE)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Live Preview](#live-preview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages and Sections](#pages-and-sections)
- [Component Reference](#component-reference)
  - [BoxSiegeSite.tsx](#boxsiegesitetsx)
  - [CharacterShowcase.tsx](#charactershowcasetsx)
  - [WeaponShowcase.tsx](#weaponshowcasetsx)
  - [KeybindShowcase.tsx](#keybindshowcasetsx)
  - [ThemeToggle.tsx](#themetoggletsx)
- [Data Layer](#data-layer)
  - [Characters](#characters)
  - [Weapons](#weapons)
  - [Maps](#maps)
  - [Power-Ups](#power-ups)
  - [Melee Weapons](#melee-weapons)
- [Default Keybindings](#default-keybindings)
- [Asset Structure](#asset-structure)
- [Theming System](#theming-system)
- [Animations and Motion](#animations-and-motion)
- [Audio System](#audio-system)
- [Navigation and Scroll Behavior](#navigation-and-scroll-behavior)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Build and Deployment](#build-and-deployment)
- [Configuration Reference](#configuration-reference)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This repository contains the official website for **Box Siege**, a local-multiplayer 2D PvP game developed by **Equinox Interactive**. The site is the primary public-facing showcase for the game: it introduces the roster of playable characters, the weapon arsenal, the game's four stages, power-up items, default keybindings for all four players, and a direct download link for the Windows beta.

The site is a fully client-side single-page application (SPA) built with React 19, TypeScript 5.8, and Vite 7. All animations are driven by Framer Motion. UI primitives are sourced from shadcn/ui backed by Radix UI. The styling layer is Tailwind CSS v4 via the official Vite plugin — no PostCSS config is needed. A dark/light theme toggle with a custom View Transition API ripple effect is included.

The showcase components are fully interactive: characters can be previewed in idle or death pose, weapons display animated stat bars with heart and bullet iconography pulled directly from the game, maps are browsable with a full-screen lightbox, and the keybind panel responds to real keyboard input on desktop and tap events on mobile.

---

## Live Preview

The website is deployed at:

```
https://box-siege.vercel.app/
```

---

## Tech Stack

| Layer | Library / Tool | Version |
|---|---|---|
| Framework | React | 19.2 |
| Language | TypeScript | 5.8 |
| Build tool | Vite | 7.3 |
| Styling | Tailwind CSS (Vite plugin) | 4.2 |
| Animation | Framer Motion | 12.4 |
| UI primitives | Radix UI (via shadcn/ui) | latest |
| Routing | React Router DOM | 7.1 |
| Icons | Lucide React | 0.575 |
| Forms | React Hook Form + Zod | 7.71 / 3.24 |
| Toast notifications | Sonner | 2.0 |
| Charts | Recharts | 2.15 |
| Linting | ESLint + typescript-eslint | 9.32 |
| Path resolution | vite-tsconfig-paths | 6.0 |
| Package manager | Bun | (bun.lock present) |

> **Note on package manager.** The repository ships a `bun.lock` file, which means the project was developed using [Bun](https://bun.sh). You can use npm, pnpm, or Bun interchangeably — the lock file format does not restrict which runtime installs the project.

---

## Project Structure

```
box-siege-site/
├── public/
│   └── assets/
│       ├── BGM/
│       │   └── BGM 1.MP3             -- Background music (looped, volume 0.4)
│       ├── FONT/
│       │   └── BADABOOM.TTF          -- Custom display font used for headings
│       ├── Fix.jpg                   -- Spinning disc for the audio control button
│       ├── IMG/
│       │   ├── P1/                   -- Player 1 character sprites & gun
│       │   ├── P2/                   -- Player 2 character sprites & gun
│       │   ├── P3/                   -- Player 3 character sprites & gun
│       │   ├── P4/                   -- Player 4 character sprites & gun
│       │   ├── itempowerup/          -- Power-up item icons (4 items)
│       │   ├── stage/                -- Stage thumbnail images (4 stages)
│       │   ├── stage in game/        -- Full-resolution in-game stage art
│       │   ├── ui/
│       │   │   ├── heart.png         -- Damage display heart icon
│       │   │   └── bullet.png        -- Ammo display bullet icon
│       │   └── how to play.png       -- How-to-play reference image
│       ├── KEYBIND/
│       │   ├── P1/                   -- Six keybind action icons for Player 1
│       │   ├── P2/                   -- Six keybind action icons for Player 2
│       │   ├── P3/                   -- Six keybind action icons for Player 3
│       │   └── P4/                   -- Six keybind action icons for Player 4
│       ├── VIDS/
│       │   ├── BG.mp4                -- Hero section fullscreen background video
│       │   ├── SC.mp4                -- Gameplay footage shown in download section
│       │   └── preview/
│       │       ├── Speed-Preview.mp4
│       │       ├── Jump-Preview.mp4
│       │       ├── Heal-Preview.mp4
│       │       └── Shield-Preview.mp4
│       └── WEAPON/
│           ├── P1/                   -- Weapon sprites for Player 1 (6 weapons)
│           ├── P2/                   -- Weapon sprites for Player 2 (6 weapons)
│           ├── P3/                   -- Weapon sprites for Player 3 (6 weapons)
│           └── P4/                   -- Weapon sprites for Player 4 (6 weapons)
├── src/
│   ├── components/
│   │   ├── BoxSiegeSite.tsx          -- Root page component; composes all sections
│   │   ├── CharacterShowcase.tsx     -- Interactive 4-player character browser
│   │   ├── WeaponShowcase.tsx        -- Weapon stats panel with animated stat bars
│   │   ├── KeybindShowcase.tsx       -- Interactive 3D keycap layout, keyboard-driven
│   │   ├── ThemeToggle.tsx           -- Dark/light toggle with View Transition ripple
│   │   └── ui/                       -- shadcn/ui generated primitives (do not edit by hand)
│   ├── data/
│   │   └── content.ts                -- All static game data: characters, weapons, maps, power-ups
│   ├── hooks/
│   │   └── use-mobile.tsx            -- Breakpoint hook for responsive logic
│   ├── lib/
│   │   └── utils.ts                  -- cn() Tailwind class merging utility
│   ├── App.tsx                       -- React Router setup and provider tree
│   ├── main.tsx                      -- Application entry point
│   └── styles.css                    -- Global CSS: custom properties, keyframes, utility classes
├── components.json                   -- shadcn/ui configuration
├── eslint.config.js                  -- ESLint flat config
├── index.html                        -- Vite HTML entry; imports BADABOOM font via @font-face
├── package.json
├── bunfig.toml                       -- Bun configuration
├── tsconfig.json
├── vercel.json                       -- SPA fallback rewrite rule for Vercel
└── vite.config.ts                    -- Vite plugins and path alias
```

---

## Pages and Sections

The application is a single-page layout composed in `BoxSiegeSite.tsx`. All navigation is smooth-scroll anchor-based. React Router is present only for the 404 fallback and future multi-page expansion.

| Anchor | Component / Function | Description |
|---|---|---|
| `#home` | `Hero` | Full-screen video background, parallax scroll effect, two CTA buttons |
| `#features` | `Features` | Three feature cards (Local Play, Gameplay, Custom Keybinds) plus `KeybindShowcase` |
| `#characters` | `Characters` + `CharacterShowcase` | Per-player character browser with idle/death sprite toggle |
| `#weapons` | `Weapons` + `WeaponShowcase` | Weapon selector with animated stat bars and secondary weapon support |
| `#maps` | `Maps` | Stage browser with floating map art, accent theming, and full-screen lightbox |
| `#power-ups` | `PowerUps` | Power-up selector with live video preview |
| `#download` | `DownloadSection` | Minimum requirements, gameplay video, and Windows download link |

The composition at the root level:

```tsx
// src/components/BoxSiegeSite.tsx
export default function BoxSiegeSite() {
  useInitTheme();
  return (
    <div className="relative min-h-screen bg-black text-white">
      <AudioControl />
      <ThemeToggle variant="fixed" />
      <Header />
      <main>
        <Hero />
        <Features />
        <Characters />
        <Weapons />
        <Maps />
        <PowerUps />
        <DownloadSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
```

---

## Component Reference

### BoxSiegeSite.tsx

The root page component. It is self-contained: `Header`, `Hero`, `Features`, `Characters`, `Weapons`, `Maps`, `PowerUps`, `DownloadSection`, `Footer`, `BackToTop`, and `AudioControl` are all defined and composed in this single file. The only external component imports are `CharacterShowcase`, `WeaponShowcase`, `KeybindShowcase`, and `ThemeToggle`.

**Header** tracks three scroll-driven states: whether the page is scrolled past 40px (activates the frosted-glass backdrop), which section is currently active (for the underline indicator), and whether the mobile menu is open. On mobile, closing the menu defers the scroll by two `requestAnimationFrame` calls to ensure the `overflow: hidden` scroll lock has been released before `scrollIntoView` runs:

```tsx
const handleMobileNav = (id: string) => {
  setOpen(false);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
};
```

**Hero** uses Framer Motion's `useScroll` and `useTransform` hooks to create a parallax fade effect. As the user scrolls down, the hero content drifts upward by up to 200px and fades out:

```tsx
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
```

**Section** is a reusable wrapper used by Features, Maps, Power-Ups, and Download. It provides a `whileInView` entrance animation on its heading, accepts an optional `kicker` label above the title, and constrains its content to `max-w-7xl`.

**Maps** manages a selected map index in local state. Each map entry has an `accent` color used to tint the background radial gradient, the floating ring, the stat chip, and the tab indicator. The selected map's full-resolution image is shown in a lightbox modal with a scroll-lock hook (`useScrollLock`) to prevent background scroll while it is open:

```tsx
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (active) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [active]);
}
```

**PowerUps** follows the same accent-driven panel pattern as Maps but replaces the static image with an autoplay looping `<video>` sourced from `/assets/VIDS/preview/`. Switching between power-ups triggers a blurred cross-fade via Framer Motion's `AnimatePresence mode="wait"`.

**DownloadSection** lists Windows minimum system requirements and links to `assets/GAME/BoxSiege.zip` via a standard `<a download>` anchor. A gameplay video is shown alongside.

**BackToTop** appears only when the user is within 600px of the bottom of the page and has scrolled more than 400px from the top, preventing it from appearing on short viewports where the footer is already visible.

---

### CharacterShowcase.tsx

An interactive browser for the game's 16 playable characters across four factions (Player 1 through Player 4, four characters each). It manages two independent axes of state: the active faction (`p1`–`p4`) and the selected character index within that faction (stored per faction so switching back to a faction remembers the last selected character). A third state axis controls whether the current sprite is shown in idle or death mode.

Each faction has a distinct accent color used to tint the panel background, the large initial letterform behind the character, the glowing drop shadow on the sprite, and the selector bar indicator:

```ts
// src/components/CharacterShowcase.tsx
const FACTION_TOGGLE_COLOR: Record<FactionKey, string> = {
  p1: "#ff3a2a",
  p2: "#00f1ff",
  p3: "#45005f",
  p4: "#ffb570",
};
```

When the death mode is active, the sprite transitions in with a slight rotation and scale, and a red "K.O." stamp animates in over the character:

```tsx
<motion.div
  initial={{ opacity: 0, scale: 1.4, rotate: -20 }}
  animate={{ opacity: 1, scale: 1, rotate: -12 }}
  exit={{ opacity: 0, scale: 1.2 }}
  transition={{ type: "spring", damping: 14, stiffness: 200 }}
  className="absolute top-6 right-6 z-20 px-4 py-1 border-4 font-display text-2xl tracking-[0.3em]"
  style={{ color: "#ff2244", borderColor: "#ff2244", textShadow: "0 0 12px #ff2244" }}
>
  K.O.
</motion.div>
```

All character sprite images use `imageRendering: "pixelated"` to preserve the crisp pixel-art aesthetic at any display scale.

---

### WeaponShowcase.tsx

Displays the weapon arsenal for each of the four players. Each player has four ranged weapons (Smith, Kurval, Flamer, Scream) and one melee weapon (Combat Knife). The Scream weapon is unique in that it has a secondary weapon (a Pistol) with its own separate stat block.

Stat bars are animated with Framer Motion, growing from zero to their final value every time a new weapon is selected:

```tsx
<motion.div
  key={value}
  initial={{ width: 0 }}
  animate={{ width: `${pct}%` }}
  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
  className="absolute inset-y-0 left-0 rounded-full"
  style={{ background: `linear-gradient(90deg, ${color}, ${color}55)` }}
/>
```

The damage stat renders heart icons (sourced from `/assets/IMG/ui/heart.png`) and the ammo stat renders bullet icons (`/assets/IMG/ui/bullet.png`) instead of numeric text, matching the game's in-game HUD aesthetic. Fractional damage values (e.g., 1.5 damage = one full heart and one half heart) are displayed by rendering a half-clipped heart using `clipPath`.

Ammo values of `Infinity` are rendered as an SVG infinity symbol rather than the string `"Infinity"`.

---

### KeybindShowcase.tsx

A fully interactive virtual keyboard display showing the default control layout for all four players. On desktop, the showcase responds to real keyboard events — pressing the physical keys highlights the corresponding keycaps with a press animation and glow effect. On mobile (detected via the `(hover: none), (pointer: coarse)` media query), users tap the keycap buttons directly.

Each keycap is a multi-layered component that simulates physical depth: an outer border box, an inset bevel panel, a micro-grid texture, accent corner brackets, a faction-colored radial wash, and a bottom accent stripe. The pressed state changes the box-shadow to simulate a key travel of 8px downward and replaces the outer shadow with an inward glow:

```tsx
// Unpressed box-shadow (3D raised key)
boxShadow: `0 10px 0 -4px rgba(0,0,0,0.75), 0 16px 26px -10px rgba(0,0,0,0.8),
            inset 0 -6px 0 rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)`

// Pressed box-shadow (depressed key with faction glow)
boxShadow: `0 0 0 2px ${accent}, 0 4px 0 -2px rgba(0,0,0,0.8),
            0 10px 28px -6px ${accent}cc, inset 0 -2px 0 rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 30px ${accent}44`
```

Keyboard event listeners are registered with `window.addEventListener("keydown" / "keyup")` and scoped to the current faction's layout — switching the active player tab clears all pressed states and re-registers the listeners against the new layout's key codes.

Default key mappings per player:

| Action | Player 1 | Player 2 | Player 3 | Player 4 |
|---|---|---|---|---|
| Move Left | `A` | `J` | `F` | `Arrow Left` |
| Move Right | `D` | `L` | `H` | `Arrow Right` |
| Move Down | `S` | `K` | `G` | `Arrow Down` |
| Jump | `W` | `I` | `T` | `Arrow Up` |
| Shoot | `E` | `O` | `Y` | `Numpad 0` / `0` |
| Switch Weapon | `Q` | `U` | `R` | `Numpad 1` / `1` |

---

### ThemeToggle.tsx

Provides a dark/light mode toggle. When toggled, it uses the View Transition API to animate the theme change as a circular reveal expanding from the exact pixel position of the toggle button. On browsers that do not support the View Transition API (Firefox, older Safari), it falls back to an immediate class swap.

The `useInitTheme` hook reads a persisted theme preference from `localStorage` and applies the `.dark` class to `<html>` before the first render to avoid a flash of incorrect theme. This hook is called in the root `BoxSiegeSite` component.

```tsx
const transition = doc.startViewTransition(() => { setTheme(next); });
await transition.ready;
document.documentElement.animate(
  {
    clipPath: [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ],
  },
  {
    duration: 650,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    pseudoElement: "::view-transition-new(root)",
  }
);
```

The toggle ships in two variants: `variant="fixed"` (desktop, positioned fixed top-right) and `variant="inline"` (used inside the mobile hamburger menu row).

---

## Data Layer

All static game data lives in `src/data/content.ts`. Adding a new character, weapon, map, or power-up only requires editing this file — no component code needs to change.

### Characters

Characters are grouped into four factions (`CHARACTERS_P1` through `CHARACTERS_P4`). Each entry conforms to the `CharacterData` type:

```ts
export type CharacterData = {
  id: string;
  name: string;
  sprite: string;  // idle sprite path
  death: string;   // death sprite path
  gun: string;     // gun overlay sprite path
  color: string;   // hex accent for glow effects
};
```

Full character roster:

| Faction | Characters |
|---|---|
| Player 1 | Angry, Bandel, Melow, Ninja |
| Player 2 | Calm, Baik, Mime, Silat |
| Player 3 | Drunk, Blind, Joker, Spider Weaver |
| Player 4 | Bald Man, Deadswim, Savior, Spider Black |

### Weapons

Ranged weapons conform to `WeaponData`, which extends `WeaponStatsData` with an `id` field and an optional `secondary` field for dual-mode weapons:

```ts
export type WeaponStatsData = {
  name: string;
  image: string;
  damage: number;      // in heart units; 0.25 = quarter heart
  magazine: number;    // Infinity = unlimited
  bulletSpeed: number; // arbitrary internal unit
  fireRate: number;    // seconds between shots; 0 = continuous
};

export type WeaponData = WeaponStatsData & {
  id: string;
  secondary?: WeaponStatsData;
};
```

Each player carries the same four ranged weapons but with player-specific sprite colorings:

| Weapon | Damage | Magazine | Bullet Speed | Fire Rate | Notes |
|---|---|---|---|---|---|
| Smith | 1 | 25 | 10 | 0.5s | Standard sidearm |
| Kurval | 1.5 | 10 | 5 | 3.5s | High damage, slow fire |
| Flamer | 0.5 | 30 | 15 | Continuous | Rapid-fire, low damage |
| Scream | 3 | 3 | 50 | 5s | Sniper; switches to Pistol (unlimited) when empty |

### Maps

```ts
export type MapData = {
  id: string;
  name: string;
  thumb: string;   // small thumbnail for the selector strip
  full: string;    // full-resolution image for the lightbox
  biome: string;
  accent: string;  // hex color used to tint the map panel
};
```

Available stages:

| ID | Name | Biome | Accent |
|---|---|---|---|
| `earth` | The Earth | Earth | `#00d1ff` |
| `hell` | The Hell | Hell | `#630f0f` |
| `snow` | The Snow | Snow | `#4da6ff` |
| `desert` | The Desert | Desert | `#ffb570` |

### Power-Ups

```ts
export type PowerUpData = {
  id: string;
  title: string;
  img: string;      // static icon
  video: string;    // in-game preview clip
  desc: string;
  duration: string;
  effect: string;
  accent: string;
};
```

| ID | Title | Duration | Effect |
|---|---|---|---|
| `speed` | Speed Boost | 10s | Movement x2 |
| `jump` | Jump Boost | 10s | Jump Height x2 |
| `heal` | Heal | Instant | +1 Health |
| `shield` | Shield | 7s | +2 Shields |

### Melee Weapons

Every player has a `Combat Knife` melee weapon with identical stats:

```ts
export type MeleeData = {
  id: string;
  name: string;
  image: string;
  damage: number;
  fireRate: number;
  range: number;
  bullet: number; // Infinity = unlimited
};

// All four players share these stats:
{ damage: 3, bullet: Infinity, fireRate: 1, range: 0.3 }
```

---

## Default Keybindings

All keybindings are fully rebindable inside the game. The website's `KeybindShowcase` displays the default layout and allows users to test each key interactively before downloading.

**Player 1 — WASD + QE**

```
[ Q Switch ]  [ W Jump ]  [ E Shot  ]
[ A Left  ]   [ S Down ]  [ D Right ]
```

**Player 2 — IJKL + UO**

```
[ U Switch ]  [ I Jump ]  [ O Shot  ]
[ J Left  ]   [ K Down ]  [ L Right ]
```

**Player 3 — TFGH + RY**

```
[ R Switch ]  [ T Jump ]  [ Y Shot  ]
[ F Left  ]   [ G Down ]  [ H Right ]
```

**Player 4 — Arrow Keys + Numpad**

```
[ Num1 Switch ]  [ Up Jump ]    [ Num0 Shot  ]
[ Left Left  ]   [ Down Down ]  [ Right Right]
```

---

## Asset Structure

All assets under `public/` are served directly by Vite without bundling. Paths referenced in component code use the `/assets/...` prefix and resolve to `public/assets/...` at runtime.

Images inside `src/assets/` (if any) would be processed through Vite's asset pipeline and receive hashed filenames in production. However, this project places all game assets in `public/` to keep paths stable and predictable, which is particularly important for the video elements (`<source src="...">`) that cannot use dynamic imports.

Sprite images are consistently rendered with `imageRendering: "pixelated"` to maintain crisp upscaling from the original pixel-art resolution.

---

## Theming System

Light and dark themes are controlled by adding or removing the `.dark` class on `<html>`. Custom CSS properties in `src/styles.css` define the full token set for both modes. Tailwind v4 reads these tokens directly — there is no `tailwind.config.ts` file in this project; theme extension is done via the CSS layer.

The default theme is dark. The `useInitTheme` hook reads `localStorage` on mount and sets the class synchronously to avoid a flash of the wrong theme.

Key CSS custom properties (dark theme):

| Token | Usage |
|---|---|
| `--color-bg` | Page background (`#000`) |
| `--color-fg` | Primary foreground text |
| `--color-brand-from` | Gradient brand start (`#ff0000`) |
| `--color-brand-to` | Gradient brand end (`#00f1ff`) |

The brand gradient (`bg-gradient-brand`) is a horizontal linear gradient from red to cyan, applied to primary CTA buttons, the back-to-top button, and the active nav underline.

---

## Animations and Motion

All entrance and transition animations are handled by Framer Motion. The project makes consistent use of:

- `initial / animate / exit` for mount and unmount transitions
- `whileInView` with `viewport={{ once: true }}` for scroll-triggered entrances that fire only the first time the element enters view
- `AnimatePresence mode="wait"` for cross-fading between content panels (maps, power-ups, characters, weapons)
- `layout` and `layoutId` for shared layout transitions — the active indicator bar in the map, power-up, and character selectors uses `layoutId` so it smoothly slides between tabs

Staggered card entrances delay each item by `i * 0.1` seconds:

```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: i * 0.1, duration: 0.5 }}
  whileHover={{ y: -6 }}
>
```

Custom CSS animations defined in `src/styles.css`:

| Class | Effect |
|---|---|
| `animate-glow` | Pulsing text shadow on the hero title |
| `spin-slow` | Slow continuous rotation (used on the dashed rings and audio button disc) |
| `scanline-overlay` | Repeating scanline pattern overlay for a CRT aesthetic |
| `shimmer` | Travelling light shimmer over CTA buttons |

---

## Audio System

The `AudioControl` component renders a fixed circular button in the top-right corner of the screen. It creates an `HTMLAudioElement` imperatively (not via a `<audio>` tag) to avoid autoplay restrictions:

```tsx
useEffect(() => {
  const a = new Audio("/assets/BGM/BGM 1.MP3");
  a.loop = true;
  a.volume = 0.4;
  audioRef.current = a;
  return () => { a.pause(); };
}, []);
```

The button displays a slowly rotating disc (using the `Fix.jpg` artwork and the `spin-slow` CSS animation). A `Volume2` Lucide icon appears when the audio is paused. When playing, the icon is hidden and the disc spins continuously.

Audio is not played on mount. The user must click the button to start playback — this complies with browser autoplay policies that block audio without a user gesture.

---

## Navigation and Scroll Behavior

The `Header` component's active section detection uses `getBoundingClientRect` against a threshold of 40% of the viewport height. A section becomes active once its top edge passes above that threshold:

```tsx
const updateActive = () => {
  const threshold = window.innerHeight * 0.4;
  let closest: HTMLElement | null = null;
  let closestDist = Infinity;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= threshold) {
      const dist = Math.abs(rect.top - threshold);
      if (dist < closestDist) {
        closestDist = dist;
        closest = section;
      }
    }
  }

  if (closest) setActive(closest.id);
};
```

All anchor links in the header use native `href="#id"` attributes, which means the browser handles smooth scrolling via the `scroll-behavior: smooth` CSS property set on `<html>` in `styles.css`. No manual `window.scrollTo` offset calculation is required.

---

## Getting Started

### Requirements

- Node.js 18 or later (or Bun 1.0 or later)
- npm 9 or later, Bun, pnpm, or Yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/box-siege-site.git
cd box-siege-site

# Install dependencies with npm
npm install

# — or with Bun (faster, matches the lock file)
bun install
```

### Development Server

```bash
npm run dev
# or
bun run dev
```

The development server starts at `http://localhost:8080`. Hot Module Replacement is enabled by default.

### Path Alias

The `@` alias resolves to `src/`. All internal imports must use this alias. It is configured via `vite-tsconfig-paths` (reads `tsconfig.json` paths automatically) and the explicit alias in `vite.config.ts`:

```ts
// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},
```

```ts
// Correct
import { MAPS } from "@/data/content";
import { cn } from "@/lib/utils";

// Avoid
import { MAPS } from "../../data/content";
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server on port 8080 |
| `npm run build` | Production build — output written to `dist/` |
| `npm run build:dev` | Development-mode build with source maps |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Run ESLint across all TypeScript and TSX files |

---

## Build and Deployment

### Production Build

```bash
npm run build
```

The output is written to `dist/`. Tailwind CSS v4 is processed entirely by the Vite plugin — no separate CSS build step is needed.

### SPA Routing

The application uses client-side routing (React Router DOM). All hosts must be configured to serve `index.html` for any path that does not match a static file, so that direct navigation to any URL does not return a 404.

A `vercel.json` is included to handle this automatically on Vercel:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

For other platforms:

| Platform | Configuration |
|---|---|
| Vercel | Automatic via the included `vercel.json` |
| Netlify | Add a `public/_redirects` file containing `/* /index.html 200` |
| GitHub Pages | Use the `gh-pages` package; set `base` in `vite.config.ts` to the repository name |
| Nginx | Add `try_files $uri $uri/ /index.html;` to the location block |

### Deployment Checklist

Before pushing to production:

1. Confirm `public/assets/VIDS/BG.mp4` is present — the hero section will render without a background if it is missing.
2. Confirm all four power-up preview videos exist under `public/assets/VIDS/preview/`.
3. Confirm the download file exists at `public/assets/GAME/BoxSiege.zip` (the `<a download>` anchor points here).
4. Run `npm run lint` with zero errors.
5. Run `npm run build` and verify no TypeScript or bundler errors.
6. Run `npm run preview` and walk through every section on both desktop and a mobile viewport.

---

## Configuration Reference

### vite.config.ts

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",   // All interfaces, including IPv6
    port: 8080,
  },
});
```

`@tailwindcss/vite` replaces the traditional PostCSS pipeline entirely. Do not add a `postcss.config.js` or a `tailwind.config.ts` — both are unused in this setup.

### components.json (shadcn/ui)

```json
{
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles.css",
    "baseColor": "slate"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

New UI primitives should be generated with:

```bash
npx shadcn-ui@latest add <component-name>
```

Do not hand-edit files under `src/components/ui/` — they are generated and may be regenerated at any time.

### vercel.json

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Contributing

Contributions are welcome. Please follow the steps below.

1. Fork this repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and verify them in the development server.
4. Run `npm run lint` with zero errors before committing.
5. Commit with a descriptive message: `git commit -m "feat: description of change"`
6. Push your branch: `git push origin feature/your-feature-name`
7. Open a Pull Request with a clear description of what was changed and why.

### Adding a New Character

Open `src/data/content.ts` and add an entry to the appropriate `CHARACTERS_P*` array:

```ts
export const CHARACTERS_P1: CharacterData[] = [
  // ... existing entries
  {
    id: "new-char",
    name: "New Char",
    sprite: "/assets/IMG/P1/newchar.png",
    death: "/assets/IMG/P1/newchar-die.png",
    gun: "/assets/IMG/P1/gunp1.png",
    color: "#00ff88",
  },
];
```

Place the sprite PNG files in the matching `public/assets/IMG/P*/` directory. No component code changes are required.

### Adding a New Stage

Add an entry to the `MAPS` array in `src/data/content.ts`:

```ts
export const MAPS: MapData[] = [
  // ... existing entries
  {
    id: "space",
    name: "The Space",
    thumb: "/assets/IMG/stage/space.png",
    full: "/assets/IMG/stage in game/space.png",
    biome: "Space",
    accent: "#9b59b6",
  },
];
```

Place the thumbnail in `public/assets/IMG/stage/` and the full-resolution image in `public/assets/IMG/stage in game/`. The map panel, selector strip, and lightbox will update automatically.

### Coding Conventions

- All components are written as named function declarations and exported as `default` (top-level page components) or named exports (showcase components).
- Internal imports always use the `@/` path alias.
- Static data arrays (nav items, faction configs, feature cards) are declared at module scope above the component that consumes them.
- `AnimatePresence` is always given an explicit `mode` prop (`"wait"` or `"sync"`).
- All `useEffect` hooks that register event listeners clean them up in the return function with the matching `removeEventListener` call.
- Images that display game pixel art must include `style={{ imageRendering: "pixelated" }}`.
- New shadcn/ui components are generated with the CLI, never hand-written.

---

## License

This project is currently unlicensed. All rights are retained by Equinox Interactive unless otherwise specified. Contact the project maintainer before using code or assets from this repository in other works.

---

<div align="center">

**Box Siege — Equinox Interactive**

*Small Team. Big Dreams.*

</div>
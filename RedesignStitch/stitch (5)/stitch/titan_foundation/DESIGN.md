# Design System Documentation: The Monolithic Curator

## 1. Overview & Creative North Star

This design system is engineered for a $1.5B industrial titan. To convey the scale of Resident Cement Company Limited, we move away from the "disposable" feel of standard SaaS templates and toward a visual language of **"Monolithic Elegance."** 

Our Creative North Star is the intersection of raw industrial power and refined architectural precision. The UI should feel like a physical structure: heavy, permanent, and authoritative, yet punctuated by moments of high-end transparency and light. We achieve this by breaking the rigid grid through intentional asymmetry—letting imagery bleed off-canvas and using a typography scale that feels more like a premium editorial magazine than a software dashboard.

## 2. Colors

The palette is a sophisticated interplay between the raw earth of Bauchi State and the polished gold of premium industry.

*   **Primary (Bauchi State Green):** `primary` (#006b3f) and `primary_container` (#008751). These represent sustainability and the lush environment of the region.
*   **Secondary (Cement Grey):** `secondary` (#5b5f61). This provides the industrial foundation. Use `surface_container` variations to mimic the texture of concrete at different depths.
*   **Tertiary (Premium Gold):** `tertiary` (#735c00) and `tertiary_container` (#cca730). Use these sparingly for high-value CTAs and accents to denote excellence.

### The "No-Line" Rule
To maintain a high-end feel, **1px solid borders are prohibited for sectioning.** Structural boundaries must be defined solely through background color shifts. For example, a `surface_container_low` section sitting on a `surface` background provides all the definition needed. Lines are a crutch; material transitions are architecture.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers (`lowest` to `highest`) to create depth:
*   **Page Background:** `surface` (#f7fafc).
*   **Main Content Blocks:** `surface_container_low` (#f1f4f6).
*   **Interactive Cards/Modules:** `surface_container_lowest` (#ffffff) to provide a soft, natural "lift."

### The "Glass & Gradient" Rule
To add visual "soul," use subtle gradients on main CTAs, transitioning from `primary` to `primary_container`. For floating navigation or modal overlays, apply **Glassmorphism**: use semi-transparent surface colors with a `backdrop-blur` effect. This softens the industrial edge and adds a layer of modern transparency.

## 3. Typography

The typography strategy pairs heritage with modern efficiency.

*   **Serif Headers (Newsreader):** Used for all `display` and `headline` tokens. This conveys the $1.5B scale, stability, and historical weight of the company. It feels like a masthead of a prestigious journal.
*   **Sans-Serif Body (Inter):** Used for `title`, `body`, and `label` tokens. Inter provides the modern, architectural precision required for industrial data and professional readability.

**Hierarchy Tip:** For hero sections, use `display-lg` with a tight letter-spacing (-0.02em) to create a monolithic, "carved in stone" effect.

## 4. Elevation & Depth

We eschew traditional drop shadows in favor of **Tonal Layering.**

*   **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` section. The subtle shift in hex code creates a sophisticated lift that is felt rather than seen.
*   **Ambient Shadows:** If a floating element (like a primary action button or a modal) requires a shadow, it must be "Ambient." Use a large blur (24px+) and a very low opacity (4%-8%) using a tint of `on_surface` (#181c1e).
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use a "Ghost Border": the `outline_variant` token at 15% opacity. Never use 100% opaque outlines.

## 5. Components

### Buttons
*   **Primary:** A subtle gradient from `primary` to `primary_container`. Roundedness: `md` (0.375rem).
*   **Secondary:** `surface_container_highest` background with `on_surface` text. No border.
*   **Tertiary (The "Gold" Standard):** Use `tertiary` for high-end "Inquire" or "Invest" actions.

### Cards & Lists
*   **Forbid Divider Lines:** Separate list items using `spacing-4` (1.4rem) of vertical white space or alternating backgrounds (`surface_container_low` and `surface_container_high`).
*   **Content Grouping:** Use "Architectural Blocks"—large, unbordered containers that rely on the `spacing-12` (4rem) to `spacing-20` (7rem) scale to create breathing room.

### Input Fields
*   **Style:** Minimalist. Use `surface_container_highest` as the fill.
*   **States:** On focus, transition the background to `surface_container_lowest` and add a `primary` 2px bottom-bar only. This mimics architectural drafting lines.

### Industrial-Specific Components
*   **Data Monoliths:** Large-scale KPI cards for displaying cement output or stock price. These should use `display-sm` Newsreader typography for the value and `label-md` Inter for the caption.
*   **The "Drone" Gallery:** Image containers using `xl` (0.75rem) roundedness to house high-resolution industrial photography, always paired with a `surface_container_low` caption block.

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts where imagery occupies 60% of the screen width and text occupies 40%, creating a high-end editorial feel.
*   **Do** use the `spacing-24` (8.5rem) token for section padding to allow the brand to "breathe" like a vast industrial site.
*   **Do** use `primary_fixed_dim` for subtle decorative elements that need to remain on-brand but low-contrast.

### Don't:
*   **Don't** use standard "web blue" for links; use `primary` or `tertiary`.
*   **Don't** use sharp corners; adhere strictly to the **Roundedness Scale** (predominantly `md` for UI and `xl` for imagery).
*   **Don't** use 100% black text. Always use `on_surface` (#181c1e) to maintain a softer, premium contrast against the cement-grey backgrounds.
*   **Don't** use "Card Shadows" on every element. Reserve elevation for the most critical interactive components only.
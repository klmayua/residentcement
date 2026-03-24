# Design System Strategy: The Golden Monolith

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"Architectural Editorial."** 

Resident Cement is not just a commodity; it is the foundation of structural permanence. We are moving away from the "industrial template" look toward a high-end, gallery-like experience. This system communicates authority through **intentional asymmetry**, where heavy, monolithic blocks of content are balanced by expansive whitespace (the "Sand/Stone" palette). 

By overlapping high-contrast typography over glassmorphic layers and using sharp 4px corners, we create a visual tension that feels both ancient (the permanence of stone) and cutting-edge (the precision of modern architecture). We don't just display information; we curate it into a digital structure.

---

## 2. Colors
Our palette is rooted in the earth but refined by luxury.

### The Palette
*   **Primary (Rich Gold):** `#745B17` (Main brand) & `#C5A55A` (Container/Accent). Use for high-impact CTAs and signature details.
*   **Surface (Sand/Stone):** `#F9F9F8` to `#E2E2E2`. This serves as our "concrete" canvas.
*   **On-Surface (Deep Charcoal):** `#171717` (Base) & `#1A1C1C`. High-contrast legibility for an authoritative voice.

### The "No-Line" Rule
To maintain a premium feel, **1px solid borders for sectioning are strictly prohibited.** Boundaries must be defined through:
*   **Background Shifts:** Transition from `surface` to `surface-container-low` to define new sections.
*   **Tonal Transitions:** Use a soft shift from `surface-container` to `surface-bright` to suggest a change in content focus.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Nesting should follow the logic of density:
*   **Layer 1 (Base):** `surface`
*   **Layer 2 (In-set Content):** `surface-container-low`
*   **Layer 3 (Active Cards):** `surface-container-lowest` (pure white) to provide a "clean" lift against the sand-toned background.

### The "Glass & Gradient" Rule
For floating elements (Navigation, Quick Actions), use **Glassmorphism**. Apply `surface-container-low` at 70% opacity with a `20px` backdrop-blur. To add "soul," use a subtle linear gradient on primary actions transitioning from `primary` (#745B17) to `primary-container` (#C5A55A) at a 45-degree angle.

---

## 3. Typography
We use a high-contrast pairing to reflect the "Industrial/Luxury" duality.

*   **The Authoritative Serif (Noto Serif):** Used for `display` and `headline` levels. This font carries the weight of the brand's history. Headlines should use tight letter-spacing (-2%) to feel like a chiseled stone inscription.
*   **The Precision Sans (Plus Jakarta Sans):** Used for `title`, `body`, and `label` levels. It provides a clean, technical counter-balance. Body text should maintain a generous line height (1.6) to ensure the "Editorial" feel isn't lost in technical data.

---

## 4. Elevation & Depth
In an industrial system, depth should feel heavy and grounded, not airy.

*   **The Layering Principle:** Avoid shadows for basic hierarchy. Use tonal stacking (e.g., a `surface-container-high` element placed inside a `surface-container` area).
*   **Ambient Shadows:** For floating modals or "Gold Monolith" cards, use "Ambient Shadows."
    *   **Value:** `0px 20px 40px rgba(26, 28, 28, 0.06)`
    *   **Logic:** The shadow color is a low-opacity tint of `on-surface` (#1A1C1C) to simulate natural light falling on stone.
*   **The "Ghost Border" Fallback:** If a container needs separation on a complex background, use a **Ghost Border**: `outline-variant` token at 15% opacity.
*   **Architectural Corners:** Maintain a `DEFAULT: 0.25rem` (4px) radius. This provides just enough softness to feel modern while retaining the "sharp" edge of architectural drawings.

---

## 5. Components

### Buttons
*   **Primary:** High-contrast Gold (`primary`) background with White (`on-primary`) text. 4px corners. No border.
*   **Secondary:** Ghost style. No background, 1px Gold border (`primary-fixed-dim`), Gold text.
*   **Tertiary:** Text-only in `primary` with a 2px underline that expands on hover.

### Input Fields
*   **Style:** Minimalist underline or "Monolith" (solid block).
*   **Unfocused:** `surface-container-highest` background with a subtle `outline-variant` bottom border.
*   **Focused:** `primary` (Gold) 2px bottom border. Text remains `on-surface`.

### Cards & Lists
*   **Forbid Divider Lines:** Use `Spacing Scale: 6` (2rem) or background shifts to separate items.
*   **Interaction:** On hover, a card should shift from `surface-container-low` to `surface-container-lowest` and gain an Ambient Shadow.

### Chips
*   **Action Chips:** Use `secondary-container` with `on-secondary-container` text. Keep corners at `sm` (2px) to look like industrial tags.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts. A header can be left-aligned while the subtext is shifted three columns to the right.
*   **Do** use the "Gold" sparingly. It should feel like a rare vein of ore in a stone cliff, not a coat of paint.
*   **Do** leverage the `display-lg` scale for hero sections to create a "Signature Editorial" moment.

### Don't
*   **Don't** use standard "drop shadows" (black with 25% opacity). It kills the premium industrial aesthetic.
*   **Don't** use rounded "pills" for buttons. Stick to the architectural 4px rule.
*   **Don't** use dividers between list items. Use the `spacing-4` (1.4rem) token to let the "Sand" breathe between elements.
*   **Don't** use pure #000000 for text. Always use the `on-surface` (#1A1C1C) for a softer, more sophisticated depth.
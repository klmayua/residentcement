# Design System Document: The Monolith Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Architectural Ledger"**

This design system rejects the "SaaS-dashboard" aesthetic in favor of a high-end, editorial experience tailored for the ResidentCement Distributor Portal. We are moving away from the "busy" nature of traditional B2B portals and toward a UI that feels like a physical architectural monograph. 

The system is built on **Intentional Asymmetry** and **Tonal Depth**. Instead of a rigid, centered grid, we utilize generous white space (negative space) and overlapping elements to create a sense of bespoke craftsmanship. The experience must feel heavy, permanent, and exclusive—mirroring the industrial strength of cement paired with the luxury of high-end residential finishes.

---

## 2. Colors: Tonal Atmosphere
The palette is rooted in deep earth and metallic warmth. We do not use "pure" blacks or grays; every neutral is infused with a hint of warm stone.

### The Palette
- **Primary (Gold):** `#e5c374` (Surface Tint / Accents)
- **Secondary (Deep Gold):** `#e8c265` (Interactive elements)
- **Surface (The Base):** `#161311` (Deep Obsidian Stone)
- **On-Surface (Text/Icons):** `#e9e1dd` (Warm Parchment)

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are prohibited for sectioning. 
Structure is defined by color-blocking and background shifts. To separate a sidebar from a main feed, use a transition from `surface` to `surface-container-low`. To separate a header, use a `surface-bright` background. Lines feel clinical; color shifts feel architectural.

### Surface Hierarchy & Nesting
Treat the UI as a series of nested stone slabs.
- **Base Layer:** `surface` (#161311)
- **Nested Content:** `surface-container` (#221f1d)
- **Prominent Cards:** `surface-container-highest` (#383432)
By nesting a "Highest" container inside a "Low" container, you create depth without a single drop shadow.

### Signature Textures
For primary CTAs or Hero sections, use a **Linear Gradient**:
- `from: #e5c374 (Primary)` to `to: #9c7f38 (On-Primary-Container)`
This 45-degree shift provides a "metallic sheen" that flat colors cannot replicate, evoking a sense of premium brass hardware.

---

## 3. Typography: Editorial Authority
We utilize a high-contrast pairing: **Noto Serif** (standing in for Playfair for display) provides an authoritative, legacy feel, while **Inter** ensures precision in data-heavy B2B contexts.

- **Display (Noto Serif):** Used for "Hero" moments and large numerical data (e.g., Total Revenue). It should feel like a magazine masthead.
- **Headlines (Noto Serif):** Used for section titles. Use `headline-lg` (2rem) to command attention.
- **Body (Inter):** All functional text. `body-md` (0.875rem) is the workhorse.
- **Labels (Inter Bold):** Use `label-sm` (0.6875rem) with 0.05em letter spacing for a "technical" look on small metadata.

---

## 4. Elevation & Depth: The Layering Principle

### Tonal Layering
Depth is achieved by "stacking" the surface-container tiers. 
*Example:* A `surface-container-lowest` card sitting on a `surface-container-low` section creates a "sunken" or "carved" effect into the stone.

### Ambient Shadows
When an element must float (e.g., a dropdown or a modal), use an **Ambient Shadow**:
- **Blur:** 24px - 40px
- **Opacity:** 4% - 8%
- **Color:** `#000000` (Never gray)

### Glassmorphism & Depth
For floating navigation bars or overlays, use:
- **Background:** `surface-container-high` at 70% opacity.
- **Backdrop-blur:** 12px.
- **Ghost Border:** If contrast is needed, use `outline-variant` (#4d4540) at **15% opacity**. This creates a "glint" on the edge of the glass rather than a hard boundary.

---

## 5. Components

### Buttons: The Signature Strike
- **Primary:** Gradient fill (Primary to Primary-Container), `0.25rem` (sm) radius. Text is `on-primary-fixed` (Dark).
- **Secondary:** Transparent background with a `Ghost Border` (outline-variant at 20%). On hover, fill with `surface-container-highest`.
- **Tertiary:** Text-only, using `secondary` color with a subtle underline on hover.

### Input Fields: Carved Precision
- **Style:** No background. Use a bottom-only "Ghost Border" (20% opacity). 
- **Active State:** The bottom border transforms into a 2px `primary` (gold) line.
- **Label:** Moves from `body-md` placeholder to `label-sm` above the field upon focus.

### Cards & Lists: The No-Divider Rule
Forbid the use of divider lines. 
- **Lists:** Use `3.5rem` (10) vertical padding between list items. Use a subtle `surface-container-low` hover state to highlight the row.
- **Cards:** Use `surface-container-lowest` for the card body. Use `xl` (0.75rem) spacing between cards to let the background breathe.

### Additional Component: The "Status Seal"
Instead of standard chips, use a "Status Seal"—a small, 8px circle of color (Primary for active, Error for overdue) paired with `label-md` text in all-caps. It should look like a quality control stamp.

---

## 6. Do’s and Don’ts

### Do:
- **Use Wide Gutters:** Use `spacing-12` (4rem) or `spacing-16` (5.5rem) for section margins. Premium is defined by the luxury of space.
- **Mix Type Weights:** Pair a `display-lg` Serif heading with a `label-sm` Inter sub-heading for an editorial look.
- **Optical Centering:** When placing icons in gold circles, visually adjust them; do not rely on purely mathematical centering.

### Don’t:
- **Don’t use 100% White:** Never use `#FFFFFF`. Use `on-surface` (#e9e1dd). It is easier on the eyes in a dark-default environment.
- **Don’t use "Big" Rounds:** Avoid the `full` radius for buttons. Stick to `sm` (0.125rem) or `md` (0.375rem). Rounded "pills" feel too consumer-grade/playful for a B2B cement portal.
- **Don’t Over-Gold:** Use the Gold accent tokens (`primary`, `secondary`) sparingly. They are the "jewelry" of the UI—too much, and the portal loses its industrial authority.
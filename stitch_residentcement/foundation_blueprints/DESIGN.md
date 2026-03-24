```markdown
# Design System Specification: Architectural Authority

## 1. Overview & Creative North Star
**Creative North Star: The Monolithic Curator**
This design system rejects the "boxed-in" nature of traditional corporate templates. For ResidentCement, we are building a digital experience that feels as structural and enduring as the material itself. We achieve "Architectural Authority" through intentional asymmetry, massive typographic contrast, and a "No-Line" philosophy. The UI should not feel like a website; it should feel like a physical space—airy, layered, and sophisticated. We break the grid by allowing high-end imagery to bleed into the margins and using "Plus Jakarta Sans" at display scales to command attention.

---

## 2. Colors & Surface Philosophy
The palette moves beyond basic blue. We use tonal depth to create a sense of trust without the clinical coldness of standard "Corporate Blue."

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders for sectioning are strictly prohibited. 
Structural boundaries must be defined solely through background color shifts. To separate a testimonial section from a hero, transition from `surface` to `surface-container-low`. The eye should perceive change through tonal weight, not a drawn line.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked architectural planes. 
- **The Base:** Use `surface` (#f8f9fb) for the primary canvas.
- **The Inset:** Use `surface-container-low` (#f3f4f6) for large content blocks.
- **The Raised Plane:** Place `surface-container-lowest` (#ffffff) cards on top of low-tier backgrounds to create natural, soft lift.

### The Glass & Gradient Rule
- **Floating Navigation:** Must use Glassmorphism. Implement `surface_container_lowest` at 70% opacity with a `backdrop-blur-md`.
- **Visual Soul:** High-conversion CTAs and Hero sections should utilize a subtle linear gradient: `primary` (#003d9b) to `primary_container` (#0052cc) at a 135-degree angle. This adds a "sheen" of professionalism that flat hex codes lack.

---

## 3. Typography: Editorial Authority
We utilize a high-contrast scale to ensure a premium, editorial feel.

*   **Display (Plus Jakarta Sans):** Our "voice of God." Use `display-lg` (3.5rem) for hero statements. Tighten letter-spacing by -0.02em for a custom, "locked-in" look.
*   **Headlines (Plus Jakarta Sans):** Use `headline-lg` (2rem) for section titles. These should often be intentionally offset from the center to create a dynamic, modern rhythm.
*   **Body (Inter):** The "workhorse." Use `body-lg` (1rem) for general copy. Inter provides the technical, trustworthy legibility required for corporate documentation.
*   **Labels (Inter):** Use `label-md` (0.75rem) in All Caps with +0.05em tracking for overlines and category tags.

---

## 4. Elevation & Depth
In this system, depth is a function of light and layering, not artificial borders.

### The Layering Principle
Achieve hierarchy by "stacking." A white card (`surface-container-lowest`) on a light grey background (`surface-container-low`) creates an immediate focal point. No shadow is needed for basic organization.

### Ambient Shadows
When an element must float (e.g., a primary lead-gen form):
- **Blur:** 40px to 60px.
- **Opacity:** 4%–6%.
- **Tint:** Use a diluted version of `on_surface` (#191c1e) rather than pure black to keep the shadow "organic."

### The Ghost Border Fallback
If accessibility requires a container boundary, use a "Ghost Border": `outline_variant` (#c3c6d6) at **15% opacity**. It should be felt, not seen.

---

## 5. Components & Primitives

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `DEFAULT` (0.25rem) radius. High-end buttons should feel "heavy."
- **Secondary:** `surface-container-highest` background with `on_surface` text. No border.
- **Tertiary:** Text-only with an underline that appears on hover using the `accent` (#ffb950) color.

### Cards & Content Modules
- **Rule:** Forbid divider lines. 
- **Execution:** Use vertical white space (`spacing-12` or `spacing-16`) to separate thoughts. If content inside a card needs separation, use a subtle 10% opacity `outline-variant` horizontal rule that does not touch the edges of the card.

### Input Fields
- **Base:** `surface_container_low` background. 
- **Active State:** Shift to `surface_container_lowest` with a 1px `primary` bottom-border only. This mimics high-end stationery.

### Chips & Tags
- **Selection:** Use `primary_fixed` background with `on_primary_fixed` text. Roundedness: `full`.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Place a `headline-lg` on the left and a `body-lg` paragraph on the right with a 2-column offset.
*   **Embrace Margin:** Use `spacing-24` (6rem) between major sections to let the brand "breathe."
*   **Use Lucide Icons:** Stroke weight should be set to 1.5px to match the technicality of the Inter typeface.

### Don’t:
*   **Don't use 100% Black:** Always use `on_surface` (#191c1e) for text to maintain a premium, ink-on-paper feel.
*   **Don't use Box Shadows on everything:** Reserve shadows for interactive "floating" elements only. Use Tonal Layering for everything else.
*   **Don't use standard Grids:** If three cards are in a row, consider making the middle card 10% taller to break the "template" look.

---

## 7. Signature Pattern: The "Cement" Texture
To tie back to the brand, use a very low-opacity noise texture (2% opacity) over `surface-container` areas. This adds a tactile, "material" quality that reinforces the company's core business in a sophisticated, non-literal way.```
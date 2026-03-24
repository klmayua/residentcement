# VISUAL COMPARISON AUDIT: Mockups vs Implementation

## Date: 2026-03-24

---

## DISTRIBUTOR PORTAL - CRITICAL VISUAL DISCREPANCIES

### Mockup (`stitch_residentcement/distributor_portal_premium_dark_mode/code.html`)

**Layout Structure:**
- Fixed sidebar (left, 256px wide) with navigation
- Main content area (flex-1) with dashboard
- Dark obsidian background (#161311)

**Visual Elements:**
1. **Sidebar:**
   - Dark background
   - Logo: "ResidentCement" in italic serif
   - Nav items: Dashboard (active, gold left border), Inventory, Orders, Analytics, Settings
   - User profile at bottom with initials avatar (gold background)

2. **Header:**
   - "Welcome, John Doe" - Large italic serif
   - Subtitle: "Your logistics oversight..."
   - Gold gradient button: "New Distribution Order"

3. **Bento Grid Dashboard:**
   - **Total Orders Widget:** Large number "1,284", gold accent blur, +12% trend
   - **Inventory Status:** Circular progress SVG (85%), product breakdown
   - **Recent Shipments:** Cards with status badges (In Transit - yellow border, Delivered - green border)
   - **Recent Invoices:** Full-width table with Pay Now buttons (gold gradient)

4. **Typography:**
   - Headlines: Noto Serif, italic for welcome
   - Body: Plus Jakarta Sans
   - Labels: 10px uppercase, tracking-widest

5. **Colors:**
   - Background: #161311 (obsidian)
   - Surface cards: #1a1c1c
   - Primary/Gold: #e5c374
   - Borders: stone-800/30

---

### Current Implementation (`frontend/apps/distributor-portal/src/app/page.tsx`)

**CRITICAL ISSUES:**

1. **Layout Completely Wrong:**
   - ❌ Top navigation header instead of sidebar
   - ❌ Generic 4-column stat cards
   - ❌ No bento grid layout

2. **Colors Incorrect:**
   - ❌ `bg-white` in header
   - ❌ `bg-background` (not using dark obsidian)
   - ❌ Generic shadcn Card components with default styling
   - ❌ Missing gold accents

3. **Typography Broken:**
   - ❌ No Noto Serif usage
   - ❌ No italic styling
   - ❌ Generic sans-serif throughout
   - ❌ Wrong label sizing (not 10px uppercase)

4. **Missing Key Elements:**
   - ❌ No sidebar navigation
   - ❌ No user profile with initials avatar
   - ❌ No gold gradient button
   - ❌ No circular progress indicator
   - ❌ No shipment status cards with proper badges
   - ❌ No invoices table with gold Pay Now buttons
   - ❌ No "Welcome, John Doe" header

5. **Glassmorphism Missing:**
   - ❌ No backdrop blur effects
   - ❌ No glass card styling

---

## CORPORATE WEBSITE - CRITICAL VISUAL DISCREPANCIES

### Mockup (`stitch_residentcement/corporate_home_premium_industrial/code.html`)

**Layout Structure:**
1. **Glass Navigation:**
   - Fixed top, glassmorphism (bg-[#F9F9F8]/70 backdrop-blur)
   - Logo with cement icon
   - Links: About (active, gold underline), Products, Sustainability
   - Search bar with glass styling
   - "Order Now" gold button

2. **Hero Section:**
   - Full height background image (architectural)
   - Gradient overlay (dark to transparent)
   - Label: "Industrial Excellence" (uppercase, tracking-[0.3em])
   - Headline: "Built for Generations" (6xl-8xl, white, serif)
   - Subtitle: "Architectural grade foundations..."
   - Two buttons: "Request Quote" (gold), "Explore Materials" (ghost/outline)
   - Scroll indicator at bottom

3. **Features Bento Grid:**
   - 3 cards: Quality, Sustainability, B2B Logistics
   - Each with icon (verified, eco, conveyor)
   - Gold left border
   - Hover: bottom border animation

4. **Materials Section:**
   - Header: "Our Materials" + "View Catalog" link
   - 4 product cards with images
   - Type badges (Type GU, Pre-Cast, etc.)
   - Prices: "$24.50 / unit"

5. **Latest Projects:**
   - Masonry grid layout
   - Large featured image + 2 smaller
   - Hover reveals with gradient
   - Project titles

6. **CTA Section:**
   - Gold gradient background
   - "Ready to break ground?" headline
   - Response time indicator

---

### Current Implementation (`frontend/apps/corporate-website/src/app/page.tsx`)

**CRITICAL ISSUES:**

1. **Missing Navigation:**
   - ❌ No glass navigation bar
   - ❌ Instead has news ticker (not in mockup)

2. **Hero Different:**
   - ❌ "Building Nigeria's Industrial Future" instead of "Built for Generations"
   - ❌ Stats panel on right (not in mockup)
   - ❌ Different image treatment

3. **Missing Sections:**
   - ❌ No Features Bento Grid (Quality/Sustainability/Logistics)
   - ❌ No Materials section with product cards
   - ❌ No Latest Projects masonry grid

4. **Extra Sections (Not in Mockup):**
   - News ticker
   - Stakeholder Resources section
   - Project Timeline bento
   - News and Narrative section
   - Different CTA section

5. **Color Issues:**
   - ❌ Using camel gold (#79591f) instead of rich gold (#745b17)
   - ❌ Black primary instead of gold

---

## ROOT CAUSE ANALYSIS

1. **Design files not used as reference:** The stitch HTML mockups show the exact target design, but the Next.js implementation deviated significantly

2. **Shadcn defaults overriding:** Using generic shadcn/ui Card, Button components without proper theme customization

3. **Missing glassmorphism:** Backdrop blur and glass effects not implemented

4. **Layout structures wrong:** Sidebar vs top nav, bento grid vs stat cards

5. **Typography not applied:** CSS variables set up but not used in components

---

## FIX PRIORITY

### P0 (Critical - Blocker)
1. Fix distributor-portal page.tsx to match mockup layout exactly
2. Fix corporate-website page.tsx to match mockup sections
3. Ensure dark theme actually applies (obsidian backgrounds)

### P1 (High)
4. Add glassmorphism navigation
5. Fix typography (Noto Serif headlines, proper labels)
6. Add gold gradient buttons

### P2 (Medium)
7. Add hover animations
8. Fine-tune spacing and shadows


# COMPREHENSIVE VISUAL AUDIT
## All Frontend Apps - Pages vs Stitch Mockups

---

## SUMMARY

**Total Pages Audited:** 35+
**Critical Issues:** 18 pages have significant visual mismatches
**Mockup Coverage:** 13 stitch mockups define target design

---

## MOCKUP INVENTORY (stitch_residentcement/)

| Mockup | Theme | Key Elements |
|--------|-------|--------------|
| corporate_home_premium_industrial | Light | Glass nav, hero, bento grid, products, projects, CTA |
| distributor_portal_premium_dark_mode | Dark | Sidebar, bento dashboard, gold accents |
| distributor_portal_secure_login | Dark | Architectural bg, glass card, centered login |
| about_us_architectural_excellence | Light | Heritage focused, timeline, team |
| careers_build_your_legacy | Light | Job listings, culture, benefits |
| invoices_billing_statement | Dark | Financial table, payment status |
| material_catalog_b2b_inventory | Dark | Product grid, search, filters |
| order_tracking_history | Dark | Timeline, shipment tracking |
| products_catalog_premium_materials | Light | Masonry grid, product cards |
| sustainability_eco_conscious_foundations | Light | Green accents, eco imagery |
| foundation_blueprints | Light | Technical specs, downloads |
| obsidian_gilt | Dark | Design system reference |
| aureum_monolith | N/A | DESIGN.md spec |

---

## APP: distributor-portal

### page.tsx (Login - Redirect)
**Status:** ✅ Fixed to match dark theme mockup

### login/page.tsx
**Mockup:** distributor_portal_secure_login
**Expected:**
- Dark obsidian background (#161311)
- Architectural hero image with gradient overlay
- Centered glass card (bg-[#221f1d])
- Logo at top
- "Distributor Portal" headline (Noto Serif)
- "Industrial Strength. Architectural Elegance." subtitle
- Ghost input fields (border-bottom only)
- Gold accent on focus

**Actual:**
- Light gradient background (from-cement-50)
- Generic shadcn Card
- "Welcome Back" generic headline
- Full border inputs
- No glassmorphism

**Status:** ❌ CRITICAL - Complete rewrite needed

### register/page.tsx
**Expected:** Similar to login, dark theme
**Actual:** Similar light theme issues

**Status:** ❌ CRITICAL

### dashboard/page.tsx
**Status:** ✅ FIXED - Matches mockup with sidebar, bento grid, gold accents

### dashboard/orders/page.tsx
**Expected:**
- Dark theme (#161311)
- Sidebar navigation
- Gold status badges (border style)
- "New Order" gold gradient button
- Table with gold Pay Now buttons

**Actual:**
- Light theme
- No sidebar (uses shared layout)
- Generic shadcn Badge components
- Standard button styles

**Status:** ❌ CRITICAL

### dashboard/products/page.tsx
**Expected:**
- Dark theme
- Product grid with gold accents
- Search bar with glass styling

**Actual:** Generic implementation

**Status:** ❌ MODERATE

### dashboard/customers/page.tsx
**Status:** ❌ MODERATE - Needs dark theme

### dashboard/invoices/page.tsx
**Mockup:** invoices_billing_statement
**Expected:**
- Dark theme
- Financial table styling
- Payment status badges
- Gold Pay buttons

**Status:** ❌ CRITICAL

### dashboard/payments/page.tsx
**Status:** ❌ MODERATE

### dashboard/cart/page.tsx
**Status:** ❌ MODERATE

---

## APP: corporate-website

### page.tsx (Home)
**Status:** ✅ FIXED - Matches mockup

### about/page.tsx
**Mockup:** about_us_architectural_excellence
**Expected:**
- Light theme (#f9f9f8)
- Heritage timeline
- Team section
- Glass navigation

**Status:** ❌ MODERATE - Verify styling

### careers/page.tsx
**Mockup:** careers_build_your_legacy
**Expected:**
- Job listings with gold accents
- Culture section
- Benefits cards

**Status:** ❌ MODERATE

### products/page.tsx
**Mockup:** products_catalog_premium_materials
**Expected:**
- Light theme
- Product masonry grid
- Gold accents (#745b17)
- Glass navigation

**Actual:**
- Uses camel gold (#79591f) instead of rich gold (#745b17)
- Different layout than mockup
- Correct bento grid structure but wrong colors

**Status:** ⚠️ PARTIAL - Color fixes needed

### investors/page.tsx
**Status:** ❌ MODERATE

### sustainability/page.tsx
**Mockup:** sustainability_eco_conscious_foundations
**Expected:**
- Green/earth tone accents
- Eco imagery
- Glass navigation

**Status:** ❌ MODERATE

### contact/page.tsx
**Status:** ❌ LOW

### media/page.tsx
**Status:** ❌ LOW

---

## APP: admin-dashboard

### page.tsx (Dashboard)
**Mockup:** N/A (no specific mockup)
**Expected:** Follow Golden Monolith light theme

**Actual:** Generic admin dashboard with shadcn defaults

**Status:** ❌ MODERATE - Apply design system

### orders/page.tsx
**Status:** ❌ MODERATE

### products/page.tsx
**Status:** ❌ MODERATE

### customers/page.tsx
**Status:** ❌ MODERATE

### inventory/page.tsx
**Status:** ❌ MODERATE

### payments/page.tsx
**Status:** ❌ MODERATE

### production/page.tsx
**Status:** ❌ MODERATE

### quality/page.tsx
**Status:** ❌ MODERATE

### users/page.tsx
**Status:** ❌ MODERATE

### settings/page.tsx
**Status:** ❌ MODERATE

---

## APP: sales-rep-app

### page.tsx
**Status:** ❌ CRITICAL - Minimal implementation

### dashboard/page.tsx
**Status:** ❌ CRITICAL

### customers/new/page.tsx
**Status:** ❌ CRITICAL

---

## CRITICAL FIXES NEEDED

### Priority 1 (User-Facing)
1. distributor-portal/login/page.tsx - Complete rewrite
2. distributor-portal/register/page.tsx - Complete rewrite
3. distributor-portal/dashboard/orders/page.tsx - Dark theme + sidebar
4. distributor-portal/dashboard/invoices/page.tsx - Dark theme + table styling
5. corporate-website/products/page.tsx - Color correction

### Priority 2 (Internal Tools)
6. admin-dashboard/* - Apply Golden Monolith theme
7. sales-rep-app/* - Complete implementation

### Priority 3 (Content Pages)
8. corporate-website/about/page.tsx
9. corporate-website/careers/page.tsx
10. corporate-website/sustainability/page.tsx

---

## DESIGN SYSTEM VERIFICATION

### Colors
| Token | Dark Theme | Light Theme | Status |
|-------|------------|-------------|--------|
| Background | #161311 | #f9f9f8 | ✅ Configured |
| Surface | #1a1c1c | #f4f4f3 | ✅ Configured |
| Primary/Gold | #e5c374 | #745b17 | ✅ Configured |
| Secondary | #a8a29e | #5f5e5e | ✅ Configured |
| Outline | #4d4540 | #d0c5b4 | ✅ Configured |

### Typography
| Font | Usage | Status |
|------|-------|--------|
| Noto Serif | Headlines | ✅ Loaded |
| Plus Jakarta Sans | Body | ✅ Loaded |

### Components
| Component | Expected | Status |
|-----------|----------|--------|
| Glass Navigation | backdrop-blur | ✅ CSS defined |
| Gold Button | Linear gradient | ✅ CSS defined |
| Ghost Input | Border-bottom only | ✅ CSS defined |
| Dark Card | #1a1c1c bg | ✅ CSS defined |
| Status Badge | Border style | ✅ CSS defined |

---

## ROOT CAUSE

1. **Theme not applied:** Pages using `bg-cement-*` instead of `bg-background`
2. **Shadcn defaults:** Generic Card, Button, Badge components without custom styling
3. **Missing sidebar:** Dashboard pages not using consistent sidebar layout
4. **Wrong colors:** Some pages using camel gold (#79591f) instead of rich gold (#745b17)
5. **No glassmorphism:** Missing backdrop-blur and opacity effects

---

## RECOMMENDATION

1. Create shared layout components for each app (sidebar, nav)
2. Apply dark/light theme classes consistently
3. Replace shadcn defaults with Golden Monolith styled components
4. Use Tailwind config colors (not arbitrary values)
5. Add glassmorphism utilities


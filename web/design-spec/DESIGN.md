---
name: Bet Olyn
colors:
  surface: '#11131c'
  surface-dim: '#11131c'
  surface-bright: '#373943'
  surface-container-lowest: '#0c0e17'
  surface-container-low: '#191b24'
  surface-container: '#1d1f29'
  surface-container-high: '#282933'
  surface-container-highest: '#33343e'
  on-surface: '#e2e1ef'
  on-surface-variant: '#c4c5d9'
  inverse-surface: '#e2e1ef'
  inverse-on-surface: '#2e303a'
  outline: '#8e90a2'
  outline-variant: '#434656'
  surface-tint: '#b8c3ff'
  primary: '#b8c3ff'
  on-primary: '#002388'
  primary-container: '#2e5bff'
  on-primary-container: '#efefff'
  inverse-primary: '#124af0'
  secondary: '#b7c8e1'
  on-secondary: '#213145'
  secondary-container: '#3a4a5f'
  on-secondary-container: '#a9bad3'
  tertiary: '#ffb59b'
  on-tertiary: '#5b1a00'
  tertiary-container: '#c24100'
  on-tertiary-container: '#ffece6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c3ff'
  on-primary-fixed: '#001356'
  on-primary-fixed-variant: '#0035be'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812800'
  background: '#11131c'
  on-background: '#e2e1ef'
  surface-variant: '#33343e'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 640px
  gutter: 24px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style
The design system for this product is rooted in **Modern Minimalism** with a focus on high-end technology and focused user flows. It aims to evoke a sense of precision, exclusivity, and speed. The brand personality is "Quietly Powerful"—it doesn't shout; it performs.

The target audience consists of tech-savvy professionals and enthusiasts who value clarity over clutter. The UI follows a strict single-column philosophy to minimize cognitive load and guide the user through a singular, intentional path. Visual interest is generated not through complex imagery, but through the interplay of deep blacks, vibrant electric accents, and generous whitespace (or "dark space").

## Colors
The palette is built on a foundation of "Deep Charcoal" (#0A0A0A) to create an infinite depth effect. 

- **Primary:** An "Electric Blue" (#2E5BFF) used sparingly for high-contrast calls to action and critical interactive states.
- **Secondary:** A "Slate Gray" (#64748B) used for supporting elements and secondary icons.
- **Neutral/Surface:** A slightly lighter charcoal (#171717) is used for cards and containers to create subtle separation from the background.
- **Functional:** Success, warning, and error states should utilize desaturated versions of green and red to maintain the premium, understated aesthetic.

## Typography
This design system utilizes **Inter** across all roles to ensure a systematic and utilitarian feel. For headlines, we employ a tighter letter-spacing and heavier weights to create a "wide" and impactful presence. 

Body text is optimized for readability with a generous 1.6x line height. To maintain the minimalist aesthetic, hierarchy is established through drastic size differences and weight shifts rather than color variations. Display styles should be used exclusively for hero sections and major transition points in the user flow.

## Layout & Spacing
The layout philosophy is a **Fixed-Width Single Column**. This creates a focused, "editorial" feel that guides the eye vertically without distraction.

- **Desktop:** The main content area is capped at 640px and centered.
- **Vertical Rhythm:** A strict 8px grid governs all spacing. Section gaps are intentionally large (80px+) to allow the design to "breathe."
- **Reflow:** On mobile devices, margins shrink to 20px, but the single-column structure remains identical, ensuring a consistent experience across all hardware.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and **Subtle Glows** rather than traditional heavy shadows.

- **Level 0:** Background (#0A0A0A).
- **Level 1:** Surface (#171717). Used for primary cards.
- **Interactions:** Hover states on interactive elements should trigger a subtle backdrop-blur or a very soft, low-opacity electric blue outer glow (blur: 20px, opacity: 0.1) to simulate the feel of a high-tech interface. 
- **Dividers:** Use 1px borders with #1F1F1F instead of shadows to maintain a crisp, flat aesthetic.

## Shapes
The shape language is **Soft** but disciplined. We use 0.25rem (4px) as the base radius for most components to maintain a professional, architectural feel. 

Larger containers (Cards) use 0.5rem (8px) to soften the overall visual impact. We avoid pill-shapes (except for specific tags) to keep the UI looking "tech" rather than "lifestyle."

## Components
- **Buttons:** Primary buttons feature a solid Electric Blue fill with white text. Secondary buttons are ghost-style with a subtle Slate Gray border. Use a slight scale-down effect (98%) on click to provide tactile feedback.
- **Inputs:** Fields are dark (#171717) with a 1px border that illuminates to Electric Blue when focused. 
- **Cards:** No shadows; use 1px borders (#1F1F1F) and a very subtle linear gradient (Top-Left to Bottom-Right) from #171717 to #111111.
- **Chips/Tags:** Small, capitalized labels with a dark Slate Gray background and high-contrast light gray text.
- **Progress Indicators:** Use thin, 2px Electric Blue lines to maintain the minimalist, high-tech aesthetic.
- **Lists:** Items are separated by generous padding (16px) and thin, low-contrast dividers.
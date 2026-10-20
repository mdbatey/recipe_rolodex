# 0002: Vintage index-card visual style

Status: accepted (2026-10-20).

## Decision

The site uses a vintage recipe-box style: cream index cards with ruled lines on kraft paper, typewriter type for labels and body text, handwriting for recipe titles and notes, taped snapshots for photos, colored divider tabs for tag filters, and red rubber-stamp tags.

A clean, modern style was considered. The vintage style was chosen because it suits a personal recipe collection and the "rolodex" name.

## Consequences

- The design system lives in `docs/design/`: `DESIGN.md` (rules and components), `tokens.css` (design tokens) and `mockups/` (reference HTML and screenshots). Pages and components are built to match it.
- The look stays within ADR 0001: plain CSS with custom properties, no UI framework, and no literal flip-through animation.
- It needs three web fonts (Special Elite, Courier Prime and Caveat), preferably self-hosted.
- Text sits on ruled lines, so line-height must match the rule spacing tokens. This constrains type sizes inside cards.
- The site is light-only for now; dark mode would need its own design.

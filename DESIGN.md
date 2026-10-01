---
name: Kroma
description: High-fidelity browser image transformation and neural computer vision studio.
colors:
  background-canvas: "#fafafa"
  background-surface: "#ffffff"
  background-inset: "#f4f4f5"
  background-overlay: "rgba(9, 9, 11, 0.85)"
  background-control: "#ffffff"
  text-default: "#09090b"
  text-muted: "#71717a"
  text-subtle: "#a1a1aa"
  border-default: "#e4e4e7"
  border-muted: "#f4f4f5"
  accent-default: "#09090b"
  accent-ai: "#7c3aed"
typography:
  page-heading:
    fontFamily: "var(--font-outfit), Outfit, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
  section-heading:
    fontFamily: "var(--font-outfit), Outfit, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "var(--font-outfit), Outfit, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  supporting:
    fontFamily: "var(--font-outfit), Outfit, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.25
  metadata:
    fontFamily: "var(--font-outfit), Outfit, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.25
rounded:
  control: "0.375rem"
  panel: "0.5rem"
  overlay: "0.75rem"
  pill: "9999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "6": "1.5rem"
  "8": "2rem"
components:
  button-subtle:
    backgroundColor: "{colors.background-inset}"
    textColor: "{colors.text-default}"
    rounded: "{rounded.control}"
    height: "2rem"
  button-solid:
    backgroundColor: "{colors.accent-default}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    height: "2.25rem"
  surface:
    backgroundColor: "{colors.background-surface}"
    textColor: "{colors.text-default}"
    rounded: "{rounded.panel}"
  input:
    backgroundColor: "{colors.background-control}"
    textColor: "{colors.text-default}"
    rounded: "{rounded.control}"
    height: "2.25rem"
---

# Design System: Kroma

## Overview

**Creative north star: Studio Precision & Direct Utility.**

Kroma is an image manipulation and neural vision studio built for immediate, high-fidelity execution directly in the browser. The interface must prioritize work over decoration: upload, process, preview, and download. It feels compact, functional, and razor-sharp, eliminating corporate filler, sales fluff, and artificial decorative devices.

The **Kroma Studio** (`apps/web/src/app/(protected)/studio/`) is the canonical visual authority for the entire application. Every public or administrative page derives its styling, density, and tone from the Studio.

When making a UI decision, follow this sequence:

1. Identify the user's operational task, input image state, and output expectations.
2. Establish page, section, and tool hierarchy.
3. Assign structural layers: Canvas, Surface, Inset, or Overlay.
4. Establish action priority: AI neural operations, standard CV adjustments, or dimensional presets.
5. Verify states: idle dropzone, drag-over, queue waiting (#pos), processing progress, success download, and error recovery.

The default answer is always the quietest, most direct component that accomplishes the task.

---

## Colors

### Structural layers

Background tokens define structural responsibility, never arbitrary decoration:

- **`background.canvas` (`#FAFAFA`):** The root application background. Tool grids, studio headers, and main views rest directly upon it.
- **`background.surface` (`#FFFFFF`):** Independent content objects: tool cards, dialogs, preview viewports, and sidebar menus. **Hard rule:** All Surfaces have a `border.default` boundary; background fill alone is never sufficient separation from Canvas.
- **`background.inset` (`#F4F4F5`):** Secondary or supporting elements: metadata panels, preset pills, code blocks, parameter chips, and dropzone zones in idle states.
- **`background.overlay` (`rgba(9, 9, 11, 0.85)`):** Temporary floating viewports above document flow: modal backdrops, dialogs, and command palettes.
- **`background.control` (`#FFFFFF`):** Buttons, inputs, sliders, and interactive controls.

**Hierarchy constraint:** Avoid Surface-in-Surface nesting. Subordinate blocks belong on Inset. Avoid Inset-in-Inset.

### Foregrounds and borders

- **`text.default` (`#09090B` — Deep Ink):** Primary UI copy, headings, and data labels. **Hard rule:** Never use pure black (`#000000`). Contrast anchor is always Deep Ink.
- **`text.muted` (`#71717A`):** Supporting copy, tool descriptions, and secondary metadata.
- **`text.subtle` (`#A1A1AA`):** Inactive icons, subtle breadcrumbs, and disabled hints.
- **`border.default` (`#E4E4E7`):** Canonical border separating regions and bounding Surfaces.
- **`border.muted` (`#F4F4F5`):** Quiet internal separators and table dividers.

### Semantic Accents & Meaning

- **Primary Action (`#09090B`):** Deep Ink background with crisp white text. Confident and utilitarian.
- **AI Neural Accent (`#7C3AED` / `purple-500`):** Reserved exclusively for neural computer vision models (U2-Net background removal and LapSRN super-resolution). Uses subtle purple tint (`bg-purple-50/40`, `border-purple-200/80`) and a compact `IA` tag with `Sparkles`. Never use purple as a general decorative wash over standard tools.
- **Operational / Success (`#10B981` / `emerald-500`):** Process complete status, verified session badges, and credit availability.
- **Destructive / Error (`#EF4444` / `red-500`):** Job failures, queue timeouts, canvas clear confirmations, and sign out.
- **Credit Badges (`Coins` icon):** Displayed with tabular numbers or monospace font (`font-mono text-xs`). Always transparent: costs are visible before execution.

---

## Typography

### Font Mandate

- **Strict Mandate:** **Outfit** (`var(--font-outfit)`).
- **Absolute Ban:** Never use **Inter** or default system sans-serifs for product typography.

### Type Scale & Hierarchy

- **`PageHeading`:** 1.5rem (24px) to 2rem (32px), weight 600, leading 1.25. The single primary title of a workspace screen.
- **`SectionHeading`:** 1.125rem (18px) to 1.25rem (20px), weight 600, leading 1.4. Subdivides tool groups.
- **`Body`:** 0.875rem (14px), weight 400, leading 1.5. Tool descriptions, explanations, and dialog content.
- **`Supporting`:** 0.75rem (12px), weight 400, leading 1.25. Secondary notes and parameters.
- **`Metadata`:** 0.75rem (12px), weight 500, tabular/monospace. Exact dimensions (`1080x1080`), aspect ratios (`16:9`), credit counts (`10 créditos`), elapsed timer (`1.4s`), and queue status.

**Formatting bans:**

- No kickers or eyebrows above headings. Headings carry their own weight.
- No gradient text. Emphasis comes from weight or size.
- No monospace as a costume for "tech" jargon; monospace is strictly reserved for measurements, code, and numerical data.

---

## Layout & Component Rules

### Density and Surfaces

- Compact, intentional spacing: controls default to `h-9` or `h-10`, buttons to `h-10` or `h-11`, chips and pills to `h-7`.
- **Card boundaries:** All Cards are Surfaces and all Surfaces have borders (`border border-zinc-200`).
- **Shadows:** Only soft, multi-layer depth (`0 1px 2px rgb(0 0 0 / 4%)`). **Absolute ban:** Hard zero-blur offset block shadows (`4px 4px 0`) or colored glowing halos.

### Component Recipes

1. **Tool Cards:**
   - AI tools: Soft purple border (`border-purple-200/80`), subtle tint (`bg-purple-50/30`), `IA` badge with `Sparkles`, and credit tag.
   - Standard tools: Clean neutral border (`border-zinc-200`), distinct tool icon color, name, description, and credit pill.
2. **Social Media & Dimension Presets:**
   - Pills with real SVG brand icons (`/icons/*.svg`), platform name, and exact pixel dimensions in monospace (`1080x1080`).
3. **Editor Split Screen:**
   - Left: Input dropzone (drag-and-drop, real preview with instant clear button, width x height, file size, and mime-type panel).
   - Right: Output panel (live spinner, queue position counter, elapsed time counter in seconds, download PNG button).
4. **Icons & Visual Elements:**
   - Exclusively **Lucide Icons** in a consistent 1.5px to 2px stroke.
   - **Absolute Ban:** No emojis or emoticons anywhere in user interfaces or system copy.

### Interaction & Feedback

- Visible, accessible keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2`).
- **Hover behavior:** Never scale up or animate an image on hover (images are not buttons). The containing interactive card receives the subtle background or border highlight.
- Tactile feedback: Subtle active compression (`active:scale-[0.99]`).

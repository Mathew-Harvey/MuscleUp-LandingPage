# Image mapping: PDF ↔ Landing page

**Assumption:** `image_01.png` … `image_31.png` were extracted from `RingMuscleUp.pdf` in page order (page 1 → image_01, page 2 → image_02, …). The guide is described as "31 Pages of Instruction" on the landing page.

**Current mapping used in `index.html`:**

| Landing page slot | Purpose | Current image |
|------------------|---------|---------------|
| **Hero** | Main ring muscle up / cover-style shot | `image_01.png` (PDF p.1) |
| **Gallery 1** | Core progression with rings | `grok-image-dcffe4de-8fc7-4857-baa1-73bba1005a73.png` |
| **Gallery 2** | Ring strength exercise | `image_15.png` |
| **Gallery 3** | Pull-up progression | `image_16.png` |
| **Gallery 4** | False grip pull-up | `image_17.png` |
| **Gallery 5** | Ring dip position | `bardipbottom.png` |
| **Gallery 6** | Ring support hold | `image_19.png` |
| **Annotated 1** | Phase 1 — pull and transition | `image_08.png` |
| **Annotated 2** | Phase 2 — transition and catch | `image_09.png` |
| **Annotated 3** | Phase 3 — press to support | `image_10.png` |
| **Approach section** | Arm extension stretch (mobility) | `armExtensionStretch.png` |
| **Wide break** | Core exercise progression (rings in every panel) | `grok-image-dcffe4de-8fc7-4857-baa1-73bba1005a73.png` |

**How to verify or correct**

1. Open `assets/RingMuscleUp.pdf` and note the **page number** for:
   - The hero/cover-style image
   - The 6 gallery-style photos (hang, strength, pull-up, false grip, dip, support)
   - The 3 annotated movement phase images
   - The false-grip close-up
   - The wide progression sequence image
2. If a page number doesn’t match the table (e.g. hero is on page 3, not 1), change the `image_XX` in `index.html` to the correct number (e.g. `image_03.png` for hero).
3. Images **image_13.png … image_31.png** are available if you want to swap in different pages (e.g. use a later page for hero or gallery).

**Gallery note:** The gallery was changed from image_02–07 to image_14–19 so it shows more actual ring work (pages 14–19 are often in the middle of the programme where ring hangs, pull-ups, dips, and support are taught). If you prefer a different block (e.g. 20–25 or 21–26), edit the six `gallery-grid` image `src` values in `index.html`.

**Quick reference:** In `index.html`, search for `assets/images/image_` to find all 12 image references.

You are updating my personal interactive portfolio site (`natemaxfield.com`).

### CRITICAL RULE: KEEP THE INTERACTIVITY, FIX THE FONT & REPLACE ALL HALLUCINATIONS
Do NOT remove the interactive mechanics: keep the dark atmospheric aesthetic, the right-side scroll progress/telemetry bar, the `[ Blueprint Mode ]` toggle, the 3D/canvas neural particle mesh in the hero, the interactive hexagon node graph in Section 02, the horizontal draggable card reel in Section 03, the spring-physics draggable Bento grid in Section 04, and the interactive CLI terminal in Section 05.

However, the current display font is breaking the layout, and much of the copy is hallucinated. Apply the following exact changes across typography, layout, and content:

---

### 1. TYPOGRAPHY & CSS OVERFLOW FIXES
* **Remove the ultra-wide/extended display font immediately.** It is hard to read in the hero and overflows the card containers in Section 03 ("White Mou...", "Adironda...").
* **New Font Pairing:**
  * Headings: Use **Geist Sans**, **Plus Jakarta Sans**, or **Inter Tight** (`font-weight: 600` to `700`, tight tracking `-0.03em`, normal width—never extended or stretched).
  * Body: **Inter** or **Geist Sans** (`font-weight: 400`, clean and legible with comfortable line height).
  * Code / Telemetry / Pills / Terminal: **JetBrains Mono** or **Geist Mono**.
* **Fix Card Clipping:** In Section 03 (and all card headings), use responsive sizing (`clamp(1.5rem, 2.5vw, 2.25rem)`) with `overflow-wrap: break-word` so titles never clip or overflow their containers.

---

### 2. HERO SECTION (New Headline & Styling)
* **Top Bar:** Keep `NM // STUDIO` on the left, `WAKEFIELD, MA · NEW ENGLAND` in the center, and the green `● available` status pill on the right.
* **Hero Headline:** Replace `"Trains models by day, builds sheds by night"` with:
  **"AI engineering by day. Family life, tinkering, and side quests by night."**
  * Keep the multi-color accent styling from the original hero: highlight **"Family life, tinkering,"** in the warm glowing orange accent and **"side quests"** (or **"by night."**) in the bright cyan accent, rendered in the new clean sans-serif font.
* Keep the interactive 3D/canvas neural network particle mesh beside the headline.

---

### 3. SECTION 01: THE PIPELINE (Accurate Projects & Tech Stack)
* **Section Header:** `01 THE PIPELINE` — **"Enterprise scale meets late-night side quests."**
* **Intro Copy:** `"By day I work as an engineer on teams developing AI models and systems at Microsoft. After hours, between family life in New England, I run Maxfield Labs—tinkering on native apps, consumer utilities, and digital platforms for causes close to home."`
* **Replace all 6 Project Cards with accurate data (remove the generic RAG, dashboard, and LoRA ticket-routing filler cards, and fix the descriptions for Maxfield Labs, FetchOil, and Stairway to STEM):**

  1. **Microsoft AI**
     * Badge: `● DAY JOB` | Meta: `Production AI`
     * Title: `Core AI Model Engineering`
     * Description: `Developing, evaluating, and shipping artificial intelligence models and the engineering systems around them at Microsoft.`
     * Tags: `AI Models` `Eval Systems` `Scale`

  2. **Maxfield Labs**
     * Badge: `● STUDIO` | Meta: `maxfieldlabs.com`
     * Title: `Maxfield Labs`
     * Description: `My independent software studio and technical consultancy—building custom applications, high-performance web architecture, and technical SEO strategy.`
     * Tags: `Product Studio` `Web Architecture` `SEO`

  3. **MaxAds**
     * Badge: `● SHIPPED APP` | Meta: `macOS & OAuth Verified`
     * Title: `MaxAds`
     * Description: `A proprietary application built under Maxfield Labs, engineered through full Google OAuth brand verification and shipped via the Apple App Store.`
     * Tags: `macOS` `Apple App Store` `Google OAuth`

  4. **FetchOil**
     * Badge: `● LIVE UTILITY` | Meta: `fetchoil.com`
     * Title: `FetchOil`
     * Description: `A free consumer utility and tracking platform built for New England homeowners to monitor local heating oil prices and track tank consumption.` *(Note: This has nothing to do with outdoor trail gear!)*
     * Tags: `Consumer Tool` `Price Tracking` `New England`

  5. **Stairway to STEM**
     * Badge: `● NONPROFIT PLATFORM` | Meta: `stairwaytostem.org`
     * Title: `Stairway to STEM`
     * Description: `A nonprofit resource platform helping neurodivergent students transition to college in STEM—a mission close to home raising two kids on the spectrum. Led the migration to a fast static architecture, search findability overhaul, and sustainable nonprofit transition.`
     * Tags: `Static Architecture` `Accessibility` `EdTech`

  6. **Digital Strategy & Web Builds**
     * Badge: `● CLIENT & ADVISORY` | Meta: `Shipped`
     * Title: `BrainStorm, Fit Revolution & More`
     * Description: `Web iterations and SEO strategy for the documentary film BrainStorm, technical architecture for Fit Revolution, and consumer-protection web engineering for Crestwood Loan Advisors.`
     * Tags: `Web Engineering` `Domain Strategy` `UX`

---

### 4. SECTION 02: THE LAB (Replace the "Woodshed & Home Assistant" Hallucination)
* **Concept Change:** I do not wire Arduino temperature sensors to a woodshed or waterfall feature. Re-theme this interactive hexagon node graph from a "Home Assistant woodshed rig" to **"The Homelab & Side-Quest Rig"** (how my local AI environment and side-project pipeline connect).
* **Section Header:** `02 THE LAB` — **"Inside the *homelab* & build stack."**
* **Left Column Copy:**
  `"After hours, the workbench is a mix of local LLM environments, macOS builds, static edge deployments, and video/photo production gear. Click a node or toggle simulation mode to inspect how side quests move from local experiments to shipped tools."`
* **Interactive Graph Nodes (keep the glowing central hexagon + connected satellite nodes):**
  * Center Hub: `MAXFIELD LABS CORE`
  * Connected Nodes: `Local LLM Rig`, `MaxAds (macOS / OAuth)`, `FetchOil Telemetry`, `Static Edge (Stairway to STEM)`, `Media & Video Pipeline`, `UNE Coursework ('26)`.
* Keep the interactive toggle button (e.g., `● RUN PIPELINE DIAGNOSTIC`) and live event log box underneath.

---

### 5. SECTION 03: OUTSIDE THE MACHINE (Replace Fake Mountain Summits with Real Places)
* **Section Header:** `03 FIELD NOTES` — **"Outside the *machine*."**
* **Replace the 4 cards (White Mountains, Cape Cod, The Rock, Adirondacks) with places and adventures I actually do.** Keep the horizontal draggable card layout and green waveform aesthetic, and ensure titles fit cleanly inside the cards without clipping:

  1. `#01 WAKEFIELD / SAUGUS, MA`
     * Title: **Breakheart Trails**
     * Subtitle: `Local forest loops, rocky ridges, and year-round trail miles right out the back door with my golden-lookalike mutt.`
     * Pill: `local stomping grounds`

  2. `#02 MAINE`
     * Title: **Kennebec & The Coast**
     * Subtitle: `Summer whitewater rafting runs down the Kennebec River rapids and coastal trips up to Biddeford.`
     * Pill: `rapids & coast`

  3. `#03 CARIBBEAN`
     * Title: **St. Lucia & Puerto Rico**
     * Subtitle: `Hiking rainforest trails and waterfalls in Soufrière and El Yunque, beach downtime, and walking Old San Juan with Katie.`
     * Pill: `island & rainforest`

  4. `#04 WEST COAST & RAILS`
     * Title: **Redmond to New England**
     * Subtitle: `Cross-country hops to Seattle and Microsoft's Redmond campus, family trips to Orlando, and Amtrak Business Class whenever the rails beat the airport.`
     * Pill: `sky & rail`

---

### 6. SECTION 04: THE OTHER VARIABLES (Fix the Draggable Bento Grid)
* Keep the spring-physics drag behavior (`"Drag a tile — it fights back with a spring"`), and replace the cards with these exact 6 tiles (putting my family first and removing the fake coffee and gardening cards):
  * 🏠 **The Household** (Large Feature Card): `"Life in Wakefield with my wife Katie, our son and daughter (both on the spectrum and keeping us on our toes), a golden-lookalike mutt who lives for trail walks and the pool, and two cats who actually run the house."`
  * 🎸 **Live Music & Guitars**: `"Summer amphitheater runs across New England (Dave Matthews Band at Mansfield, Gilford NH, Hartford CT) and playing acoustic and electric guitars at home."`
  * 🏊 **Backyard & DIY**: `"Maintaining the backyard pool for New England summers and tackling practical home renovations and woodworking projects when something actually needs building."`
  * 💻 **Late-Night Side Quests**: `"Homelab LLM setups, shipping apps through Maxfield Labs, photography, video production, and sporadic 3D printing."`
  * 🎓 **Lifelong Learner**: `"Always adding a new lane—including Fall 2026 coursework at the University of New England."`
  * 🌲 **New England Rhythm**: `"Four distinct seasons north of Boston—poolside in July, crisp trail hikes in October, and tracking heating oil prices by December."`

---

### 7. SECTION 05: THE TERMINAL & RIGHT-RAIL SCROLL TELEMETRY
* **Update Terminal Commands:** Keep the interactive terminal and clickable command pills (`ABOUT`, `AI`, `PROJECTS`, `FAMILY`, `LAB`, `MUSIC`, `PETS`, `WHOAMI`). Audit the JavaScript dictionary backing the terminal responses so none of the commands mention building sheds by night, selling outdoor gear on FetchOil, or hiking 34 White Mountain 4000-footers. Ground every terminal response in the updated facts above.
* **Clean Up Right-Side Scroll Indicator:** Remove the lumber measurements (`2x4 16" OC 4x4 PT`) and mountain elevation numbers (`1,400' / 2,100'`) from the right-hand vertical scroll bar. Replace them with clean states matching the sections: `01 pipeline` -> `02 homelab` -> `03 field notes` -> `04 variables` -> `05 terminal`.

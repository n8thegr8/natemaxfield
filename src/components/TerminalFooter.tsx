"use client";

import { useEffect, useRef, useState } from "react";
import { useSectionCursor } from "./hooks";

// Section 05: THE TERMINAL — Interactive CLI shell grounded in real facts.
// Supports clickable command pills (ABOUT, AI, PROJECTS, FAMILY, LAB, MUSIC, PETS, WHOAMI)
// plus bonus inspection commands (TRAVEL, CLEAR, HELP).
const COMMANDS: Record<string, string[]> = {
  about: [
    "Nate Maxfield — AI engineer at Microsoft by day; tinkerer, builder, and",
    "family man after hours. Based in Wakefield, MA with my wife Katie, our son",
    "and daughter (both on the spectrum), a Golden Retriever, and two cats.",
  ],
  ai: [
    "By day I work as an engineer on teams developing, evaluating, and shipping",
    "artificial intelligence models and the engineering systems around them at",
    "Microsoft — focused on eval harnesses, reliability, latency, and scale.",
  ],
  projects: [
    "• Microsoft AI — Core AI model engineering & evaluation systems",
    "• Maxfield Labs (maxfieldlabs.com) — Independent software studio & SEO consultancy",
    "• MaxAds — Proprietary macOS app (Google OAuth verified, Apple App Store)",
    "• FetchOil (fetchoil.com) — Free New England heating oil price & tank utility",
    "• Stairway to STEM (stairwaytostem.org) — Nonprofit platform for neurodivergent STEM students",
    "• Client & Advisory — Maxfield Esthetics, Fit Revolution, Crestwood Loan Advisors",
  ],
  family: [
    "Life in Wakefield, MA with my wife Katie, our son and daughter (both on the",
    "spectrum and keeping us on our toes), a Golden Retriever who lives for",
    "Breakheart trail walks and the backyard pool, and two cats who run the house.",
  ],
  lab: [
    "MAXFIELD LABS CORE — After hours, the workbench is a mix of local LLM rigs,",
    "signed macOS builds (MaxAds), FetchOil telemetry, static edge deployments",
    "(Stairway to STEM), photo/video production gear, and 3D printing / DIY.",
  ],
  music: [
    "Summer amphitheater runs across New England (Dave Matthews Band at Mansfield,",
    "Gilford NH, Hartford CT) and playing acoustic and electric guitars at home.",
  ],
  pets: [
    "1x Golden Retriever (Breakheart trail partner + backyard pool enthusiast)",
    "2x Cats (actual household management)",
  ],
  whoami: [
    "nate.maxfield :: ai_engineer(microsoft) · founder(maxfield_labs) · husband(katie) · dad(2) · wakefield_ma",
  ],
  travel: [
    "Breakheart Reservation trails out the back door · Whitewater rafting the",
    "Kennebec River & Maine coast · Rainforest hikes in St. Lucia",
    "(Soufrière) & Puerto Rico (El Yunque, Old San Juan) · Redmond campus hops,",
    "Orlando family trips, and Amtrak Business Class whenever the rails beat the airport.",
  ],
  help: [
    "available commands: about · ai · projects · family · lab · music · pets · whoami · travel · clear",
  ],
};

const PRIMARY_PILLS = [
  "about",
  "ai",
  "projects",
  "family",
  "lab",
  "music",
  "pets",
  "whoami",
] as const;

const HISTORY_SEED = [
  "$ whoami",
  "nate.maxfield :: ai_engineer(microsoft) · founder(maxfield_labs) · husband(katie) · dad(2) · wakefield_ma",
  "$ about",
  "Nate Maxfield — AI engineer at Microsoft by day; tinkerer, builder, and",
  "family man after hours. Based in Wakefield, MA with my wife Katie, our son",
  "and daughter (both on the spectrum), a Golden Retriever, and two cats.",
];

export default function TerminalFooter() {
  const sectionRef = useSectionCursor("tech") as React.RefObject<HTMLElement>;
  const [lines, setLines] = useState<string[]>(HISTORY_SEED);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hidx, setHidx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    setLines((l) => [...l, `$ ${raw.trim()}`]);
    setHistory((h) => [raw.trim(), ...h]);
    setHidx(-1);
    setValue("");

    if (cmd === "clear") {
      setLines([]);
      return;
    }
    const out = COMMANDS[cmd] ?? [
      `command not found: ${cmd.toUpperCase()}`,
      "try: ABOUT · AI · PROJECTS · FAMILY · LAB · MUSIC · PETS · WHOAMI · HELP · CLEAR",
    ];
    out.forEach((line, i) => {
      setTimeout(() => setLines((l) => [...l, line]), i * 110);
    });
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") run(value);
    else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const ni = Math.min(hidx + 1, history.length - 1);
      setHidx(ni);
      setValue(history[ni] ?? "");
    } else if (e.key === "ArrowDown" && history.length) {
      e.preventDefault();
      const ni = Math.max(hidx - 1, 0);
      setHidx(ni);
      setValue(history[ni] ?? "");
    }
  };

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="flex min-h-screen flex-col justify-center py-28 md:py-40"
    >
      <div className="mx-auto w-full max-w-3xl px-6 md:px-10">
        <div className="mb-6 flex items-baseline gap-3">
          <span
            className="rounded px-2 py-0.5 font-mono text-xs font-bold"
            style={{
              color: "var(--neural)",
              background: "color-mix(in srgb, var(--neural) 12%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--neural) 30%, transparent)",
            }}
          >
            05
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-pewter">
            the terminal
          </span>
        </div>

        <p className="mb-8 font-display text-3xl font-bold text-chalk md:text-4xl">
          Point your <em style={{ color: "var(--neural)" }}>cursor</em> here and
          ask me something.
        </p>

        <div
          className="overflow-hidden rounded-xl border bg-[rgba(8,12,18,0.92)] shadow-2xl"
          style={{
            borderColor: "color-mix(in srgb, var(--neural) 35%, transparent)",
            boxShadow:
              "0 25px 60px rgba(0,0,0,0.6), 0 0 35px color-mix(in srgb, var(--neural) 10%, transparent)",
          }}
        >
          {/* Title bar */}
          <div className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--pewter)_15%,transparent)] bg-black/30 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[var(--coral)]/80" />
              <span className="h-3 w-3 rounded-full bg-[var(--sawdust)]/80" />
              <span className="h-3 w-3 rounded-full bg-[var(--pine)]/80" />
              <span className="ml-2 font-mono text-[11px] text-pewter">
                nate@maxfieldlabs: ~ (zsh)
              </span>
            </div>
            <button
              onClick={() => run("clear")}
              className="font-mono text-[10px] text-pewter/60 hover:text-neural"
            >
              [clear]
            </button>
          </div>

          {/* Transcript */}
          <div
            ref={scrollRef}
            onClick={() => inputRef.current?.focus()}
            className="max-h-80 overflow-y-auto px-5 py-4 font-mono text-[13px] leading-relaxed text-pewter"
          >
            {lines.map((l, i) => (
              <div
                key={i}
                className="py-0.5"
                style={{
                  color: l.startsWith("$") ? "var(--neural)" : "var(--chalk)",
                  opacity: l.startsWith("$") ? 1 : 0.88,
                }}
              >
                {l}
              </div>
            ))}
            {/* Input line */}
            <div className="mt-2 flex items-center gap-2 text-chalk">
              <span style={{ color: "var(--pine)" }}>
                nate@maxfieldlabs:~$
              </span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKey}
                placeholder="type a command or click a pill below…"
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal input"
                className="flex-1 bg-transparent font-mono text-[13px] text-chalk placeholder-pewter/35 outline-none"
                style={{ caretColor: "var(--neural)" }}
              />
            </div>
          </div>
        </div>

        {/* Clickable command pills: ABOUT, AI, PROJECTS, FAMILY, LAB, MUSIC, PETS, WHOAMI */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-pewter/60">
            EXECUTE:
          </span>
          {PRIMARY_PILLS.map((c) => (
            <button
              key={c}
              onClick={() => {
                run(c);
                inputRef.current?.focus();
              }}
              className="chip transition-colors hover:border-[color-mix(in_srgb,var(--neural)_55%,transparent)] hover:text-neural"
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-[color-mix(in_srgb,var(--pewter)_15%,transparent)] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] text-pewter/60">
            © {new Date().getFullYear()} nate maxfield · wakefield, ma ·
            father · husband · ai engineer · maxfield labs
          </p>
          <div className="flex flex-wrap gap-5 font-mono text-[11px]">
            {[
              ["maxfieldlabs.com", "https://maxfieldlabs.com"],
              ["fetchoil.com", "https://fetchoil.com"],
              ["stairwaytostem.org", "https://stairwaytostem.org"],
              ["github", "https://github.com/n8thegr8"],
              ["linkedin", "https://linkedin.com/in/natemaxfield"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-pewter transition-colors hover:text-neural"
              >
                {label} →
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

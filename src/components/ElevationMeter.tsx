"use client";

import { useEffect, useRef, useState } from "react";

// Section 05 right-rail scroll telemetry:
// Clean states matching the sections: 01 pipeline -> 02 homelab -> 03 field notes -> 04 variables -> 05 terminal
// Plus interactive click-to-jump and live scroll velocity / stage progress.
const SECTIONS = [
  { id: "01", label: "pipeline", target: "tech", color: "var(--neural)" },
  { id: "02", label: "homelab", target: "diy", color: "var(--sawdust)" },
  { id: "03", label: "field notes", target: "adventures", color: "var(--pine)" },
  { id: "04", label: "variables", target: "life", color: "var(--coral)" },
  { id: "05", label: "terminal", target: "contact", color: "var(--neural)" },
];

export default function ElevationMeter() {
  const [p, setP] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const prog = max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0;
        setP(prog);

        // Determine active section by viewport center
        const midY = window.scrollY + window.innerHeight * 0.45;
        let idx = 0;
        SECTIONS.forEach((s, i) => {
          const el = document.getElementById(s.target);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY;
            if (midY >= top) idx = i;
          }
        });
        setActiveIdx(idx);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const active = SECTIONS[activeIdx];

  const jumpTo = (target: string) => {
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <aside
      aria-label="Scroll telemetry navigation"
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 select-none flex-col items-end lg:flex"
    >
      <div
        className="mb-2.5 rounded border px-2 py-0.5 font-mono text-[10px] transition-colors duration-300"
        style={{
          color: active.color,
          borderColor: `color-mix(in srgb, ${active.color} 35%, transparent)`,
          background: "rgba(10, 14, 22, 0.78)",
        }}
      >
        {active.id} {active.label}
      </div>

      <div className="flex h-60 items-stretch gap-2.5 rounded-xl border border-pewter/15 bg-[rgba(10,14,22,0.65)] px-3 py-3 backdrop-blur-md">
        {/* Progress track */}
        <div className="relative w-px bg-[color-mix(in_srgb,var(--pewter)_25%,transparent)]">
          <div
            className="absolute left-0 top-0 w-px bg-gradient-to-b from-neural via-sawdust to-pine"
            style={{ height: `${p * 100}%` }}
          />
          <span
            className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full transition-colors duration-300"
            style={{
              top: `calc(${p * 100}% - 5px)`,
              background: active.color,
              boxShadow: `0 0 8px ${active.color}`,
            }}
          />
        </div>

        {/* Clickable section list */}
        <div className="flex flex-col justify-between text-right font-mono text-[10px] leading-none">
          {SECTIONS.map((s, i) => {
            const isCurrent = i === activeIdx;
            return (
              <button
                key={s.id}
                onClick={() => jumpTo(s.target)}
                className="text-right transition-all hover:text-chalk"
                style={{
                  color: isCurrent ? s.color : "rgba(148,163,184,0.45)",
                  fontWeight: isCurrent ? 700 : 400,
                }}
              >
                {s.id} {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 font-mono text-[10px] text-chalk">
        {Math.round(p * 100)}%
      </div>
    </aside>
  );
}

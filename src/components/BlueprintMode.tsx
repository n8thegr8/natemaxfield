"use client";

import { useEffect, useState } from "react";

// "[ Blueprint Mode ]" — flips the live site into a wireframe/blueprint view:
// a crosshatch grid, per-section dimension callouts, and cheeky handwritten
// developer annotations. Toggle it from the floating control.
export default function BlueprintMode() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("blueprint-on", on);
    return () => document.documentElement.classList.remove("blueprint-on");
  }, [on]);

  return (
    <>
      <button
        onClick={() => setOn((v) => !v)}
        className="fixed left-4 bottom-4 z-[60] font-mono text-[11px] px-3 py-1.5 rounded-md border transition-colors"
        style={{
          borderColor: on ? "var(--neural)" : "color-mix(in srgb, var(--pewter) 35%, transparent)",
          color: on ? "var(--neural)" : "var(--pewter)",
          background: on
            ? "color-mix(in srgb, var(--neural) 12%, transparent)"
            : "color-mix(in srgb, #0d1117 70%, transparent)",
          backdropFilter: "blur(6px)",
        }}
        aria-pressed={on}
      >
        [ Blueprint Mode ] {on ? "ON" : ""}
      </button>

      {on && <BlueprintOverlay />}
    </>
  );
}

function BlueprintOverlay() {
  // Dimension callouts + handwritten annotations, anchored to section ids.
  const annotations: { id: string; label: string; note: string; x: string; y: string }[] = [
    {
      id: "hero",
      label: "100vh · canvas hero",
      note: "the net compiles as you scroll",
      x: "6%",
      y: "12%",
    },
    {
      id: "tech",
      label: "perspective:1000px",
      note: "3D tilt follows the mouse",
      x: "8%",
      y: "40%",
    },
    {
      id: "diy",
      label: "node graph · live",
      note: "click a node to inspect",
      x: "82%",
      y: "58%",
    },
    {
      id: "adventure",
      label: "ScrollTrigger · horizontal",
      note: "→ pinned track",
      x: "10%",
      y: "72%",
    },
    {
      id: "chaos",
      label: "bento · spring physics",
      note: "tiles shove their neighbours",
      x: "70%",
      y: "86%",
    },
    {
      id: "footer",
      label: "cmd: help",
      note: "you can type in here",
      x: "8%",
      y: "94%",
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[55]"
      style={{ mixBlendMode: "screen" }}
    >
      {/* crosshatch grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--neural) 20%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--neural) 20%, transparent) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* corner registration marks */}
      {[
        "left-3 top-3",
        "right-3 top-3",
        "left-3 bottom-3",
        "right-3 bottom-3",
      ].map((c) => (
        <div
          key={c}
          className={`absolute ${c} h-5 w-5`}
          style={{
            borderTop: "1px solid var(--neural)",
            borderLeft: "1px solid var(--neural)",
          }}
        />
      ))}

      {/* dimension + handwritten annotations */}
      {annotations.map((a) => (
        <div
          key={a.id}
          className="absolute font-mono"
          style={{ left: a.x, top: a.y }}
        >
          <div
            className="text-[10px]"
            style={{ color: "var(--neural)" }}
          >
            {a.label}
          </div>
          <div
            className="text-[10px] italic"
            style={{
              color: "var(--sawdust)",
              fontFamily: "'Comic Sans MS', var(--font-mono)",
              transform: "rotate(-3deg)",
            }}
          >
            {a.note}
          </div>
        </div>
      ))}
    </div>
  );
}

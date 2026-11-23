"use client";

import { useEffect, useRef, useState } from "react";
import { useCursor } from "./providers";

type StageSpec = {
  id: string;
  sectionId: string;
  index: string;
  code: string;
  label: string;
  env: string;
  accent: string;
  bg1: string;
  bg2: string;
  glow: string;
  gridOpacity: number;
  status: string;
  coords: string;
};

export const STAGES: StageSpec[] = [
  {
    id: "hero",
    sectionId: "hero",
    index: "00",
    code: "ENV.SWITCHBOARD",
    label: "Switchboard",
    env: "NEURAL // TOPO COMPILER",
    accent: "#00f0ff",
    bg1: "#070b12",
    bg2: "#0d1624",
    glow: "rgba(0, 240, 255, 0.16)",
    gridOpacity: 0.45,
    status: "COMPILING MESH → TOPO",
    coords: "42.503° N · 71.072° W",
  },
  {
    id: "tech",
    sectionId: "tech",
    index: "01",
    code: "ENV.PRODUCTION_AI",
    label: "The Pipeline",
    env: "DAYLIGHT // MICROSOFT AI & STUDIO",
    accent: "#00f0ff",
    bg1: "#050d1a",
    bg2: "#0b1e36",
    glow: "rgba(0, 240, 255, 0.22)",
    gridOpacity: 0.75,
    status: "EVALS: PASS · LATENCY: 14ms",
    coords: "REDMOND ⇄ NEW ENGLAND",
  },
  {
    id: "diy",
    sectionId: "diy",
    index: "02",
    code: "ENV.WORKBENCH_RIG",
    label: "The Lab",
    env: "AFTER HOURS // HOMELAB & BENCH",
    accent: "#f59e0b",
    bg1: "#140e07",
    bg2: "#231709",
    glow: "rgba(245, 158, 11, 0.20)",
    gridOpacity: 0.9,
    status: "LOCAL LLM + BENCH: ONLINE",
    coords: "MAXFIELD LABS CORE · LOCAL",
  },
  {
    id: "adventures",
    sectionId: "adventures",
    index: "03",
    code: "ENV.FIELD_NOTES",
    label: "Field Notes",
    env: "OFF-GRID // TRAILS, RIVERS & RAILS",
    accent: "#10b981",
    bg1: "#04130e",
    bg2: "#092218",
    glow: "rgba(16, 185, 129, 0.22)",
    gridOpacity: 0.35,
    status: "GPS LOCK · ELEVATION STREAM",
    coords: "BREAKHEART · KENNEBEC · EL YUNQUE",
  },
  {
    id: "life",
    sectionId: "life",
    index: "04",
    code: "ENV.HOUSEHOLD_VARS",
    label: "The Variables",
    env: "WAKEFIELD // FAMILY, MUSIC & SEASONS",
    accent: "#ff4d6d",
    bg1: "#160812",
    bg2: "#240d1d",
    glow: "rgba(255, 77, 109, 0.18)",
    gridOpacity: 0.4,
    status: "SPRING PHYSICS: ACTIVE · 1 DOG 2 CATS",
    coords: "NORTH OF BOSTON · 4 SEASONS",
  },
  {
    id: "contact",
    sectionId: "contact",
    index: "05",
    code: "ENV.TERMINAL_SHELL",
    label: "The Terminal",
    env: "TTY // INTERACTIVE SHELL",
    accent: "#00f0ff",
    bg1: "#030708",
    bg2: "#081214",
    glow: "rgba(16, 185, 129, 0.18)",
    gridOpacity: 0.6,
    status: "SESSION: NATE@WORKSHOP ~ READY",
    coords: "STDIN: LISTENING",
  },
];

// Parses hex #rrggbb to [r,g,b]
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(hexA: string, hexB: string, t: number) {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  const r = Math.round(lerp(r1, r2, t));
  const g = Math.round(lerp(g1, g2, t));
  const b = Math.round(lerp(b1, b2, t));
  return `rgb(${r}, ${g}, ${b})`;
}

export default function WorldAtmosphere() {
  const { reducedMotion } = useCursor();
  const [activeIdx, setActiveIdx] = useState(0);
  const [flash, setFlash] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blendRef = useRef({ idx: 0, frac: 0, scrollY: 0, progress: 0 });
  const lastIdxRef = useRef(0);

  // Measure section positions and drive CSS custom properties + canvas stage blend
  useEffect(() => {
    let raf = 0;

    const updateFromScroll = () => {
      const doc = document.documentElement;
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

      // Find section centers / tops to calculate continuous stage index (0 .. 5)
      const vh = window.innerHeight;
      const anchorY = scrollY + vh * 0.42;

      const tops: number[] = STAGES.map((s) => {
        const el = document.getElementById(s.sectionId);
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.top + scrollY;
      });

      let idx = 0;
      let frac = 0;
      for (let i = 0; i < tops.length; i++) {
        const curTop = tops[i];
        const nextTop = i < tops.length - 1 ? tops[i + 1] : maxScroll + vh;
        if (anchorY >= curTop) {
          idx = i;
          const span = Math.max(1, nextTop - curTop);
          frac = Math.min(1, Math.max(0, (anchorY - curTop) / span));
        }
      }

      blendRef.current = { idx, frac, scrollY, progress };

      if (idx !== lastIdxRef.current) {
        lastIdxRef.current = idx;
        setActiveIdx(idx);
        setFlash(true);
        setTimeout(() => setFlash(false), 420);
      }

      // Smoothly interpolate between current stage and next stage in the last 35% of the section
      const nextIdx = Math.min(STAGES.length - 1, idx + 1);
      const blendT = frac > 0.65 ? (frac - 0.65) / 0.35 : 0;
      const curStage = STAGES[idx];
      const nextStage = STAGES[nextIdx];

      const bg1 = lerpColor(curStage.bg1, nextStage.bg1, blendT);
      const bg2 = lerpColor(curStage.bg2, nextStage.bg2, blendT);
      const accent = lerpColor(curStage.accent, nextStage.accent, blendT);

      doc.style.setProperty("--stage-bg-1", bg1);
      doc.style.setProperty("--stage-bg-2", bg2);
      doc.style.setProperty("--stage-accent", accent);
      doc.style.setProperty("--scroll-p", progress.toFixed(4));
      doc.setAttribute("data-stage", curStage.id);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateFromScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateFromScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Full-viewport reactive backdrop canvas that morphs its geometry by stage:
  // Stage 0/1: High-tech neural telemetry & Perspective matrix lines
  // Stage 2: Workbench blueprint schematic & warm amber sparks / schematic pulses
  // Stage 3: Topographic contour waves & trail elevation isolines
  // Stage 4: Soundwave / organic family warmth & seasonal drifting fireflies
  // Stage 5: CRT phosphor scanlines & digital rain ticks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const draw = () => {
      const time = performance.now() / 1000;
      const { idx, frac, scrollY } = blendRef.current;
      const stage = STAGES[idx];

      ctx.clearRect(0, 0, w, h);

      // Draw morphing stage-specific ambient geometry
      const [ar, ag, ab] = hexToRgb(stage.accent);

      if (idx === 0 || idx === 1) {
        // STAGE 0 & 1: 3D Perspective Telemetry Horizon Grid + Neural Data Streams
        ctx.save();
        const horizonY = h * 0.68;
        ctx.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, ${idx === 1 ? 0.11 : 0.05})`;
        ctx.lineWidth = 1;

        // Radial perspective lines from vanishing point
        const vx = w * 0.5;
        for (let i = -10; i <= 10; i++) {
          ctx.beginPath();
          ctx.moveTo(vx + i * 45, horizonY);
          ctx.lineTo(vx + i * 260, h);
          ctx.stroke();
        }

        // Moving horizontal scan bars
        const offset = (scrollY * 0.35 + time * 24) % 40;
        for (let y = horizonY; y < h; y += 22 + (y - horizonY) * 0.14) {
          const yy = y + (offset / 40) * 18;
          if (yy < h) {
            ctx.beginPath();
            ctx.moveTo(0, yy);
            ctx.lineTo(w, yy);
            ctx.stroke();
          }
        }

        // Floating tensor / eval packets in Stage 1
        if (idx === 1) {
          ctx.font = "10px monospace";
          ctx.fillStyle = `rgba(${ar}, ${ag}, ${ab}, 0.16)`;
          for (let k = 0; k < 12; k++) {
            const px = ((k * 173 + time * 18) % (w - 120)) + 40;
            const py = ((k * 97 - scrollY * 0.25) % h + h) % h;
            ctx.fillText(
              k % 3 === 0
                ? `[eval_${k}: 0.99${k}]`
                : k % 3 === 1
                ? `tensor<fp16>::sync`
                : `lat: ${(11 + (k % 7)).toFixed(1)}ms`,
              px,
              py
            );
          }
        }
        ctx.restore();
      } else if (idx === 2) {
        // STAGE 2: The Lab / Workbench — Blueprint CAD Crosshairs, Oscilloscope Sine & Amber Sparks
        ctx.save();
        ctx.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, 0.10)`;
        ctx.lineWidth = 1;

        // Rotating CAD schematic compass in background right
        const cx = w * 0.74;
        const cy = h * 0.5;
        for (let r = 80; r <= 320; r += 80) {
          ctx.beginPath();
          ctx.setLineDash(r % 160 === 0 ? [6, 8] : []);
          ctx.arc(cx, cy, r, time * 0.15, time * 0.15 + Math.PI * 1.65);
          ctx.stroke();
        }
        ctx.setLineDash([]);

        // Live oscilloscope signal trace across the middle
        ctx.beginPath();
        ctx.strokeStyle = `rgba(245, 158, 11, 0.18)`;
        ctx.lineWidth = 1.5;
        for (let x = 0; x < w; x += 6) {
          const y =
            h * 0.82 +
            Math.sin(x * 0.018 + time * 3.2) * 18 +
            Math.sin(x * 0.045 - time * 1.8) * 9;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      } else if (idx === 3) {
        // STAGE 3: Field Notes — Sweeping Topographic Contour Isolines (Pine Trail Green)
        ctx.save();
        ctx.strokeStyle = `rgba(16, 185, 129, 0.14)`;
        ctx.lineWidth = 1.2;
        for (let band = 0; band < 7; band++) {
          ctx.beginPath();
          const baseY = (h / 7) * band + ((scrollY * 0.15) % (h / 7));
          for (let x = 0; x <= w; x += 16) {
            const y =
              baseY +
              Math.sin(x * 0.004 + band * 0.9 + time * 0.4) * 38 +
              Math.cos(x * 0.011 - band * 1.3) * 18;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      } else if (idx === 4) {
        // STAGE 4: The Variables — Warm Acoustic Guitar Strings / Soundwaves & Backyard Summer Glow
        ctx.save();
        for (let s = 0; s < 6; s++) {
          ctx.beginPath();
          const sy = h * 0.25 + s * (h * 0.09);
          const vib = Math.sin(time * 4 + s) * (6 + (s % 3) * 4);
          ctx.strokeStyle =
            s % 2 === 0
              ? "rgba(255, 77, 109, 0.13)"
              : "rgba(245, 158, 11, 0.12)";
          ctx.lineWidth = 1 + s * 0.2;
          for (let x = 0; x <= w; x += 20) {
            const env = Math.sin((x / w) * Math.PI);
            const y = sy + Math.sin(x * 0.008 + time * 2.5 + s) * vib * env;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      } else if (idx === 5) {
        // STAGE 5: The Terminal — Phosphor Matrix & CRT Scanbeam
        ctx.save();
        const beamY = ((time * 90) % h);
        const grad = ctx.createLinearGradient(0, beamY - 60, 0, beamY + 10);
        grad.addColorStop(0, "rgba(0, 240, 255, 0)");
        grad.addColorStop(1, "rgba(0, 240, 255, 0.07)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, beamY - 60, w, 70);
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  const currentStage = STAGES[activeIdx] ?? STAGES[0];

  const jumpTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Fixed morphing atmosphere layer behind the entire site */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at 75% 25%, ${currentStage.glow}, transparent 55%), linear-gradient(165deg, var(--stage-bg-1, #0d1117) 0%, var(--stage-bg-2, #111927) 100%)`,
        }}
      >
        {/* Dynamic architectural grid overlay that shifts intensity & tint per world */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: currentStage.gridOpacity,
            backgroundImage: `
              linear-gradient(to right, color-mix(in srgb, var(--stage-accent, #00f0ff) 7%, transparent) 1px, transparent 1px),
              linear-gradient(to bottom, color-mix(in srgb, var(--stage-accent, #00f0ff) 7%, transparent) 1px, transparent 1px)
            `,
            backgroundSize: activeIdx === 2 ? "32px 32px" : "56px 56px",
          }}
        />

        {/* Generative stage canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Subtle stage-shift flash pulse when crossing world boundaries */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: flash ? 0.16 : 0,
            background: `radial-gradient(circle at 50% 50%, ${currentStage.accent}, transparent 70%)`,
          }}
        />
      </div>

      {/* Top Sticky Stage-Shift HUD & Quick-Jump Switchboard */}
      <div className="fixed left-1/2 top-3 z-50 -translate-x-1/2">
        <nav
          aria-label="Environment stage switcher"
          className="flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 backdrop-blur-md transition-all duration-500"
          style={{
            borderColor: `color-mix(in srgb, ${currentStage.accent} 40%, transparent)`,
            background: "rgba(10, 14, 22, 0.78)",
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.45), 0 0 20px color-mix(in srgb, ${currentStage.accent} 18%, transparent)`,
          }}
        >
          {/* Live pulsing indicator & active stage badge */}
          <div className="hidden items-center gap-2 border-r border-pewter/20 pr-2.5 pl-1.5 sm:flex">
            <span
              className="inline-block h-2 w-2 rounded-full transition-colors duration-300"
              style={{
                background: currentStage.accent,
                boxShadow: `0 0 8px ${currentStage.accent}`,
              }}
            />
            <span
              className="font-mono text-[10px] font-semibold tracking-wider transition-colors duration-300"
              style={{ color: currentStage.accent }}
            >
              {currentStage.code}
            </span>
          </div>

          {/* Interactive chapter pills */}
          <div className="flex items-center gap-0.5">
            {STAGES.map((s, i) => {
              const isActive = i === activeIdx;
              return (
                <button
                  key={s.id}
                  onClick={() => jumpTo(s.sectionId)}
                  className="group relative whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[10px] transition-all duration-300"
                  style={{
                    color: isActive ? "#070b12" : "var(--pewter)",
                    background: isActive ? s.accent : "transparent",
                    fontWeight: isActive ? 700 : 400,
                  }}
                  title={`${s.index} ${s.label} — ${s.env}`}
                >
                  <span className="opacity-70">{s.index}</span>{" "}
                  <span className="hidden lg:inline">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Telemetry status readout on wide screens */}
          <div className="hidden items-center border-l border-pewter/20 pl-2.5 pr-1.5 font-mono text-[9px] text-pewter/80 xl:flex">
            {currentStage.status}
          </div>
        </nav>
      </div>
    </>
  );
}

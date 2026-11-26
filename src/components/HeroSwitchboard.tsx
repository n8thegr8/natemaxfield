"use client";

import { useEffect, useRef, useState } from "react";
import { useCursor } from "./providers";
import { useSectionCursor } from "./hooks";

// Pinned Scrollytelling Hero Switchboard (210vh tall container, sticky 100vh viewport):
// As you scroll down the first ~110vh, the entire page transforms across 3 live states:
//  0.00 -> 0.45 : [DAY SHIFT // AI MODEL ENGINEERING] — Neural tensor lattice firing forward-pass pulses
//  0.45 -> 0.80 : [AFTER HOURS // MAXFIELD LABS CORE] — Nodes snap into a hexagonal homelab & app circuit
//  0.80 -> 1.00 : [OFF-GRID // NEW ENGLAND TOPO] — Circuit morphs into topographic contour rings + trail summit
// You can also click any of the 3 mode pills or click directly on the canvas to trigger an activation wave.
type HeroMode = "auto" | "day" | "lab" | "trail";

export default function HeroSwitchboard() {
  const { reducedMotion } = useCursor();
  const sectionRef = useSectionCursor("tech") as React.RefObject<HTMLDivElement>;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [overrideMode, setOverrideMode] = useState<HeroMode>("auto");
  const pulseRef = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // --- Build 3 distinct geometric formations for the 180 nodes ---
    const COUNT = 180;
    // 1) Neural Layer Lattice (Day Job: AI Models & Eval Systems)
    const neural: { x: number; y: number; layer: number }[] = [];
    // 2) Hexagonal Workbench Constellation (After Hours: Maxfield Labs & Homelab)
    const hexLab: { x: number; y: number }[] = [];
    // 3) Topographic Contour Rings + Summit Trail (Outside the Machine)
    const topo: { x: number; y: number }[] = [];

    let seed = 19;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    const CENTER = { x: 0.68, y: 0.48 };
    const LAYERS = 6;

    for (let i = 0; i < COUNT; i++) {
      // Formation 1: Multi-layer neural architecture on the right 65% of screen
      const layer = i % LAYERS;
      const idxInLayer = Math.floor(i / LAYERS);
      const totalInLayer = Math.ceil(COUNT / LAYERS);
      const nx = 0.34 + (layer / (LAYERS - 1)) * 0.58 + (rand() - 0.5) * 0.04;
      const ny =
        0.14 +
        ((idxInLayer + 0.5) / totalInLayer) * 0.72 +
        (rand() - 0.5) * 0.03;
      neural.push({ x: nx, y: ny, layer });

      // Formation 2: Hexagonal spoke clusters (Hub + 6 satellite rings)
      const cluster = i % 7;
      const angle = ((i * 13) % 360) * (Math.PI / 180);
      if (cluster === 0) {
        const rad = 0.02 + (i % 5) * 0.014;
        hexLab.push({
          x: CENTER.x + Math.cos(angle) * rad,
          y: CENTER.y + Math.sin(angle) * rad,
        });
      } else {
        const spokeAngle = ((cluster - 1) * Math.PI) / 3 - Math.PI / 6;
        const hubX = CENTER.x + Math.cos(spokeAngle) * 0.21;
        const hubY = CENTER.y + Math.sin(spokeAngle) * 0.21;
        // Snap points onto a hexagon perimeter around each satellite hub
        const side = i % 6;
        const a1 = (side * Math.PI) / 3;
        const a2 = ((side + 1) * Math.PI) / 3;
        const t = (i % 10) / 10;
        const r = 0.055;
        hexLab.push({
          x: hubX + (Math.cos(a1) * (1 - t) + Math.cos(a2) * t) * r,
          y: hubY + (Math.sin(a1) * (1 - t) + Math.sin(a2) * t) * r,
        });
      }

      // Formation 3: Topographic contour rings around the summit
      const ring = i % 7;
      const r = 0.045 + ring * 0.042;
      const a = (i / 11) * Math.PI * 2 + ring * 0.65;
      const warp = 1 + 0.14 * Math.sin(a * 3 + ring);
      topo.push({
        x: CENTER.x + Math.cos(a) * r * warp,
        y: CENTER.y + Math.sin(a) * r * 0.82 * warp,
      });
    }

    // Trail polyline snaking up to the summit in Formation 3
    const trail = [
      { x: 0.38, y: 0.91 },
      { x: 0.45, y: 0.81 },
      { x: 0.51, y: 0.72 },
      { x: 0.58, y: 0.66 },
      { x: 0.62, y: 0.57 },
      { x: 0.65, y: 0.52 },
      { x: CENTER.x, y: CENTER.y },
    ];

    const nodes = neural.map((n, i) => ({
      nx: n.x,
      ny: n.y,
      layer: n.layer,
      hx: hexLab[i].x,
      hy: hexLab[i].y,
      tx: topo[i].x,
      ty: topo[i].y,
      phase: rand() * Math.PI * 2,
      r: 1.8 + rand() * 2.6,
    }));

    const mouse = { x: 0.65, y: 0.5 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / Math.max(1, w);
      mouse.y = e.clientY / Math.max(1, h);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;
    const smooth = (t: number) => t * t * (3 - 2 * t);

    const draw = () => {
      const rawP = progressRef.current;
      // Map p (0..1) into stage blend weights:
      // 0..0.5: neural -> hexLab
      // 0.5..1.0: hexLab -> topo
      const p1 = smooth(Math.min(1, Math.max(0, rawP * 2)));
      const p2 = smooth(Math.min(1, Math.max(0, (rawP - 0.5) * 2)));

      const time = performance.now() / 1000;
      ctx.clearRect(0, 0, w, h);

      const px = (mouse.x - 0.5) * 28;
      const py = (mouse.y - 0.5) * 28;

      // Blend RGB accent color: Cyan (0,240,255) -> Amber (245,158,11) -> Pine (16,185,129)
      const rCol = Math.round(lerp(lerp(0, 245, p1), 16, p2));
      const gCol = Math.round(lerp(lerp(240, 158, p1), 185, p2));
      const bCol = Math.round(lerp(lerp(255, 11, p1), 129, p2));

      // Compute current node screen coordinates
      const pos = nodes.map((n, i) => {
        const drift = (1 - p1 * 0.5) * 8;
        const jx = Math.sin(time * 0.8 + n.phase) * drift;
        const jy = Math.cos(time * 0.7 + n.phase) * drift;

        const xNeural = n.nx * w + jx + px * (0.3 + n.layer * 0.12);
        const yNeural = n.ny * h + jy + py * 0.6;

        const xHex = n.hx * w + jx * 0.4 + px * 0.45;
        const yHex = n.hy * h + jy * 0.4 + py * 0.45;

        const xTopo = n.tx * w + px * 0.3;
        const yTopo = n.ty * h + py * 0.3;

        let x = lerp(lerp(xNeural, xHex, p1), xTopo, p2);
        let y = lerp(lerp(yNeural, yHex, p1), yTopo, p2);

        // Interactive click shockwave
        if (pulseRef.current) {
          const age = time - pulseRef.current.t;
          if (age < 1.4) {
            const dx = x - pulseRef.current.x;
            const dy = y - pulseRef.current.y;
            const dist = Math.hypot(dx, dy) || 1;
            const waveRadius = age * 420;
            const band = Math.exp(-Math.pow((dist - waveRadius) / 55, 2));
            const push = band * (1 - age / 1.4) * 26;
            x += (dx / dist) * push;
            y += (dy / dist) * push;
          }
        }

        return { x, y, r: n.r, layer: n.layer, idx: i };
      });

      // Connections between nearby nodes
      const maxD = 125;
      for (let i = 0; i < pos.length; i++) {
        for (let j = i + 1; j < pos.length; j++) {
          const dx = pos[i].x - pos[j].x;
          const dy = pos[i].y - pos[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD * maxD) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / maxD) * 0.38;
            ctx.strokeStyle = `rgba(${rCol},${gCol},${bCol},${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(pos[i].x, pos[i].y);
            ctx.lineTo(pos[j].x, pos[j].y);
            ctx.stroke();
          }
        }
      }

      // Stage 1 specific: forward-pass inference wave sweeping across neural layers
      if (p1 < 0.85) {
        const activeLayer = (time * 2.2) % LAYERS;
        const fade = 1 - p1;
        for (const n of pos) {
          const distLayer = Math.abs(n.layer - activeLayer);
          if (distLayer < 0.75) {
            const boost = (1 - distLayer / 0.75) * fade;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r * 3.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${boost * 0.25})`;
            ctx.fill();
          }
        }
      }

      // Stage 2 specific: Maxfield Labs hexagonal hub spokes when in middle scroll range
      const labWeight = Math.sin(rawP * Math.PI);
      if (labWeight > 0.15) {
        const cx = CENTER.x * w + px * 0.45;
        const cy = CENTER.y * h + py * 0.45;
        ctx.save();
        ctx.strokeStyle = `rgba(245, 158, 11, ${labWeight * 0.35})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        for (let s = 0; s < 6; s++) {
          const a = (s * Math.PI) / 3 - Math.PI / 6;
          const sx = cx + Math.cos(a) * (0.21 * w);
          const sy = cy + Math.sin(a) * (0.21 * h);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw nodes
      for (const n of pos) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (0.9 + rawP * 0.35), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, 0.85)`;
        ctx.fill();
      }

      // Stage 3 specific: Topographic contour ellipses + dashed amber trail to summit
      if (p2 > 0.05) {
        const sx = CENTER.x * w + px * 0.3;
        const sy = CENTER.y * h + py * 0.3;

        ctx.save();
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.26 * p2})`;
        ctx.lineWidth = 1;
        for (let k = 1; k <= 6; k++) {
          ctx.beginPath();
          ctx.ellipse(sx, sy, k * 0.046 * w, k * 0.038 * h, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        // Dashed trail up the ridge
        ctx.save();
        ctx.strokeStyle = `rgba(245, 158, 11, ${p2})`;
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.setLineDash([4, 7]);
        ctx.beginPath();
        trail.forEach((pt, i) => {
          const x = pt.x * w + px * 0.3;
          const y = pt.y * h + py * 0.3;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Summit beacon
        ctx.fillStyle = `rgba(255, 77, 109, ${p2})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Click pulse ring
      if (pulseRef.current) {
        const age = time - pulseRef.current.t;
        if (age < 1.2) {
          ctx.save();
          ctx.strokeStyle = `rgba(${rCol},${gCol},${bCol},${(1 - age / 1.2) * 0.45})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(
            pulseRef.current.x,
            pulseRef.current.y,
            age * 420,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    if (!reducedMotion) {
      raf = requestAnimationFrame(draw);
    } else {
      progressRef.current = 1;
      draw();
      cancelAnimationFrame(raf);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [reducedMotion]);

  // Bind scroll position across the pinned 200vh wrapper to progressRef (0..1)
  useEffect(() => {
    const onScroll = () => {
      if (overrideMode !== "auto") return;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const scrollable = Math.max(1, wrap.offsetHeight - window.innerHeight);
      const scrolled = Math.min(scrollable, Math.max(0, -rect.top));
      const p = scrolled / scrollable;
      progressRef.current = p;
      setScrollPct(Math.round(p * 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [overrideMode]);

  const selectMode = (m: HeroMode) => {
    setOverrideMode(m);
    if (m === "day") {
      progressRef.current = 0;
      setScrollPct(0);
    } else if (m === "lab") {
      progressRef.current = 0.5;
      setScrollPct(50);
    } else if (m === "trail") {
      progressRef.current = 1;
      setScrollPct(100);
    }
  };

  const onCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pulseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      t: performance.now() / 1000,
    };
  };

  const activePhase =
    scrollPct < 34 ? "day" : scrollPct < 74 ? "lab" : "trail";

  return (
    <div
      ref={wrapRef}
      id="hero"
      className="relative w-full"
      style={{ height: reducedMotion ? "100vh" : "205vh" }}
    >
      <section
        ref={sectionRef}
        onClick={onCanvasClick}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Left scrim so typography stays crisp while the right side transforms */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(7,11,18,0.95) 0%, rgba(7,11,18,0.82) 38%, rgba(7,11,18,0.32) 64%, rgba(7,11,18,0) 82%)",
          }}
        />

        {/* Switchboard UI */}
        <div className="relative z-10 flex h-full flex-col justify-between p-6 pb-16 pt-16 md:p-10 md:pb-16 md:pt-20">
          <header className="flex items-center justify-between font-mono text-[11px] text-pewter">
            <span>NM // STUDIO</span>
            <span className="hidden sm:block">WAKEFIELD, MA · NEW ENGLAND</span>
            <span
              className="rounded-full border px-2.5 py-0.5"
              style={{
                borderColor: "color-mix(in srgb, var(--pine) 45%, transparent)",
              }}
            >
              <span
                className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
                style={{
                  background: "var(--pine)",
                  boxShadow: "0 0 6px var(--pine)",
                }}
              />
              available
            </span>
          </header>

          <div className="max-w-4xl">
            {/* Interactive State Switcher Pill Bar */}
            <div
              className="mb-5 inline-flex flex-wrap items-center gap-1.5 rounded-full border p-1 font-mono text-[10px]"
              style={{
                borderColor: "color-mix(in srgb, var(--pewter) 25%, transparent)",
                background: "rgba(13, 17, 23, 0.75)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="px-2.5 text-pewter/70 uppercase tracking-widest">
                STATE [{scrollPct}%]:
              </span>
              {(
                [
                  ["day", "01 · AI ENGINEER (DAY)", "var(--neural)"],
                  ["lab", "02 · MAXFIELD LABS (NIGHT)", "var(--sawdust)"],
                  ["trail", "03 · NEW ENGLAND (OFF-GRID)", "var(--pine)"],
                ] as const
              ).map(([key, label, col]) => {
                const isOn = activePhase === key;
                return (
                  <button
                    key={key}
                    onClick={() => selectMode(key)}
                    className="rounded-full px-2.5 py-1 transition-all"
                    style={{
                      background: isOn
                        ? `color-mix(in srgb, ${col} 20%, transparent)`
                        : "transparent",
                      color: isOn ? col : "var(--pewter)",
                      border: isOn
                        ? `1px solid color-mix(in srgb, ${col} 50%, transparent)`
                        : "1px solid transparent",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
              {overrideMode !== "auto" && (
                <button
                  onClick={() => selectMode("auto")}
                  className="rounded-full px-2 py-0.5 text-pewter/70 hover:text-chalk"
                >
                  [resume scroll]
                </button>
              )}
            </div>

            <h1
              className="font-display font-bold leading-[1.04] tracking-tightest"
              style={{ fontSize: "clamp(2.1rem, 5.4vw, 4.65rem)" }}
            >
              <span
                className="transition-opacity duration-300"
                style={{ opacity: activePhase === "day" ? 1 : 0.78 }}
              >
                AI engineering by day.
              </span>
              <br />
              <span
                style={{
                  color: "var(--sawdust)",
                  textShadow:
                    activePhase === "lab"
                      ? "0 0 36px color-mix(in srgb, var(--sawdust) 65%, transparent)"
                      : "0 0 24px color-mix(in srgb, var(--sawdust) 35%, transparent)",
                }}
              >
                Family life, tinkering,
              </span>{" "}
              and{" "}
              <span
                style={{
                  color: "var(--neural)",
                  textShadow:
                    activePhase === "trail"
                      ? "0 0 36px color-mix(in srgb, var(--neural) 65%, transparent)"
                      : "0 0 24px color-mix(in srgb, var(--neural) 40%, transparent)",
                }}
              >
                side quests
              </span>{" "}
              by night.
              <a
                href="#tech"
                onClick={(e) => e.stopPropagation()}
                className="ml-3 inline-block h-[0.7em] w-[0.7em] translate-y-1 animate-bounce align-bottom text-pewter"
                aria-label="scroll"
              >
                ↓
              </a>
            </h1>

            {/* Dynamic caption that morphs as the user scrolls through the pinned hero */}
            <div className="mt-6 flex max-w-xl items-center gap-3 rounded-xl border border-pewter/15 bg-black/30 px-4 py-3 backdrop-blur-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  background:
                    activePhase === "day"
                      ? "var(--neural)"
                      : activePhase === "lab"
                      ? "var(--sawdust)"
                      : "var(--pine)",
                  boxShadow: "0 0 10px currentColor",
                }}
              />
              <p className="font-mono text-xs leading-relaxed text-pewter">
                {activePhase === "day" && (
                  <>
                    <strong className="text-chalk">STAGE 01 // DAY SHIFT:</strong>{" "}
                    Developing, evaluating, and shipping production AI models and
                    engineering systems at Microsoft.
                  </>
                )}
                {activePhase === "lab" && (
                  <>
                    <strong className="text-chalk">STAGE 02 // AFTER HOURS:</strong>{" "}
                    The neural net reconfigures into Maxfield Labs — local LLM
                    rigs, macOS App Store builds, and nonprofit platforms.
                  </>
                )}
                {activePhase === "trail" && (
                  <>
                    <strong className="text-chalk">STAGE 03 // OFF-GRID:</strong>{" "}
                    The circuit compiles into a New England topographic map —
                    Katie, our two kids, a golden-lookalike mutt, and trail miles.
                  </>
                )}
              </p>
            </div>
          </div>

          <footer className="flex flex-wrap items-end justify-between gap-4 font-mono text-[11px] text-pewter">
            <div className="flex flex-col gap-1.5">
              <span className="max-w-xs leading-relaxed">
                Scroll to <span className="text-neural">morph</span> the
                architecture (or click anywhere to pulse the mesh).
              </span>
              {/* Mini progress bar inside the hero */}
              <div className="h-1 w-48 overflow-hidden rounded-full bg-pewter/20">
                <div
                  className="h-full bg-gradient-to-r from-neural via-sawdust to-pine transition-all duration-150"
                  style={{ width: `${scrollPct}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="text-chalk">42.5° N · 71.1° W</div>
              <div>wakefield, massachusetts</div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}

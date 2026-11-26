"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PawPrint } from "lucide-react";
import { useCursor } from "./providers";
import { useSectionCursor } from "./hooks";
import { SectionHeader } from "./TechPipeline";

gsap.registerPlugin(ScrollTrigger);

const ADVENTURES = [
  {
    num: "01",
    region: "Wakefield / Saugus, MA",
    title: "Breakheart Trails",
    subtitle:
      "Local forest loops, rocky ridges, and year-round trail miles right out the back door with my golden-lookalike mutt.",
    pill: "local stomping grounds",
    coords: "42.48° N · 71.03° W",
    elev: "240 ft · rocky ridge loops",
  },
  {
    num: "02",
    region: "Maine",
    title: "Kennebec & The Coast",
    subtitle:
      "Summer whitewater rafting runs down the Kennebec River rapids and coastal escapes up through Maine.",
    pill: "rapids & coast",
    coords: "45.32° N · 69.96° W",
    elev: "class IV gorge · coastal tide",
  },
  {
    num: "03",
    region: "Caribbean",
    title: "St. Lucia & Puerto Rico",
    subtitle:
      "Hiking rainforest trails and waterfalls in Soufrière and El Yunque, beach downtime, and walking Old San Juan with Katie.",
    pill: "island & rainforest",
    coords: "18.31° N · 65.79° W",
    elev: "3,494 ft · tropical peaks",
  },
  {
    num: "04",
    region: "West Coast & Rails",
    title: "Redmond to New England",
    subtitle:
      "Cross-country hops to Seattle and Microsoft's Redmond campus, family trips to Orlando, and Amtrak Business Class whenever the rails beat the airport.",
    pill: "sky & rail",
    coords: "47.64° N ⇄ 42.50° N",
    elev: "35,000 ft · northeast corridor",
  },
];

export default function AdventureHorizontal() {
  const { reducedMotion } = useCursor();
  const sectionRef = useSectionCursor("pet") as React.RefObject<HTMLElement>;
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProg, setScrollProg] = useState(0);
  const dragRef = useRef<{ active: boolean; startX: number; scrollY0: number }>({
    active: false,
    startX: 0,
    scrollY0: 0,
  });

  useEffect(() => {
    if (reducedMotion || window.matchMedia("(pointer: coarse)").matches) return;
    const track = trackRef.current;
    if (!track) return;

    const getScrollAmount = () => Math.max(0, track.scrollWidth - window.innerWidth + 64);
    const anim = gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: "none",
      scrollTrigger: {
        trigger: track,
        pin: true,
        scrub: 1,
        end: () => "+=" + getScrollAmount(),
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          setScrollProg(self.progress);
        },
      },
    });

    const trigger = anim.scrollTrigger as ScrollTrigger | undefined;
    return () => {
      trigger?.kill();
      gsap.killTweensOf(track);
      ScrollTrigger.refresh();
    };
  }, [reducedMotion]);

  // Allow pointer horizontal dragging on the reel to scrub the page scroll smoothly
  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = {
      active: true,
      startX: e.clientX,
      scrollY0: window.scrollY,
    };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = dragRef.current.startX - e.clientX;
    window.scrollTo({ top: dragRef.current.scrollY0 + dx * 1.15 });
  };
  const onPointerUp = () => {
    dragRef.current.active = false;
  };

  const activeCardIdx = Math.min(
    ADVENTURES.length - 1,
    Math.floor(scrollProg * ADVENTURES.length)
  );

  return (
    <section
      ref={sectionRef}
      id="adventures"
      className="relative"
      style={{ overflowX: "clip" }}
    >
      {/* Header + Live Expedition Progress Bar */}
      <div className="mx-auto max-w-6xl px-6 pt-28 md:px-10 md:pt-40">
        <SectionHeader
          index="03"
          kicker="field notes"
          title={
            <>
              Outside the <em style={{ color: "var(--pine)" }}>machine</em>.
            </>
          }
        />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-pewter">
          <div className="flex items-center gap-3">
            <span className="text-pine">●</span>
            <span>
              ACTIVE WAYPOINT: #{ADVENTURES[activeCardIdx].num}{" "}
              <strong className="text-chalk">
                {ADVENTURES[activeCardIdx].title}
              </strong>{" "}
              ({ADVENTURES[activeCardIdx].coords})
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-pewter/70">
              scroll or drag reel · click to drop paw print
            </span>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-pewter/20">
              <div
                className="h-full bg-pine transition-all duration-100"
                style={{ width: `${Math.round(scrollProg * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="flex select-none items-stretch gap-6 px-6 py-14 md:px-10"
        style={{ willChange: "transform" }}
      >
        {ADVENTURES.map((a, i) => {
          const isCurrent = i === activeCardIdx;
          const accent = i % 2 === 0 ? "var(--pine)" : "var(--coral)";
          return (
            <article
              key={a.title}
              className="group relative flex h-[68vh] w-[82vw] shrink-0 flex-col justify-between rounded-2xl border p-8 transition-all duration-300 md:w-[430px]"
              style={{
                borderColor: isCurrent
                  ? accent
                  : `color-mix(in srgb, ${accent} 35%, transparent)`,
                background:
                  "linear-gradient(160deg, rgba(17,25,39,0.92), rgba(10,16,22,0.95))",
                boxShadow: isCurrent
                  ? `0 20px 50px rgba(0,0,0,0.45), 0 0 28px color-mix(in srgb, ${accent} 16%, transparent)`
                  : "none",
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-pewter">
                  <span
                    className="shrink-0 font-bold"
                    style={{ color: accent }}
                  >
                    #{a.num}
                  </span>
                  <span className="min-w-0 truncate pr-10 uppercase tracking-widest">
                    {a.region}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between font-mono text-[10px] text-pewter/60">
                  <span>{a.coords}</span>
                  <span>{a.elev}</span>
                </div>
              </div>

              {/* Dynamic elevation waveform */}
              <div className="my-4">
                <ElevationGlyph
                  seed={i}
                  active={isCurrent}
                  scrollProg={scrollProg}
                />
              </div>

              <div>
                <h3
                  className="font-display font-bold text-chalk"
                  style={{
                    fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                    lineHeight: 1.12,
                    overflowWrap: "break-word",
                  }}
                >
                  {a.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-pewter">
                  {a.subtitle}
                </p>
                <div
                  className="mt-6 inline-block rounded-full px-3 py-1 font-mono text-xs"
                  style={{
                    color: accent,
                    border: `1px solid color-mix(in srgb, ${accent} 45%, transparent)`,
                    background: `color-mix(in srgb, ${accent} 10%, transparent)`,
                  }}
                >
                  {a.pill}
                </div>
              </div>

              <span className="pointer-events-none absolute right-6 top-6 font-mono text-[10px] text-pewter/60">
                scroll →
              </span>
            </article>
          );
        })}

        {/* Trailing card: invite to the household section */}
        <article
          className="flex h-[68vh] w-[72vw] shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center md:w-[360px]"
          style={{
            borderColor: "color-mix(in srgb, var(--coral) 40%, transparent)",
            background: "rgba(17, 25, 39, 0.45)",
          }}
        >
          <PawPrint
            size={42}
            strokeWidth={1.5}
            aria-hidden
            style={{ color: "var(--coral)" }}
          />
          <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-coral">
            trailhead crew
          </div>
          <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-pewter">
            A golden-lookalike mutt who lives for trail walks, two cats, my wife
            Katie, and two kids on the spectrum share the trailhead. Click
            anywhere in this zone and a paw print drops.
          </p>
        </article>
      </div>
    </section>
  );
}

function ElevationGlyph({
  seed,
  active,
  scrollProg,
}: {
  seed: number;
  active: boolean;
  scrollProg: number;
}) {
  const pts: { x: number; y: number }[] = [];
  const n = 16;
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 300;
    const phase = scrollProg * 4 + seed;
    const y =
      58 -
      (Math.sin(i * 0.75 + seed * 1.4) * 0.5 + 0.5) * 44 -
      Math.sin(i * 1.9 + phase) * 10;
    pts.push({ x, y });
  }
  const poly = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const markerIdx = Math.min(
    pts.length - 1,
    Math.max(0, Math.floor(((scrollProg * 3 + seed * 0.25) % 1) * pts.length))
  );
  const marker = pts[markerIdx];

  return (
    <svg viewBox="0 0 300 76" className="w-full">
      <defs>
        <linearGradient id={`elev-grad-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--pine)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--pine)" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {/* Grid reference lines */}
      <line
        x1="0"
        y1="20"
        x2="300"
        y2="20"
        stroke="var(--pewter)"
        strokeOpacity="0.12"
        strokeDasharray="2 4"
      />
      <line
        x1="0"
        y1="45"
        x2="300"
        y2="45"
        stroke="var(--pewter)"
        strokeOpacity="0.12"
        strokeDasharray="2 4"
      />
      {/* Shaded area under curve */}
      <polygon
        points={`0,72 ${poly} 300,72`}
        fill={`url(#elev-grad-${seed})`}
      />
      {/* Waveform polyline */}
      <polyline
        points={poly}
        fill="none"
        stroke={active ? "var(--pine)" : "var(--pewter)"}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      {/* Live telemetry cursor dot on the waveform */}
      {marker && (
        <g>
          <circle
            cx={marker.x}
            cy={marker.y}
            r={4}
            fill="var(--sawdust)"
          />
          <circle
            cx={marker.x}
            cy={marker.y}
            r={8}
            fill="none"
            stroke="var(--sawdust)"
            strokeOpacity={0.45}
          />
        </g>
      )}
    </svg>
  );
}

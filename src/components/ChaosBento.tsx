"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  Home,
  Guitar,
  Waves,
  Laptop,
  GraduationCap,
  TreePine,
  type LucideIcon,
} from "lucide-react";
import { useSectionCursor } from "./hooks";
import { SectionHeader } from "./TechPipeline";

// Section 04: THE OTHER VARIABLES — Spring-physics draggable Bento grid
// Grab any tile: it lifts, scales, and shoves its neighbors away with Hooke's law
// spring physics; release or hit "Jolt the Board" and the whole grid oscillates
// back into equilibrium.
type Handle = {
  el: HTMLElement;
  home: { x: number; y: number };
  pos: { x: number; y: number };
  vel: { x: number; y: number };
  target: { x: number; y: number };
};

const K = 0.14; // spring stiffness
const DAMP = 0.72; // damping
const PUSH_R = 360; // neighbor shove radius (px)
const PUSH = 140; // max shove (px)
const MAX_DRAG = 180; // how far a tile can be pulled (px)

const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

type TileSpec = {
  id: string;
  emoji: string;
  title: string;
  icon: LucideIcon;
  detail: string;
  color: string;
  className?: string;
  size?: "lg";
  meta: string;
};

const TILES: TileSpec[] = [
  {
    id: "household",
    emoji: "🏠",
    title: "The Household",
    icon: Home,
    color: "var(--coral)",
    size: "lg",
    meta: "WAKEFIELD, MA · FAMILY FIRST",
    className:
      "col-span-2 row-span-2 bg-[var(--coral)]/5 border-[color-mix(in_srgb,var(--coral)_38%,transparent)]",
    detail:
      "Life in Wakefield with my wife Katie, our son and daughter (both on the spectrum and keeping us on our toes), a Golden Retriever who lives for trail walks and the pool, and two cats who actually run the house.",
  },
  {
    id: "music",
    emoji: "🎸",
    title: "Live Music & Guitars",
    icon: Guitar,
    color: "var(--sawdust)",
    meta: "AMPHITHEATERS & SIX STRINGS",
    className:
      "col-span-2 border-[color-mix(in_srgb,var(--sawdust)_30%,transparent)]",
    detail:
      "Summer amphitheater runs across New England (Dave Matthews Band at Mansfield, Gilford NH, Hartford CT) and playing acoustic and electric guitars at home.",
  },
  {
    id: "backyard",
    emoji: "🏊",
    title: "Backyard & DIY",
    icon: Waves,
    color: "var(--pine)",
    meta: "POOL & PRACTICAL BUILDS",
    className: "border-[color-mix(in_srgb,var(--pine)_30%,transparent)]",
    detail:
      "Maintaining the backyard pool for New England summers and tackling practical home renovations and woodworking projects when something actually needs building.",
  },
  {
    id: "sidequests",
    emoji: "💻",
    title: "Late-Night Side Quests",
    icon: Laptop,
    color: "var(--neural)",
    meta: "HOMELAB · APPS · 3D PRINTING",
    className: "border-[color-mix(in_srgb,var(--neural)_30%,transparent)]",
    detail:
      "Homelab LLM setups, shipping apps through Maxfield Labs, photography, video production, and sporadic 3D printing.",
  },
  {
    id: "learner",
    emoji: "🎓",
    title: "Lifelong Learner",
    icon: GraduationCap,
    color: "var(--neural)",
    meta: "NEW LANES & RABBIT HOLES",
    className:
      "col-span-2 border-[color-mix(in_srgb,var(--neural)_30%,transparent)]",
    detail:
      "Always adding a new lane—I genuinely enjoy picking up new tools, frameworks, instruments, and hands-on skills from scratch.",
  },
  {
    id: "rhythm",
    emoji: "🌲",
    title: "New England Rhythm",
    icon: TreePine,
    color: "var(--pine)",
    meta: "FOUR SEASONS NORTH OF BOSTON",
    className:
      "col-span-2 border-[color-mix(in_srgb,var(--pine)_30%,transparent)]",
    detail:
      "Four distinct seasons north of Boston—poolside in July, crisp trail hikes in October, and tracking heating oil prices by December.",
  },
];

export default function ChaosBento() {
  const sectionRef = useSectionCursor("pet") as React.RefObject<HTMLDivElement>;
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const handles = useRef<Map<string, Handle>>(new Map());
  const drag = useRef<{ id: string | null; sx: number; sy: number }>({
    id: null,
    sx: 0,
    sy: 0,
  });
  const pointer = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const stepRef = useRef<() => void>(() => {});

  const register = useCallback((id: string, el: HTMLElement | null) => {
    if (!el) {
      handles.current.delete(id);
      return;
    }
    const existing = handles.current.get(id);
    if (existing) {
      existing.el = el;
    } else {
      handles.current.set(id, {
        el,
        home: { x: 0, y: 0 },
        pos: { x: 0, y: 0 },
        vel: { x: 0, y: 0 },
        target: { x: 0, y: 0 },
      });
    }
  }, []);

  const measure = () => {
    handles.current.forEach((h) => {
      const r = h.el.getBoundingClientRect();
      h.home = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
  };

  const step = () => {
    const id = drag.current.id;
    handles.current.forEach((h) => {
      h.target.x = 0;
      h.target.y = 0;
    });

    const dragged = id ? handles.current.get(id) : undefined;
    if (dragged) {
      dragged.target.x = clamp(pointer.current.x - drag.current.sx, MAX_DRAG);
      dragged.target.y = clamp(pointer.current.y - drag.current.sy, MAX_DRAG);

      const dcx = dragged.home.x + dragged.pos.x;
      const dcy = dragged.home.y + dragged.pos.y;
      handles.current.forEach((h, hid) => {
        if (hid === id) return;
        const dx = h.home.x - dcx;
        const dy = h.home.y - dcy;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < PUSH_R) {
          const amount = ((PUSH_R - dist) / PUSH_R) * PUSH;
          h.target.x += (dx / dist) * amount;
          h.target.y += (dy / dist) * amount;
        }
      });
    }

    let moving = false;
    handles.current.forEach((h) => {
      h.vel.x = (h.vel.x + (h.target.x - h.pos.x) * K) * DAMP;
      h.vel.y = (h.vel.y + (h.target.y - h.pos.y) * K) * DAMP;
      h.pos.x += h.vel.x;
      h.pos.y += h.vel.y;

      if (
        Math.abs(h.target.x - h.pos.x) > 0.15 ||
        Math.abs(h.target.y - h.pos.y) > 0.15 ||
        Math.abs(h.vel.x) > 0.15 ||
        Math.abs(h.vel.y) > 0.15
      ) {
        moving = true;
      }

      const isDragged = h === dragged;
      h.el.style.transform = `translate3d(${h.pos.x.toFixed(
        2
      )}px, ${h.pos.y.toFixed(2)}px, 0)${isDragged ? " scale(1.04)" : ""}`;
      h.el.style.zIndex = isDragged ? "20" : "";
      h.el.style.boxShadow = isDragged
        ? "0 26px 60px rgba(0,0,0,0.55), 0 0 0 1px color-mix(in srgb, var(--coral) 50%, transparent)"
        : "";
    });

    if (moving || dragged)
      raf.current = requestAnimationFrame(() => stepRef.current());
    else raf.current = 0;
  };
  stepRef.current = step;

  // Jolt button: applies a playful spring impulse to all tiles so users can see the physics immediately
  const joltBoard = () => {
    let idx = 0;
    handles.current.forEach((h) => {
      const angle = idx * 1.15 + Math.random() * 0.8;
      h.vel.x += Math.cos(angle) * 28;
      h.vel.y += Math.sin(angle) * 24;
      idx += 1;
    });
    if (raf.current === 0) {
      raf.current = requestAnimationFrame(() => stepRef.current());
    }
  };

  const onWindowMove = useCallback((e: PointerEvent) => {
    pointer.current = { x: e.clientX, y: e.clientY };
    if (raf.current === 0)
      raf.current = requestAnimationFrame(() => stepRef.current());
  }, []);

  const onWindowUp = useCallback(() => {
    drag.current.id = null;
    window.removeEventListener("pointermove", onWindowMove);
    window.removeEventListener("pointerup", onWindowUp);
    window.removeEventListener("pointercancel", onWindowUp);
    if (raf.current === 0)
      raf.current = requestAnimationFrame(() => stepRef.current());
  }, [onWindowMove]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onWindowMove);
      window.removeEventListener("pointerup", onWindowUp);
      window.removeEventListener("pointercancel", onWindowUp);
    },
    [onWindowMove, onWindowUp]
  );

  const onTileDown = (e: React.PointerEvent, id: string) => {
    e.preventDefault();
    drag.current = { id, sx: e.clientX, sy: e.clientY };
    pointer.current = { x: e.clientX, y: e.clientY };
    measure();
    window.addEventListener("pointermove", onWindowMove);
    window.addEventListener("pointerup", onWindowUp);
    window.addEventListener("pointercancel", onWindowUp);
    if (raf.current === 0)
      raf.current = requestAnimationFrame(() => stepRef.current());
  };

  const onGridMove = (e: React.PointerEvent) => {
    const g = gridRef.current;
    const el = spotlightRef.current;
    if (!g || !el) return;
    const r = g.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section id="life" ref={sectionRef} className="py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeader
          index="04"
          kicker="the variables"
          title={
            <>
              The <em style={{ color: "var(--coral)" }}>other</em> variables.
            </>
          }
        />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-2xl text-pewter leading-relaxed">
            The interesting part of being a human is everything that isn&apos;t
            on a roadmap.{" "}
            <span className="font-mono text-xs text-coral">
              Drag a tile — it fights back with a spring.
            </span>
          </p>
          <button
            onClick={joltBoard}
            className="chip transition-colors hover:border-coral/50 hover:text-coral"
          >
            ⚡ test spring impulse
          </button>
        </div>

        <div
          ref={gridRef}
          onPointerMove={onGridMove}
          className="relative mt-12 grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4"
        >
          {TILES.map((spec) => (
            <SpringTile
              key={spec.id}
              spec={spec}
              register={register}
              onDown={onTileDown}
            />
          ))}
          <div
            ref={spotlightRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30"
            style={{
              background:
                "radial-gradient(340px at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--coral) 9%, transparent), transparent 70%)",
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>
    </section>
  );
}

function SpringTile({
  spec,
  register,
  onDown,
}: {
  spec: TileSpec;
  register: (id: string, el: HTMLElement | null) => void;
  onDown: (e: React.PointerEvent, id: string) => void;
}) {
  const Icon = spec.icon;
  return (
    <button
      ref={(el) => register(spec.id, el)}
      onPointerDown={(e) => onDown(e, spec.id)}
      style={{ willChange: "transform", touchAction: "none" }}
      className={`scroll-card group relative flex select-none flex-col items-start justify-between overflow-hidden rounded-2xl border bg-[var(--bg-secondary)]/90 p-5 text-left backdrop-blur-sm ${
        spec.className ?? ""
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon
            size={spec.size === "lg" ? 30 : 24}
            strokeWidth={1.6}
            aria-hidden
            style={{
              color: spec.color,
              filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))",
            }}
          />
          <span
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: spec.color }}
          >
            {spec.meta}
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-widest text-pewter/50">
          {spec.emoji} drag
        </span>
      </div>

      <div>
        <div
          className={`font-display font-bold text-chalk ${
            spec.size === "lg" ? "text-2xl md:text-3xl" : "text-lg"
          }`}
        >
          {spec.title}
        </div>
        <div
          className={`mt-2 leading-relaxed text-pewter ${
            spec.size === "lg" ? "text-sm md:text-base" : "text-xs"
          }`}
        >
          {spec.detail}
        </div>
      </div>
    </button>
  );
}

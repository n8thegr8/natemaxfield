"use client";

import { useEffect, useRef, useState } from "react";
import { useSectionCursor } from "./hooks";

type Project = {
  id: string;
  badge: string;
  meta: string;
  title: string;
  desc: string;
  tags: string[];
  accent: string;
  architecture: string;
  impact: string;
  link?: string;
};

const PROJECTS: Project[] = [
  {
    id: "msft-ai",
    badge: "day job",
    meta: "Production AI",
    title: "Core AI Model Engineering",
    desc: "Developing, evaluating, and shipping artificial intelligence models and the engineering systems around them at Microsoft.",
    tags: ["AI Models", "Eval Systems", "Scale"],
    accent: "var(--neural)",
    architecture: "Distributed model evaluation harnesses, automated regression gates, and latency-critical production inference pipelines.",
    impact: "Ensuring frontier and fine-tuned models meet strict reliability, safety, and quality thresholds before reaching enterprise scale.",
  },
  {
    id: "maxfield-labs",
    badge: "studio",
    meta: "maxfieldlabs.com",
    title: "Maxfield Labs",
    desc: "My independent software studio and technical consultancy—building custom applications, high-performance web architecture, and technical SEO strategy.",
    tags: ["Product Studio", "Web Architecture", "SEO"],
    accent: "var(--sawdust)",
    architecture: "Next.js / React edge-first applications, native macOS utilities, structured schema engineering, and zero-bloat static deployments.",
    impact: "Where late-night prototypes graduate into real products, App Store releases, and long-term digital platforms.",
    link: "https://maxfieldlabs.com",
  },
  {
    id: "maxads",
    badge: "shipped app",
    meta: "macOS & OAuth Verified",
    title: "MaxAds",
    desc: "A proprietary application built under Maxfield Labs, engineered through full Google OAuth brand verification and shipped via the Apple App Store.",
    tags: ["macOS", "Apple App Store", "Google OAuth"],
    accent: "var(--neural)",
    architecture: "Signed & notarized native macOS build, hardened OAuth 2.0 token lifecycle, and direct API synchronization.",
    impact: "Passed rigorous Google OAuth security/brand verification and Apple App Store review to ship a polished desktop tool.",
  },
  {
    id: "fetchoil",
    badge: "live utility",
    meta: "fetchoil.com",
    title: "FetchOil",
    desc: "A free consumer utility and tracking platform built for New England homeowners to monitor local heating oil prices and track tank consumption.",
    tags: ["Consumer Tool", "Price Tracking", "New England"],
    accent: "var(--pine)",
    architecture: "Automated regional price aggregation, degree-day burn rate modeling, and instant comparison dashboards.",
    impact: "Built for real New England winters—helping local families time tank fills and avoid overpriced oil deliveries.",
    link: "https://fetchoil.com",
  },
  {
    id: "stairway-to-stem",
    badge: "nonprofit platform",
    meta: "stairwaytostem.org",
    title: "Stairway to STEM",
    desc: "A nonprofit resource platform helping neurodivergent students transition to college in STEM—a mission close to home raising two kids on the spectrum. Led the migration to a fast static architecture, search findability overhaul, and sustainable nonprofit transition.",
    tags: ["Static Architecture", "Accessibility", "EdTech"],
    accent: "var(--pine)",
    architecture: "Decoupled static edge architecture, WCAG-focused accessible typography/navigation, and deep organic search optimization.",
    impact: "Slashed hosting overhead while making neurodiversity STEM resources immediately discoverable for students, parents, and educators.",
    link: "https://stairwaytostem.org",
  },
  {
    id: "digital-strategy",
    badge: "client & advisory",
    meta: "Shipped",
    title: "Maxfield Esthetics, Fit Revolution & More",
    desc: "Building and maintaining the digital presence and booking experience for my wife Katie's practice, Maxfield Esthetics, alongside technical architecture for Fit Revolution and consumer-protection web engineering for Crestwood Loan Advisors.",
    tags: ["Web Engineering", "Domain Strategy", "UX"],
    accent: "var(--coral)",
    architecture: "Custom web builds, local SEO & booking flows, domain authority migrations, and conversion-focused UX engineering.",
    impact: "Powering my wife's esthetics business and delivering agency-grade engineering directly to fitness platforms and consumer advocates.",
  },
];

export default function TechPipeline() {
  const sectionRef = useSectionCursor("tech") as React.RefObject<HTMLDivElement>;
  const [tilt, setTilt] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scrollFlow, setScrollFlow] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = () => setTilt(true);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Scroll-driven pipeline progress bar across the section
  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      setScrollFlow(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeProject = PROJECTS.find((p) => p.id === selectedId) ?? null;

  return (
    <section id="tech" ref={sectionRef} className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeader
          index="01"
          kicker="the pipeline"
          title={
            <>
              Enterprise scale meets{" "}
              <em style={{ color: "var(--neural)" }}>late-night side quests</em>.
            </>
          }
        />

        <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <p className="max-w-2xl text-pewter leading-relaxed">
            By day I work as an engineer on teams developing AI models and systems
            at Microsoft. After hours, between family life in New England, I run
            Maxfield Labs—tinkering on native apps, consumer utilities, and
            digital platforms for causes close to home.
          </p>
          <div className="font-mono text-[11px] text-pewter/80">
            <span className="text-neural">●</span> click any card to inspect
            architecture &amp; impact
          </div>
        </div>

        {/* Scroll-driven Pipeline Bus Bar */}
        <div className="mt-10 flex items-center gap-3 font-mono text-[10px] text-pewter/70">
          <span>INGEST // DAY SHIFT</span>
          <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-pewter/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-neural via-sawdust to-pine transition-all duration-150"
              style={{ width: `${Math.round(scrollFlow * 100)}%` }}
            />
          </div>
          <span>SHIP // MAXFIELD LABS ({Math.round(scrollFlow * 100)}%)</span>
        </div>

        <div
          ref={wrapRef}
          className="mt-10 grid gap-6 md:grid-cols-3"
          style={{ perspective: 1100 }}
        >
          {PROJECTS.map((p, idx) => (
            <TiltCard
              key={p.id}
              project={p}
              index={idx}
              tilt={tilt}
              selected={selectedId === p.id}
              lit={scrollFlow >= (idx + 0.4) / PROJECTS.length}
              onSelect={() =>
                setSelectedId((cur) => (cur === p.id ? null : p.id))
              }
            />
          ))}
        </div>

        {/* Interactive Architecture Deep-Dive Drawer when a card is clicked */}
        {activeProject && (
          <div
            className="mt-8 rounded-2xl border p-6 backdrop-blur-md transition-all duration-300"
            style={{
              borderColor: `color-mix(in srgb, ${activeProject.accent} 55%, transparent)`,
              background:
                "linear-gradient(135deg, rgba(17,25,39,0.92), rgba(10,14,22,0.95))",
              boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px color-mix(in srgb, ${activeProject.accent} 15%, transparent)`,
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-pewter/15 pb-4">
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-xs uppercase tracking-widest"
                  style={{ color: activeProject.accent }}
                >
                  ● {activeProject.badge}
                </span>
                <span className="font-display text-xl font-bold text-chalk">
                  {activeProject.title}
                </span>
                <span className="font-mono text-xs text-pewter">
                  [{activeProject.meta}]
                </span>
              </div>
              <div className="flex items-center gap-3">
                {activeProject.link && (
                  <a
                    href={activeProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-neural/40 px-3 py-1 font-mono text-xs text-neural transition-colors hover:bg-neural/10"
                  >
                    visit {activeProject.meta} ↗
                  </a>
                )}
                <button
                  onClick={() => setSelectedId(null)}
                  className="rounded-full border border-pewter/30 px-2.5 py-1 font-mono text-xs text-pewter hover:text-chalk"
                >
                  ✕ close
                </button>
              </div>
            </div>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-pewter/70">
                  SYSTEM ARCHITECTURE &amp; STACK
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-chalk/90">
                  {activeProject.architecture}
                </p>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-pewter/70">
                  WHY IT MATTERS
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-chalk/90">
                  {activeProject.impact}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          {[
            "TypeScript",
            "Next.js",
            "React",
            "Python · PyTorch",
            "AI Eval Systems",
            "macOS · App Store",
            "Static Edge",
            "Technical SEO",
          ].map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function TiltCard({
  project,
  index,
  tilt,
  selected,
  lit,
  onSelect,
}: {
  project: Project;
  index: number;
  tilt: boolean;
  selected: boolean;
  lit: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rot = useRef({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rot.current = { x: -py * 11, y: px * 13 };
    el.style.transform = `rotateX(${rot.current.x}deg) rotateY(${rot.current.y}deg) translateZ(0)`;
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "rotateX(0) rotateY(0)";
  };

  return (
    <div
      ref={ref}
      onClick={onSelect}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="scroll-card group relative flex flex-col justify-between rounded-xl border p-6 text-left transition-[transform,border-color,box-shadow] duration-200 ease-out"
      style={{
        borderColor: selected
          ? project.accent
          : lit
          ? `color-mix(in srgb, ${project.accent} 38%, transparent)`
          : "color-mix(in srgb, var(--pewter) 22%, transparent)",
        background:
          "linear-gradient(180deg, rgba(17,25,39,0.92), rgba(13,17,23,0.92))",
        transformStyle: "preserve-3d",
        transform: tilt ? "" : "rotateX(0) rotateY(0)",
        boxShadow: selected
          ? `0 0 28px color-mix(in srgb, ${project.accent} 25%, transparent)`
          : "none",
        willChange: "transform",
      }}
    >
      <div style={{ transform: "translateZ(36px)" }}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <span
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: project.accent }}
          >
            ● {project.badge}
          </span>
          <span className="shrink-0 font-mono text-[11px] text-pewter">
            {project.meta}
          </span>
        </div>
        <h3
          className="font-display font-bold text-chalk"
          style={{
            fontSize: "clamp(1.2rem, 1.7vw, 1.55rem)",
            lineHeight: 1.15,
            overflowWrap: "break-word",
          }}
        >
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-pewter">
          {project.desc}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-pewter/10" style={{ transform: "translateZ(24px)" }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((s) => (
              <span
                key={s}
                className="rounded-full px-2 py-0.5 font-mono text-[10px]"
                style={{
                  color: "var(--pewter)",
                  border:
                    "1px solid color-mix(in srgb, var(--pewter) 25%, transparent)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <span
            className="font-mono text-[10px] transition-colors group-hover:text-chalk"
            style={{ color: selected ? project.accent : "var(--pewter)" }}
          >
            {selected ? "[-]" : "[+]"}{" "}
            <span className="opacity-60">0{index + 1}</span>
          </span>
        </div>
      </div>

      {/* Mouse-tracking spotlight inside each card */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(260px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, ${project.accent} 14%, transparent), transparent 70%)`,
        }}
      />
    </div>
  );
}

export function SectionHeader({
  index,
  kicker,
  title,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-4 border-b border-[color-mix(in_srgb,var(--pewter)_22%,transparent)] pb-6">
      <span
        className="rounded px-2 py-0.5 font-mono text-xs font-bold"
        style={{
          color: "var(--stage-accent, var(--neural))",
          background:
            "color-mix(in srgb, var(--stage-accent, var(--neural)) 12%, transparent)",
          border:
            "1px solid color-mix(in srgb, var(--stage-accent, var(--neural)) 30%, transparent)",
        }}
      >
        {index}
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-pewter">
        {kicker}
      </span>
      <h2 className="ml-auto font-display text-3xl font-bold text-chalk md:text-4xl">
        {title}
      </h2>
    </div>
  );
}

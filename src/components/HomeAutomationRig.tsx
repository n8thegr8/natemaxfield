"use client";

import { useEffect, useState } from "react";
import { useSectionCursor } from "./hooks";
import { SectionHeader } from "./TechPipeline";

// Section 02: THE LAB — "Inside the homelab & build stack."
// Interactive hexagonal node graph centered on MAXFIELD LABS CORE with 6 connected
// satellite nodes. Clicking a node or toggling simulation mode inspects how side quests
// move from local experiments to shipped tools, streaming live packets & telemetry.
type NodeSpec = {
  id: string;
  x: number;
  y: number;
  lines: string[];
  color: string;
  role: string;
  spec: string;
  info: string;
};

const HUB = { x: 290, y: 230 };
const NODE_R = 38;
const HUB_R = 58;

// 6 exact satellite nodes arranged in a symmetric hexagon around MAXFIELD LABS CORE
const NODES: NodeSpec[] = [
  {
    id: "llm",
    x: 115,
    y: 85,
    lines: ["Local LLM Rig"],
    color: "var(--neural)",
    role: "INFERENCE & EVAL BENCH",
    spec: "Local quantized & fine-tuned weights, prompt eval scripts, agent tool harnesses",
    info: "local llm rig: weights loaded · inference & eval harness online",
  },
  {
    id: "maxads",
    x: 465,
    y: 85,
    lines: ["MaxAds", "(macOS / OAuth)"],
    color: "var(--sawdust)",
    role: "NATIVE MACOS & APPLE APP STORE",
    spec: "Signed macOS desktop utility · Google OAuth verified brand · App Store release",
    info: "maxads (macos / oauth): token handshake verified · app store build signed",
  },
  {
    id: "fetchoil",
    x: 90,
    y: 230,
    lines: ["FetchOil", "Telemetry"],
    color: "var(--pine)",
    role: "NEW ENGLAND CONSUMER UTILITY",
    spec: "fetchoil.com · Live regional heating oil price feeds & tank burn modeling",
    info: "fetchoil telemetry: new england oil dealers scraped · tank curves updated",
  },
  {
    id: "edge",
    x: 490,
    y: 230,
    lines: ["Static Edge", "(Stairway to STEM)"],
    color: "var(--pine)",
    role: "ACCESSIBLE NONPROFIT ARCHITECTURE",
    spec: "stairwaytostem.org · Zero-bloat static edge deploy · Technical SEO & WCAG UX",
    info: "static edge (stairway to stem): CDN cache warm · search index verified",
  },
  {
    id: "media",
    x: 115,
    y: 375,
    lines: ["Media & Video", "Pipeline"],
    color: "var(--coral)",
    role: "PHOTO / VIDEO & CREATIVE",
    spec: "4K video production, photography workflow, and visual assets for Maxfield Esthetics",
    info: "media & video pipeline: timeline rendered · raw stills & assets synced",
  },
  {
    id: "hardware",
    x: 465,
    y: 375,
    lines: ["Hardware, 3D Print", "& DIY Bench"],
    color: "var(--neural)",
    role: "PHYSICAL BUILDS & AUTOMATION",
    spec: "Home automation, microcontrollers, 3D printing, woodworking, and practical garage repairs",
    info: "hardware & diy bench: home automation, 3d printer & workshop tools online",
  },
];

const DIAGNOSTIC = [
  "core: maxfield labs pipeline diagnostic start",
  "node[01] local llm rig: local models mounted · latency 18ms",
  "node[02] maxads (macos / oauth): google oauth verified · app store binary ok",
  "node[03] fetchoil telemetry: new england heating oil index synced",
  "node[04] static edge (stairway to stem): neurodiversity stem guide live at edge",
  "node[05] media & video pipeline: footage ingested · renders clean",
  "node[06] hardware, 3d print & diy bench: sensors & workshop tools ready",
  "core: all 6 side-quest nodes nominal · ready to ship",
];

function hexPath(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(
      `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
    );
  }
  return pts.join(" ");
}

export default function HomeAutomationRig() {
  const sectionRef = useSectionCursor("diy") as React.RefObject<HTMLDivElement>;
  const [running, setRunning] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("llm");
  const [log, setLog] = useState<string[]>([
    "core: maxfield labs core online · 6 nodes linked",
    "click a node or toggle diagnostic simulation",
  ]);

  // Run the pipeline diagnostic: walk all 6 nodes and stream each report
  useEffect(() => {
    if (!running) return;
    const timers = DIAGNOSTIC.map((line, i) =>
      setTimeout(() => {
        setLog((old) => [line, ...old].slice(0, 7));
        if (i >= 1 && i <= NODES.length) {
          setSelected(NODES[i - 1].id);
        }
      }, 280 * (i + 1))
    );
    const done = setTimeout(
      () => setRunning(false),
      280 * (DIAGNOSTIC.length + 1)
    );
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [running]);

  const activeId = hover ?? selected;
  const activeNode = NODES.find((n) => n.id === activeId) ?? NODES[0];
  const lit = (id: string) => running || activeId === id;

  return (
    <section id="diy" ref={sectionRef} className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeader
          index="02"
          kicker="the lab"
          title={
            <>
              Inside the <em style={{ color: "var(--sawdust)" }}>homelab</em>{" "}
              &amp; build stack.
            </>
          }
        />

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="lg:w-1/2">
            <p className="text-pewter leading-relaxed">
              After hours, the workbench is a mix of local LLM environments,
              macOS builds, static edge deployments, and video/photo production
              gear. Click a node or toggle simulation mode to inspect how side
              quests move from local experiments to shipped tools.
            </p>

            {/* Active Node Inspector Card */}
            <div
              className="mt-6 rounded-xl border p-5 transition-all duration-300"
              style={{
                borderColor: `color-mix(in srgb, ${activeNode.color} 45%, transparent)`,
                background:
                  "linear-gradient(145deg, rgba(17,25,39,0.85), rgba(13,17,23,0.92))",
              }}
            >
              <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                <span
                  className="uppercase tracking-widest"
                  style={{ color: activeNode.color }}
                >
                  ● SELECTED NODE // {activeNode.role}
                </span>
                <span className="text-pewter/70">ID: {activeNode.id}</span>
              </div>
              <div className="mt-1.5 font-display text-xl font-bold text-chalk">
                {activeNode.lines.join(" ")}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-pewter">
                {activeNode.spec}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setRunning((r) => !r)}
                className="chip group transition-colors hover:border-[color-mix(in_srgb,var(--sawdust)_60%,transparent)] hover:text-sawdust"
                aria-pressed={running}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full transition-all"
                  style={{
                    background: running ? "var(--sawdust)" : "var(--neural)",
                    boxShadow: running
                      ? "0 0 8px var(--sawdust)"
                      : "0 0 6px var(--neural)",
                  }}
                />
                {running
                  ? "● diagnostic running…"
                  : "● run pipeline diagnostic"}
              </button>
              <span className="font-mono text-[11px] text-pewter">
                {running ? "state: simulating packets" : "state: interactive"}
              </span>
            </div>

            {/* Live Event Log Box */}
            <div
              className="mt-6 rounded-lg border p-4 font-mono text-[11px] text-pewter"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--pewter) 22%, transparent)",
                background: "rgba(10,14,20,0.78)",
              }}
            >
              <div className="mb-2 flex items-center justify-between text-pewter/60">
                <span>telemetry event log</span>
                <span>MAXFIELD_LABS_BUS</span>
              </div>
              <ul className="space-y-1">
                {log.map((line, i) => (
                  <li key={line + i} style={{ opacity: 1 - i * 0.12 }}>
                    <span
                      style={{
                        color:
                          i === 0
                            ? running
                              ? "var(--sawdust)"
                              : "var(--neural)"
                            : "var(--pewter)",
                      }}
                    >
                      &gt; {line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div
              className="relative overflow-hidden rounded-2xl border p-3"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--sawdust) 28%, transparent)",
                background: "rgba(13, 17, 23, 0.72)",
              }}
            >
              <svg
                viewBox="0 0 580 460"
                className="w-full"
                onMouseLeave={() => setHover(null)}
                role="img"
                aria-label="Interactive hexagon node graph of The Homelab and Side-Quest Rig"
              >
                <defs>
                  <pattern
                    id="rig-grid"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M24 0 L0 0 0 24"
                      fill="none"
                      stroke="color-mix(in srgb, var(--sawdust) 10%, transparent)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect
                  x="0"
                  y="0"
                  width="580"
                  height="460"
                  fill="url(#rig-grid)"
                />

                {/* Outer decorative schematic ring */}
                <circle
                  cx={HUB.x}
                  cy={HUB.y}
                  r={195}
                  fill="none"
                  stroke="color-mix(in srgb, var(--pewter) 16%, transparent)"
                  strokeDasharray="4 8"
                />

                {/* Edges + animated data packets from HUB to each satellite node */}
                {NODES.map((n) => {
                  const on = lit(n.id);
                  return (
                    <g key={"edge-" + n.id}>
                      <line
                        x1={HUB.x}
                        y1={HUB.y}
                        x2={n.x}
                        y2={n.y}
                        stroke={on ? n.color : "var(--pewter)"}
                        strokeWidth={on ? 1.8 : 0.9}
                        strokeDasharray={on ? "none" : "3 4"}
                        style={{
                          opacity: on ? 0.95 : 0.3,
                          transition: "opacity .3s, stroke .3s",
                          filter: on
                            ? `drop-shadow(0 0 4px ${n.color})`
                            : "none",
                        }}
                      />
                      {on && (
                        <circle r="3.5" fill={n.color}>
                          <animateMotion
                            dur={running ? "0.9s" : "1.8s"}
                            repeatCount="indefinite"
                            path={`M${HUB.x},${HUB.y} L${n.x},${n.y}`}
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* Center Hub: MAXFIELD LABS CORE */}
                <g>
                  <polygon
                    points={hexPath(HUB.x, HUB.y, HUB_R + 8)}
                    fill="none"
                    stroke="var(--sawdust)"
                    strokeWidth={0.8}
                    opacity={0.35}
                  />
                  <polygon
                    points={hexPath(HUB.x, HUB.y, HUB_R)}
                    fill="rgba(0,240,255,0.12)"
                    stroke="var(--neural)"
                    strokeWidth={2.2}
                    style={{ filter: "drop-shadow(0 0 10px var(--neural))" }}
                  />
                  <text
                    x={HUB.x}
                    y={HUB.y - 4}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize="9.5"
                    fill="var(--neural)"
                    style={{ fontWeight: 700 }}
                  >
                    MAXFIELD LABS
                  </text>
                  <text
                    x={HUB.x}
                    y={HUB.y + 9}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize="9.5"
                    fill="var(--chalk)"
                    style={{ fontWeight: 700 }}
                  >
                    CORE
                  </text>
                </g>

                {/* 6 Satellite Hexagon Nodes */}
                {NODES.map((n) => {
                  const on = lit(n.id);
                  return (
                    <g
                      key={n.id}
                      onMouseEnter={() => setHover(n.id)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => {
                        setSelected(n.id);
                        setLog((old) => [n.info, ...old].slice(0, 7));
                      }}
                      style={{
                        cursor: "pointer",
                        opacity: activeId && activeId !== n.id && !running ? 0.65 : 1,
                        transition: "opacity .3s",
                      }}
                    >
                      <polygon
                        points={hexPath(n.x, n.y, NODE_R)}
                        fill={
                          on
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(17,25,39,0.85)"
                        }
                        stroke={on ? n.color : "var(--pewter)"}
                        strokeWidth={on ? 2 : 1.1}
                        style={{
                          filter: on
                            ? `drop-shadow(0 0 8px ${n.color})`
                            : "none",
                          transition: "stroke .3s, filter .3s",
                        }}
                      />
                      {on && (
                        <polygon
                          points={hexPath(n.x, n.y, NODE_R + 6)}
                          fill="none"
                          stroke={n.color}
                          strokeWidth="0.8"
                          opacity={0.45}
                        />
                      )}
                      {n.lines.map((line, li) => (
                        <text
                          key={line}
                          x={n.x}
                          y={
                            n.y +
                            (n.lines.length === 1
                              ? 3
                              : li === 0
                              ? -3
                              : 9)
                          }
                          textAnchor="middle"
                          className="font-mono"
                          fontSize="8.5"
                          fill={on ? "var(--chalk)" : "var(--pewter)"}
                          style={{
                            fontWeight: on ? 600 : 400,
                            transition: "fill .3s",
                          }}
                        >
                          {line}
                        </text>
                      ))}
                    </g>
                  );
                })}
              </svg>
              <div className="mt-2 flex justify-between px-2 font-mono text-[10px] text-pewter">
                <span>FIG 2.1 · HOMELAB &amp; SIDE-QUEST RIG</span>
                <span
                  style={{
                    color: running ? "var(--sawdust)" : "var(--pine)",
                  }}
                >
                  {running ? "STATE: DIAGNOSTIC ACTIVE" : "STATE: 6/6 NODES ONLINE"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

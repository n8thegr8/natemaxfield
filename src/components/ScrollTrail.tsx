"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// A trail that runs the whole length of the page and draws itself as you scroll,
// ending in a summit marker down by the footer. It sits behind the content
// (-z-10) and only shows on large screens, hugging the left gutter.
export default function ScrollTrail() {
  const pathRef = useRef<SVGPathElement>(null);
  const raf = useRef(0);
  const [dim, setDim] = useState({ w: 0, h: 0 });
  const [len, setLen] = useState(0);
  const [progress, setProgress] = useState(0);
  const [head, setHead] = useState({ x: 0, y: 0 });

  // Measure the page (main has id="top").
  useEffect(() => {
    const measure = () => {
      const main = document.getElementById("top");
      if (!main) return;
      setDim({ w: main.getBoundingClientRect().width, h: main.scrollHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    const main = document.getElementById("top");
    const ro = new ResizeObserver(measure);
    if (main) ro.observe(main);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  // A serpentine path down the left gutter, in pixel space.
  const d = useMemo(() => {
    if (!dim.w || !dim.h) return "";
    const x0 = Math.max(24, Math.min(34, dim.w * 0.022));
    const amp = 10;
    const segs = Math.max(6, Math.round(dim.h / 620));
    const step = dim.h / segs;
    let path = `M ${x0} 0`;
    for (let i = 0; i < segs; i++) {
      const y0 = i * step;
      const y1 = y0 + step;
      const xa = x0 + (i % 2 === 0 ? amp : -amp);
      path += ` C ${xa} ${y0 + step / 3}, ${xa} ${y1 - step / 3}, ${x0} ${y1}`;
    }
    return path;
  }, [dim.w, dim.h]);

  useEffect(() => {
    if (pathRef.current && d) setLen(pathRef.current.getTotalLength());
  }, [d]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
        setProgress(p);
        const path = pathRef.current;
        if (path && len) {
          const pt = path.getPointAtLength(len * p);
          setHead({ x: pt.x, y: pt.y });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, [len]);

  if (!dim.w || !dim.h || !d) return null;
  const drawn = len * progress;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
      viewBox={`0 0 ${dim.w} ${dim.h}`}
      preserveAspectRatio="none"
    >
      {/* faint full route */}
      <path
        d={d}
        fill="none"
        stroke="var(--pewter)"
        strokeOpacity={0.18}
        strokeWidth={1.5}
        strokeDasharray="2 9"
      />
      {/* the drawn trail */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="var(--sawdust)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={`${len} ${len}`}
        strokeDashoffset={Math.max(0, len - drawn)}
      />
      {/* summit marker at the head */}
      {len > 0 && progress > 0.002 && (
        <circle cx={head.x} cy={head.y} r={5} fill="var(--coral)" />
      )}
    </svg>
  );
}

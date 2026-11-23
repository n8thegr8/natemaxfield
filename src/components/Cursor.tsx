"use client";

import { useEffect, useRef } from "react";
import { subscribeCursorMode, type CursorMode } from "./providers";

// A trailing, morphing cursor. Two layers:
//  - an outer ring (lags behind, grows on link/pet)
//  - an inner core that swaps glyph by section (terminal _, saw blade, paw)
export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const modeRef = useRef<CursorMode>("default");

  useEffect(() => {
    // Disable entirely on touch / reduced motion (native cursor restored in CSS)
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ringEl = ringRef.current!;
    const coreEl = coreRef.current!;
    const modeRing = ringEl;
    const modeCore = coreEl;

    const unsub = subscribeCursorMode((m) => {
      modeRef.current = m;
      applyMode();
    });

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      coreEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };
    const onDown = (e: MouseEvent) => {
      modeRing.classList.add("is-down");
      if (modeRef.current === "pet") dropPaw(e.clientX, e.clientY);
    };
    const onUp = () => modeRing.classList.remove("is-down");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });

    let raf = 0;
    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.16;
      ring.current.y += (pos.current.y - ring.current.y) * 0.16;
      ringEl.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    function applyMode() {
      const m = modeRef.current;
      modeRing.classList.toggle("mode-link", m === "link");
      modeRing.classList.toggle("mode-pet", m === "pet");
      modeRing.classList.toggle("mode-diy", m === "diy");
      modeRing.classList.toggle("mode-tech", m === "tech");
      modeCore.classList.toggle("core-pet", m === "pet");
      modeCore.classList.toggle("core-tech", m === "tech");
      modeCore.classList.toggle("core-diy", m === "diy");
    }

    function dropPaw(x: number, y: number) {
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("class", "cursor-paw");
      svg.setAttribute("width", "22");
      svg.setAttribute("height", "22");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.style.left = x + "px";
      svg.style.top = y + "px";
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute(
        "d", "M12 13c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3Zm-5-2.5c-.8 0-1.5.7-1.5 1.5S5.2 13.5 6 13.5 7.5 12.8 7.5 12 6.8 10.5 6 10.5Zm12 0c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5ZM4.5 7C3.7 7 3 7.7 3 8.5S3.7 10 4.5 10 6 9.3 6 8.5 5.3 7 4.5 7ZM19.5 7C18.7 7 18 7.7 18 8.5S18.7 10 19.5 10 21 9.3 21 8.5 20.3 7 19.5 7Z"
      );
      path.setAttribute("fill", "currentColor");
      svg.appendChild(path);
      document.body.appendChild(svg);
      svg.animate(
        [
          { opacity: 0.9, transform: "translate(-50%,-50%) scale(1)" },
          { opacity: 0, transform: "translate(-50%,-50%) scale(0.6)" },
        ],
        { duration: 900, easing: "ease-out" }
      );
      setTimeout(() => svg.remove(), 1000);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      unsub();
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-node ring" aria-hidden="true" />
      <div ref={coreRef} className="cursor-node core" aria-hidden="true" />
    </>
  );
}

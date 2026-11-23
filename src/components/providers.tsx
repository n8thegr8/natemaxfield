"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type CursorMode = "default" | "tech" | "diy" | "pet" | "link";

type CursorContextValue = {
  setCursorMode: (mode: CursorMode) => void;
  reducedMotion: boolean;
  lenisRef: React.MutableRefObject<Lenis | null>;
};

const CursorContext = createContext<CursorContextValue | null>(null);

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error("useCursor must be used within <Providers/>");
  return ctx;
}

// A tiny synchronous store so the (fixed, body-level) cursor can read the
// current section mode without going through React re-render.
const cursorModeStore: { mode: CursorMode; listener?: (m: CursorMode) => void } =
  { mode: "default" };

export function subscribeCursorMode(
  cb: (m: CursorMode) => void
): () => void {
  cursorModeStore.listener = cb;
  return () => {
    cursorModeStore.listener = undefined;
  };
}
export function getCursorMode() {
  return cursorModeStore.mode;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const on = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Lenis smooth scroll (skipped under reduced motion / touch)
  useEffect(() => {
    if (reducedMotion) return;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (touch) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Drive Lenis from GSAP's ticker so ScrollTrigger + lenis stay in sync
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const setCursorMode = (mode: CursorMode) => {
    if (cursorModeStore.mode === mode) return;
    cursorModeStore.mode = mode;
    cursorModeStore.listener?.(mode);
  };

  return (
    <CursorContext.Provider value={{ setCursorMode, reducedMotion, lenisRef }}>
      {children}
    </CursorContext.Provider>
  );
}

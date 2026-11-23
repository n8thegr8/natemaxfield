"use client";

import { useEffect, useRef } from "react";
import { useCursor, type CursorMode } from "./providers";

// Sets a section's cursor mode while the pointer is over it, and restores
// "link" mode when hovering interactive elements inside it.
export function useSectionCursor(mode: CursorMode) {
  const { setCursorMode } = useCursor();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onEnter = () => setCursorMode(mode);
    const onLeave = () => setCursorMode("default");

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    // link mode when hovering any anchor / button
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("a, button")) setCursorMode("link");
      else setCursorMode(mode);
    };
    el.addEventListener("mouseover", onOver);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mouseover", onOver);
    };
  }, [mode, setCursorMode]);

  return ref;
}

// Returns an IntersectionObserver-driven visibility flag for reveal animations.
export function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T | null>(null);
  const inView = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
        el.setAttribute("data-inview", e.isIntersecting ? "true" : "false");
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

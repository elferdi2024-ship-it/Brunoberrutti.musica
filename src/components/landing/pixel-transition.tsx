// filepath: src/components/landing/pixel-transition.tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  columns?: number;
  rows?: number;
  color?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
};

export function PixelTransition({
  columns = 20,
  rows = 4,
  color = "var(--color-paper)",
  triggerRef,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const tiles = container.querySelectorAll<HTMLElement>("[data-pixel]");
    if (!tiles.length) return;

    // Calculate priority based on row and wave offset
    const sortedTiles: { el: HTMLElement; priority: number }[] = [];
    tiles.forEach((el) => {
      const r = Number(el.dataset.row || 0);
      const c = Number(el.dataset.col || 0);
      const priority = (rows - 1 - r) * 60 + Math.random() * 260 + Math.sin(c * 0.35) * 35;
      sortedTiles.push({ el, priority });
    });

    sortedTiles.sort((a, b) => a.priority - b.priority);
    const elements = sortedTiles.map((item) => item.el);

    const trigger = triggerRef?.current || container;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 0.01,
          stagger: {
            amount: 1.4,
            from: "start",
          },
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top 80%",
            end: "bottom 30%",
            scrub: 0.4,
          },
        },
      );
    }, container);

    return () => ctx.revert();
  }, [rows, columns, triggerRef]);

  // Generate grid tiles
  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      tiles.push(
        <div
          key={`${r}-${c}`}
          data-pixel
          data-row={r}
          data-col={c}
          className="w-full h-full will-change-opacity"
          style={{ backgroundColor: color }}
        />,
      );
    }
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-20 grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {tiles}
    </div>
  );
}

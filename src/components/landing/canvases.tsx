import { useEffect, useRef, type MutableRefObject } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  hue: number;
};

function resize(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { clientWidth, clientHeight } = canvas;
  canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
  canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w: clientWidth, h: clientHeight, ctx };
}

export function HeroCanvas({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let running = true;
    let w = 0;
    let h = 0;
    let ctx: CanvasRenderingContext2D | null = null;
    const particles: Particle[] = [];
    let t = 0;
    let raf = 0;

    const seed = () => {
      const size = resize(canvas);
      w = size.w;
      h = size.h;
      ctx = size.ctx;
      particles.length = 0;
      const count = Math.round(Math.min(110, (w * h) / 11000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.4) * 0.2,
          r: 0.8 + Math.random() * 2.4,
          a: 0.28 + Math.random() * 0.42,
          hue: Math.random() > 0.5 ? 0 : 1,
        });
      }
    };

    seed();
    const onResize = () => seed();
    window.addEventListener("resize", onResize);

    const sage = [94, 107, 86];
    const aqua = [130, 168, 172];

    const loop = () => {
      if (!running || !ctx) return;
      const p = progressRef.current;
      t += 0.008 + p * 0.012;
      ctx.clearRect(0, 0, w, h);

      ctx.lineWidth = 1.15;
      for (let i = 0; i < 6; i++) {
        const color = i % 2 === 0 ? sage : aqua;
        ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${0.28 - i * 0.028})`;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const y =
            h * 0.36 +
            i * 32 +
            Math.sin(x * 0.0055 + t + i) * (22 + p * 30) +
            Math.sin(x * 0.012 - t * 0.7 + i * 0.6) * 12;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      for (const pt of particles) {
        pt.x += pt.vx + Math.sin(t + pt.y * 0.01) * 0.14 + p * 0.4;
        pt.y += pt.vy + Math.cos(t * 0.8 + pt.x * 0.008) * 0.1;
        if (pt.x < -10) pt.x = w + 10;
        if (pt.x > w + 10) pt.x = -10;
        if (pt.y < -10) pt.y = h + 10;
        if (pt.y > h + 10) pt.y = -10;
        const c = pt.hue === 0 ? sage : aqua;
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${pt.a})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [progressRef]);

  return (
    <canvas
      ref={ref}
      id="hero-canvas"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}

export function LiveCanvas({ velocityRef }: { velocityRef: MutableRefObject<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let running = true;
    let w = 0;
    let h = 0;
    let ctx: CanvasRenderingContext2D | null = null;
    const motes: Particle[] = [];
    let raf = 0;

    const seed = () => {
      const size = resize(canvas);
      w = size.w;
      h = size.h;
      ctx = size.ctx;
      motes.length = 0;
      const count = Math.round(Math.min(80, (w * h) / 16000));
      for (let i = 0; i < count; i++) {
        motes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -0.12 - Math.random() * 0.22,
          r: 0.6 + Math.random() * 2.4,
          a: 0.18 + Math.random() * 0.4,
          hue: Math.random(),
        });
      }
    };

    seed();
    const onResize = () => seed();
    window.addEventListener("resize", onResize);

    const loop = () => {
      if (!running || !ctx) return;
      const v = Math.min(Math.abs(velocityRef.current), 2.4);
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.x += m.vx + v * 0.55;
        m.y += m.vy - v * 0.2;
        if (m.y < -8) m.y = h + 8;
        if (m.x < -8) m.x = w + 8;
        if (m.x > w + 8) m.x = -8;
        ctx.fillStyle = `rgba(243,238,228,${m.a})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [velocityRef]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      aria-hidden
    />
  );
}

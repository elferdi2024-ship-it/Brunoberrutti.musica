// filepath: src/components/landing/hero.tsx
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import gsap from "gsap";
import { Volume2, VolumeX } from "lucide-react";
import { PORTRAITS, SITE } from "@/lib/site";
import { useSiteContent } from "@/lib/content-store";
import { HeroCanvas } from "./canvases";

type Props = {
  progressRef: MutableRefObject<number>;
  soundOn: boolean;
  volume: number;
  onToggleSound: () => void;
  onVolumeChange: (vol: number) => void;
};

export function Hero({
  progressRef,
  soundOn,
  volume,
  onToggleSound,
  onVolumeChange,
}: Props) {
  const { content } = useSiteContent();
  const site = content.site;

  const [currentIdx, setCurrentIdx] = useState(0);
  const heroRootRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const firstWordRef = useRef<HTMLSpanElement>(null);
  const lastWordRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Ciclo continuo de retratos
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % PORTRAITS.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, []);

  // Animación cinemática de entrada
  useEffect(() => {
    const root = heroRootRef.current;
    const imgWrap = imgWrapRef.current;
    const firstWord = firstWordRef.current;
    const lastWord = lastWordRef.current;
    const nav = navRef.current;
    const bottom = bottomRef.current;

    if (!root || !imgWrap || !firstWord || !lastWord) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set([imgWrap, firstWord, lastWord, nav, bottom], { clearProps: "all" });
      return;
    }

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "cubic-bezier(0.625, 0.05, 0, 1)" },
      });

      if (isMobile) {
        // En móvil: animación cinemática de foto a pantalla completa contrayéndose hacia la ranura
        tl.set(imgWrap, {
          width: "102vw",
          height: "102svh",
          x: 0,
          y: 0,
          opacity: 1,
          borderRadius: "0px",
          zIndex: 40,
        })
          .set(firstWord, { yPercent: -120, opacity: 0 })
          .set(lastWord, { yPercent: 120, opacity: 0 })
          .set(nav, { yPercent: -100, opacity: 0 })
          .set(bottom, { yPercent: 100, opacity: 0 });

        tl.to(
          imgWrap,
          {
            width: "100%",
            height: "100%",
            borderRadius: "16px",
            duration: 1.35,
            delay: 0.15,
          },
          "start",
        );

        tl.to(
          firstWord,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.0,
          },
          "start+=0.2",
        );

        tl.to(
          lastWord,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.0,
          },
          "start+=0.2",
        );

        tl.to(
          nav,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            clearProps: "yPercent",
          },
          "start+=0.35",
        );

        tl.to(
          bottom,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            clearProps: "yPercent",
          },
          "start+=0.4",
        );
      } else {
        // En desktop: zoom cinemático completo hacia la ranura inline
        tl.set(imgWrap, {
          width: "102vw",
          height: "102vh",
          x: 0,
          y: 0,
          opacity: 1,
          borderRadius: "0px",
          zIndex: 40,
        })
          .set(firstWord, { xPercent: -140, opacity: 0 })
          .set(lastWord, { xPercent: 140, opacity: 0 })
          .set(nav, { yPercent: -100, opacity: 0 })
          .set(bottom, { yPercent: 100, opacity: 0 });

        tl.to(
          imgWrap,
          {
            width: "100%",
            height: "100%",
            borderRadius: "6px",
            duration: 1.4,
            delay: 0.2,
          },
          "start",
        );

        tl.to(
          firstWord,
          {
            xPercent: 0,
            opacity: 1,
            duration: 1.2,
          },
          "start+=0.15",
        );

        tl.to(
          lastWord,
          {
            xPercent: 0,
            opacity: 1,
            duration: 1.2,
          },
          "start+=0.15",
        );

        tl.to(
          nav,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            clearProps: "yPercent",
          },
          "start+=0.4",
        );

        tl.to(
          bottom,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            clearProps: "yPercent",
          },
          "start+=0.45",
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRootRef}
      id="hero"
      data-hero
      className="relative z-10 flex min-h-[100svh] h-[100svh] flex-col justify-between overflow-hidden bg-paper select-none w-full max-w-full"
    >
      <HeroCanvas progressRef={progressRef} />

      {/* Header / Nav */}
      <header
        ref={navRef}
        className="relative z-30 flex items-center justify-between px-5 pt-4 sm:px-8 sm:pt-7 md:px-12 md:pt-9 w-full max-w-full"
      >
        <a href="#hero" className="flex items-center gap-2.5 group">
          <span className="flex size-8 sm:size-9 items-center justify-center rounded-full border border-ink/20 font-mono text-[11px] sm:text-xs font-bold tracking-widest text-ink transition-colors group-hover:bg-ink group-hover:text-paper">
            BB
          </span>
          <span className="font-mono text-xs font-bold tracking-wider text-ink uppercase hidden sm:inline">
            {site.artist}
          </span>
        </a>

        <nav className="hidden items-center gap-8 font-mono text-xs font-medium tracking-widest uppercase md:flex">
          <a href="#disco" className="text-ink-soft hover:text-ink transition-colors">
            El Disco
          </a>
          <a href="#redes" className="text-ink-soft hover:text-ink transition-colors">
            Redes
          </a>
          <a href="#fechas" className="text-ink-soft hover:text-ink transition-colors">
            Fechas
          </a>
          <a href="#invitacion" className="text-ink-soft hover:text-ink transition-colors">
            Invitación
          </a>
          <a href="#galeria" className="text-ink-soft hover:text-ink transition-colors">
            Galería
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={site.tickets}
            target="_blank"
            rel="noreferrer"
            className="btn-editorial"
          >
            Entradas · {site.dateShort}
          </a>
        </div>
      </header>

      {/* Titular Cinético Principal con composición ampliada y potente en mobile */}
      <div
        data-hero-content
        className="relative z-20 flex flex-1 flex-col items-center justify-center px-4 sm:px-6 w-full max-w-full"
      >
        <h1 className="hero-title flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-6 text-ink leading-none max-w-full">
          <span
            ref={firstWordRef}
            className="inline-block will-change-transform text-[clamp(3.8rem,16vw,5.6rem)] md:text-[clamp(2.5rem,7.5vw,9rem)] leading-[0.9] md:leading-none italic md:not-italic"
          >
            Bruno
          </span>

          {/* Portrait Showcase: Ampliado en mobile para presencia visual cinematográfica */}
          <span
            className="hero-img-slot my-2 sm:my-3 md:my-0 w-[78vw] max-w-[310px] h-48 sm:w-72 sm:h-48 md:w-52 md:h-28 lg:w-64 lg:h-36 rounded-2xl md:rounded-md shadow-lift border border-ink/12"
            aria-hidden="true"
          >
            <div
              ref={imgWrapRef}
              className="hero-img-element h-full w-full overflow-hidden bg-charcoal rounded-2xl md:rounded-md"
            >
              {PORTRAITS.map((portrait, idx) => (
                <img
                  key={portrait.src}
                  src={portrait.src}
                  alt={portrait.alt}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
                    idx === currentIdx ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                  style={{ objectPosition: portrait.position }}
                />
              ))}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>
          </span>

          <span
            ref={lastWordRef}
            className="inline-block will-change-transform text-[clamp(3.8rem,16vw,5.6rem)] md:text-[clamp(2.5rem,7.5vw,9rem)] leading-[0.9] md:leading-none italic md:not-italic"
          >
            Berrutti
          </span>
        </h1>

        {/* Animated Kinetic Scroll Indicator */}
        <a
          href="#disco"
          className="mt-4 sm:mt-6 flex flex-col items-center gap-1 text-ink/60 hover:text-ink transition-colors group cursor-pointer"
          aria-label="Hacer scroll hacia el contenido"
        >
          <span className="font-mono text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase">
            Scroll
          </span>
          <div className="relative h-6 sm:h-8 w-px overflow-hidden bg-ink/20">
            <div className="h-3 w-full bg-ink animate-scroll-line" />
          </div>
        </a>
      </div>

      {/* Barra Inferior: Ecualizador, Controles de Volumen & Sinopsis */}
      <div
        ref={bottomRef}
        className="relative z-30 flex flex-row items-center justify-between gap-2 sm:gap-4 border-t border-ink/10 px-4 pb-3.5 pt-3 sm:px-8 sm:pb-7 sm:pt-5 md:px-12 md:pb-9 w-full max-w-full"
      >
        {/* Left: Equalizer & Track Name */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink min-w-0">
          <div
            className={soundOn ? "eq-wrap text-ink" : "eq-wrap is-muted text-ink/40"}
            aria-hidden="true"
          >
            <div className="eq-bar" />
            <div className="eq-bar" />
            <div className="eq-bar" />
            <div className="eq-bar" />
            <div className="eq-bar" />
            <div className="eq-bar" />
            <div className="eq-bar" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className={`size-1.5 rounded-full ${
                  soundOn ? "bg-green-600 animate-pulse" : "bg-ink/30"
                }`}
                aria-hidden="true"
              />
              <span className="kicker-mono text-[9px] sm:text-[10px] text-ink-faint truncate">
                {soundOn ? "Reproduciendo" : "Pausado"}
              </span>
            </div>
            <p className="font-mono text-[11px] sm:text-xs font-bold text-ink uppercase truncate max-w-[110px] sm:max-w-[180px] md:max-w-none">
              {site.album}
            </p>
          </div>
        </div>

        {/* Center: Editorial Description (Desktop only) */}
        <p className="hidden lg:block max-w-xs text-center font-mono text-[11px] leading-relaxed text-ink-soft uppercase tracking-wider">
          {site.heroSubtitle}
        </p>

        {/* Right: Sound Toggle + Interactive Volume Slider */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full border border-ink/15 bg-paper/80 backdrop-blur-sm">
            <button
              type="button"
              onClick={onToggleSound}
              className="text-ink hover:text-black transition-colors"
              aria-label={soundOn ? "Silenciar" : "Reproducir"}
            >
              {soundOn && volume > 0 ? (
                <Volume2 size={13} className="text-ink" />
              ) : (
                <VolumeX size={13} className="text-ink/50" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={soundOn ? volume : 0}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onVolumeChange(val);
                if (!soundOn && val > 0) {
                  onToggleSound();
                }
              }}
              className="volume-slider w-12 sm:w-16 md:w-20 h-1 bg-ink/20 rounded-full appearance-none cursor-pointer accent-charcoal"
              aria-label="Volumen de fondo"
            />

            <span className="font-mono text-[9px] sm:text-[10px] font-bold text-ink/70 w-6 text-right tabular-nums">
              {soundOn ? `${Math.round(volume * 100)}%` : "0%"}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleSound}
            className="sound-toggle-btn text-ink py-1 sm:py-1.5 px-2.5 sm:px-3 min-h-[32px] sm:min-h-[36px]"
            aria-pressed={soundOn}
            aria-label={soundOn ? "Silenciar audio de fondo" : "Activar música de fondo"}
          >
            <span className="text-[10px] sm:text-xs font-bold">
              {soundOn ? "ON" : "OFF"}
            </span>
            <span
              className={`size-2 rounded-full transition-all ${
                soundOn ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-ink/30"
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}

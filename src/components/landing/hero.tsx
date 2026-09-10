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
  const [introDone, setIntroDone] = useState(false);
  const heroRootRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const introCoverRef = useRef<HTMLDivElement>(null);
  const introBadgeRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const firstWordRef = useRef<HTMLSpanElement>(null);
  const lastWordRef = useRef<HTMLSpanElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Ciclo continuo de retratos (se activa una vez finalizada la intro)
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % PORTRAITS.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, []);

  // Animación cinemática de entrada: Imagen de portada a pantalla completa morphing hacia la ranura del título
  useEffect(() => {
    const root = heroRootRef.current;
    const slot = slotRef.current;
    const introCover = introCoverRef.current;
    const firstWord = firstWordRef.current;
    const lastWord = lastWordRef.current;
    const nav = navRef.current;
    const bottom = bottomRef.current;

    if (!root || !slot || !firstWord || !lastWord || !introCover) return;

    const isMobile = window.innerWidth < 768;

    // Posiciones iniciales ocultas para el texto y barras
    if (isMobile) {
      gsap.set(firstWord, { y: -60, opacity: 0 });
      gsap.set(lastWord, { y: 60, opacity: 0 });
    } else {
      gsap.set(firstWord, { xPercent: -120, opacity: 0 });
      gsap.set(lastWord, { xPercent: 120, opacity: 0 });
    }
    gsap.set(nav, { yPercent: -100, opacity: 0 });
    gsap.set(bottom, { yPercent: 100, opacity: 0 });

    const ctx = gsap.context(() => {
      // Coordenadas exactas de la ranura de destino en el titular
      const rect = slot.getBoundingClientRect();

      const tl = gsap.timeline({
        delay: 0.55, // Fracción de segundo visible a pantalla completa como imagen de carga
        onComplete: () => {
          setIntroDone(true);
        },
      });

      if (introBadgeRef.current) {
        tl.to(introBadgeRef.current, { opacity: 0, duration: 0.3 }, "morph");
      }

      // Contracción cinemática de pantalla completa hacia la ranura
      tl.to(
        introCover,
        {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: isMobile ? "16px" : "6px",
          duration: 1.25,
          ease: "power3.inOut",
        },
        "morph",
      );

      // Revelado armónico de "Bruno" y "Berrutti" al integrarse la imagen
      if (isMobile) {
        tl.to(firstWord, { y: 0, opacity: 1, duration: 0.95, ease: "power3.out" }, "morph+=0.25");
        tl.to(lastWord, { y: 0, opacity: 1, duration: 0.95, ease: "power3.out" }, "morph+=0.25");
      } else {
        tl.to(firstWord, { xPercent: 0, opacity: 1, duration: 1.0, ease: "power3.out" }, "morph+=0.25");
        tl.to(lastWord, { xPercent: 0, opacity: 1, duration: 1.0, ease: "power3.out" }, "morph+=0.25");
      }

      // Entrada suave del header y la barra inferior
      tl.to(
        nav,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power2.out",
          clearProps: "all",
        },
        "morph+=0.35",
      );

      tl.to(
        bottom,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power2.out",
          clearProps: "all",
        },
        "morph+=0.4",
      );
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
      {/* Portada a pantalla completa inicial (Imagen de carga / Intro morph) */}
      {!introDone && (
        <div
          ref={introCoverRef}
          className="fixed inset-0 z-50 overflow-hidden bg-charcoal pointer-events-none shadow-2xl"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100svh",
            borderRadius: 0,
            willChange: "top, left, width, height, border-radius",
          }}
        >
          <img
            src="/images/album-cover.jpg"
            alt="Portada Una vuelta menos - Bruno Berrutti"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
          <div
            ref={introBadgeRef}
            className="absolute bottom-10 sm:bottom-12 left-0 right-0 text-center px-4 flex flex-col items-center gap-2 pointer-events-none"
          >
            <span className="font-mono text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-widest bg-black/50 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md shadow-lg">
              Bruno Berrutti · Una vuelta menos
            </span>
          </div>
        </div>
      )}

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
            ref={slotRef}
            className="hero-img-slot my-2 sm:my-3 md:my-0 w-[78vw] max-w-[310px] h-48 sm:w-72 sm:h-48 md:w-52 md:h-28 lg:w-64 lg:h-36 rounded-2xl md:rounded-md shadow-lift border border-ink/12 relative"
            aria-hidden="true"
          >
            <div
              ref={imgWrapRef}
              className={`hero-img-element h-full w-full overflow-hidden bg-charcoal rounded-2xl md:rounded-md transition-opacity duration-300 ${
                introDone ? "opacity-100" : "opacity-0"
              }`}
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

// filepath: src/components/landing/landing-page.tsx
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X, Volume2, VolumeX, Play } from "lucide-react";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { useAmbientSound } from "@/hooks/use-ambient-sound";
import { SITE } from "@/lib/site";
import { Hero } from "./hero";
import { InteractiveGallery } from "./interactive-gallery";
import { Album, Listen, Tour } from "./sections";
import { InvitationReel } from "./media";
import { Footer, Newsletter } from "./close";

export function LandingPage() {
  useSmoothScroll();
  const ambient = useAmbientSound();
  const {
    on,
    volume,
    setVolume,
    toggle,
    pause,
    needsGesture,
    activateWithGesture,
    toastMessage,
    dismissToast,
  } = ambient;

  const progressRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const [dock, setDock] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      if (!window.location.hash || window.location.hash === "#" || window.location.hash === "#galeria") {
        window.scrollTo(0, 0);
      }
    }

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canPin = !reduce && window.innerWidth >= 768;

    const ctx = gsap.context(() => {
      const hero = root.querySelector<HTMLElement>("[data-hero]");
      const heroContent = root.querySelector<HTMLElement>("[data-hero-content]");
      const spineThumb = root.querySelector<HTMLElement>("[data-scroll-spine-thumb]");

      // Kinetic Scroll Progress Spine
      if (spineThumb) {
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const pct = Math.min(100, Math.max(0, self.progress * 100));
            spineThumb.style.height = `${pct}%`;
          },
        });
      }

      if (hero && heroContent && canPin) {
        gsap.to(heroContent, {
          opacity: 0,
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "+=85%",
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => {
              progressRef.current = self.progress;
            },
          },
        });
      } else if (hero && heroContent && !reduce) {
        gsap.to(heroContent, {
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
            onUpdate: (self) => {
              progressRef.current = self.progress;
            },
          },
        });
      }

      // Mobile Ticket Dock & Audio Toast Footer Clearance
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const pastHero = self.scroll() > window.innerHeight * 0.55;
          const nearFooter = self.progress > 0.87;
          setDock(pastHero && !nearFooter);
          setAtFooter(nearFooter);
        },
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 400);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative bg-paper text-ink w-full max-w-full overflow-x-hidden min-h-screen"
    >
      <div className="grain" />

      {/* Kinetic Vertical Scroll Progress Spine */}
      <div className="scroll-spine hidden sm:block" aria-hidden="true">
        <div data-scroll-spine-thumb className="scroll-spine-thumb h-0" />
      </div>

      {/* Floating Audio Notification / Gesture Unlock Prompt */}
      {needsGesture && !on && !dock && !atFooter ? (
        <div className="audio-toast flex items-center gap-2">
          <button
            type="button"
            onClick={activateWithGesture}
            className="flex items-center gap-2.5 cursor-pointer hover:scale-[1.02] transition-transform group"
            role="status"
            aria-live="polite"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-acid text-charcoal">
              <Play size={11} className="fill-current ml-0.5" />
            </span>
            <span className="font-bold">Tocá para activar música</span>
            <span className="text-[10px] text-paper/60 uppercase tracking-widest hidden sm:inline">
              · 55%
            </span>
          </button>
          <button
            type="button"
            onClick={dismissToast}
            className="ml-1 text-paper/50 hover:text-paper text-xs px-1"
            aria-label="Cerrar aviso"
          >
            ✕
          </button>
        </div>
      ) : toastMessage && !dock && !atFooter ? (
        <div className="audio-toast" role="status" aria-live="polite">
          <Volume2 size={15} className="text-acid" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={toggle}
            className="ml-2 font-bold underline hover:text-acid"
          >
            Silenciar
          </button>
          <button
            type="button"
            onClick={dismissToast}
            className="ml-1 text-paper/60 hover:text-paper"
            aria-label="Cerrar aviso"
          >
            ✕
          </button>
        </div>
      ) : null}

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="fixed top-4 right-4 z-50 flex size-11 items-center justify-center rounded-full bg-paper/90 text-ink shadow-soft backdrop-blur md:hidden border border-ink/15"
        onClick={() => setMenu((v) => !v)}
        aria-expanded={menu}
        aria-label={menu ? "Cerrar menú" : "Abrir menú"}
      >
        {menu ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
      </button>

      {/* Mobile Drawer Menu */}
      {menu ? (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-paper/98 backdrop-blur-md px-6 md:hidden">
          {[
            ["#disco", "El Disco"],
            ["#redes", "Todas mis redes"],
            ["#fechas", "Fechas en vivo"],
            ["#invitacion", "Invitación / Redes"],
            ["#galeria", "Galería Visual"],
            ["#newsletter", "Newsletter"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="font-serif text-3xl font-normal italic tracking-tight text-ink hover:text-acid-dark transition-colors"
              onClick={() => setMenu(false)}
            >
              {label}
            </a>
          ))}

          <div className="pt-4 flex flex-col items-center gap-4 w-full max-w-xs">
            {/* Audio & Volume in Mobile Drawer */}
            <div className="w-full flex flex-col gap-2 p-3 rounded-2xl bg-charcoal/5 border border-ink/10">
              <button
                type="button"
                onClick={toggle}
                className="sound-toggle-btn text-ink w-full justify-center py-2.5"
              >
                {on ? <Volume2 size={15} /> : <VolumeX size={15} />}
                <span>{on ? "Música de fondo: ON" : "Activar música de fondo"}</span>
              </button>

              <div className="flex items-center justify-between gap-3 px-2 pt-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                  Volumen
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={on ? volume : 0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    if (!on && val > 0) toggle();
                  }}
                  className="w-32 h-1 bg-ink/20 rounded-full appearance-none cursor-pointer accent-charcoal"
                />
                <span className="font-mono text-[10px] font-bold text-ink w-8 text-right tabular-nums">
                  {on ? `${Math.round(volume * 100)}%` : "0%"}
                </span>
              </div>
            </div>

            <a
              href={SITE.tickets}
              target="_blank"
              rel="noreferrer"
              className="btn-editorial w-full text-center justify-center"
              onClick={() => setMenu(false)}
            >
              Sacá tu entrada · 11.10
            </a>
          </div>
        </div>
      ) : null}

      <Hero
        progressRef={progressRef}
        soundOn={on}
        volume={volume}
        onToggleSound={toggle}
        onVolumeChange={setVolume}
      />
      <Album ambient={ambient} />
      <Listen />
      <Tour />
      <InvitationReel onPauseAudio={pause} />
      <InteractiveGallery />
      <Newsletter />
      <Footer />

      {/* Mobile Ticket Dock Floating Bar */}
      <a
        href={SITE.tickets}
        target="_blank"
        rel="noreferrer"
        className={dock && !menu && !atFooter ? "ticket-dock show" : "ticket-dock"}
      >
        <div className="font-mono text-xs">
          <span className="text-acid font-bold">{SITE.dateShort} · </span>
          <span>{SITE.venue}</span>
        </div>
        <span className="rounded-full bg-acid px-3.5 py-1.5 font-mono text-[11px] font-bold text-charcoal uppercase">
          Entradas
        </span>
      </a>
    </div>
  );
}

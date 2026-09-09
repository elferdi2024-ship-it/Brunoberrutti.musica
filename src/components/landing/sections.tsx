// filepath: src/components/landing/sections.tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Disc, Play, Pause, Volume2 } from "lucide-react";
import { useSiteContent } from "@/lib/content-store";
import { SocialsMarquee } from "./socials";
import type { AmbientSoundControl } from "@/hooks/use-ambient-sound";

export function Listen() {
  return <SocialsMarquee />;
}

type AlbumProps = {
  ambient?: AmbientSoundControl;
};

export function Album({ ambient }: AlbumProps) {
  const { content } = useSiteContent();
  const vinylRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const vinyl = vinylRef.current;
    if (!vinyl) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(vinyl, {
        rotate: 360,
        ease: "none",
        scrollTrigger: {
          trigger: "#disco",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, vinyl);

    return () => ctx.revert();
  }, []);

  const album = content.albumSection;
  const isPlaying = ambient?.on;

  return (
    <section
      id="disco"
      data-album
      className="relative z-20 bg-paper-deep/40 px-5 sm:px-8 md:px-12 py-16 sm:py-24 md:py-32 border-b border-ink/10 w-full max-w-full overflow-hidden"
    >
      <div className="mx-auto max-w-6xl w-full">
        <div className="grid items-start gap-12 sm:gap-16 md:grid-cols-12 md:gap-16">
          {/* Left: Vinyl & Artwork showcase */}
          <div className="relative mx-auto w-full max-w-[240px] sm:max-w-xs md:max-w-sm md:col-span-5 flex flex-col items-center justify-center overflow-hidden p-2">
            <div
              ref={vinylRef}
              className={`aspect-square w-full rounded-full bg-charcoal p-3 shadow-lift relative flex items-center justify-center overflow-hidden transition-all duration-700 ${
                isPlaying ? "shadow-[0_15px_40px_rgba(0,0,0,0.35)]" : ""
              }`}
            >
              {/* Vinyl grooves */}
              <div className="absolute inset-4 rounded-full border border-paper/10 pointer-events-none" />
              <div className="absolute inset-9 rounded-full border border-paper/10 pointer-events-none" />
              <div className="absolute inset-14 rounded-full border border-paper/10 pointer-events-none" />
              <div className="absolute inset-20 rounded-full border border-paper/10 pointer-events-none" />

              {/* Center label with album cover */}
              <div className="relative size-28 sm:size-36 md:size-40 rounded-full overflow-hidden border-2 border-paper/30 shadow-soft">
                <img
                  src={album.coverImage}
                  alt={`Portada de ${album.title}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="size-4 rounded-full bg-paper border border-charcoal" />
                </div>
              </div>
            </div>

            {/* Turntable Status Indicator */}
            <div className="mt-4 flex items-center gap-2 font-mono text-[10px] text-ink-soft uppercase tracking-widest">
              <span className={`size-1.5 rounded-full ${isPlaying ? "bg-green-600 animate-pulse" : "bg-ink/30"}`} />
              <span>{isPlaying ? `Girando · ${ambient?.currentTrack.title}` : "Listo para reproducir"}</span>
            </div>
          </div>

          {/* Right: Album Details & Integrated Tracklist */}
          <div className="md:col-span-7 text-center md:text-left">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal italic tracking-tight text-ink mb-4 pr-2">
              {album.title}
            </h2>

            <div className="mb-6 space-y-3 font-mono text-xs text-ink-soft">
              <p className="font-bold text-ink uppercase tracking-wider">
                Ya disponible en todas las plataformas
              </p>
              <div className="font-sans text-sm sm:text-base leading-relaxed text-ink-soft max-w-xl mx-auto md:mx-0 space-y-2">
                <p>
                  Este EP fue tomando forma en los últimos meses, reúne cuatro canciones que aparecieron en momentos distintos pero que terminaron hablando de lo mismo: el paso del tiempo, los cambios, la ansiedad y la calma.
                </p>
                <p className="text-ink font-medium">
                  Gracias a todos los amigos y amigas que lo hicieron posible.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 mb-6">
              <a href={content.site.tickets} target="_blank" rel="noreferrer" className="btn-editorial w-full sm:w-auto text-center">
                Adquirir Entradas · {content.site.dateShort}
              </a>
              <a href={content.site.instagram} target="_blank" rel="noreferrer" className="btn-editorial-outline w-full sm:w-auto text-center">
                Seguir en Instagram
              </a>
            </div>

            {/* Reproductor de las 4 canciones del EP */}
            <div className="rounded-2xl border border-ink/15 bg-paper/95 p-4 sm:p-5 shadow-lift backdrop-blur-sm space-y-3 text-left">
              <div className="flex items-center justify-between pb-2.5 border-b border-ink/10">
                <div className="flex items-center gap-2">
                  <Disc size={15} className={`text-charcoal ${ambient?.on ? "animate-spin" : ""}`} style={{ animationDuration: "5s" }} />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink">
                    Escuchar el EP completo en la web
                  </span>
                </div>
                <span className="font-mono text-[10px] text-ink-soft">
                  4 canciones
                </span>
              </div>

              {/* 4 Tracks List */}
              <div className="space-y-1.5">
                {ambient?.tracks.map((track, idx) => {
                  const isCurrent = ambient.currentTrackIndex === idx;
                  const isTrackPlaying = isCurrent && ambient.on;

                  return (
                    <div
                      key={track.id}
                      className={`flex items-center justify-between gap-3 p-2.5 rounded-xl transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-charcoal text-paper shadow-sm"
                          : "hover:bg-charcoal/5 text-ink"
                      }`}
                      onClick={() => ambient.selectTrack(idx, isCurrent ? !ambient.on : true)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            ambient.selectTrack(idx, isCurrent ? !ambient.on : true);
                          }}
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-all ${
                            isTrackPlaying
                              ? "bg-acid text-charcoal shadow-sm"
                              : isCurrent
                              ? "bg-paper/20 text-paper hover:bg-paper hover:text-charcoal"
                              : "bg-charcoal/10 text-ink hover:bg-charcoal hover:text-paper"
                          }`}
                          aria-label={`Reproducir ${track.title}`}
                        >
                          {isTrackPlaying ? (
                            <Pause size={12} className="fill-current" />
                          ) : (
                            <Play size={12} className="fill-current ml-0.5" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] opacity-60">
                              {track.number}
                            </span>
                            <span className="font-mono text-xs font-bold uppercase truncate">
                              {track.title}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                        {isCurrent && (
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isTrackPlaying
                              ? "bg-acid text-charcoal animate-pulse"
                              : "bg-paper/20 text-paper/80"
                          }`}>
                            <Volume2 size={10} />
                            <span>{isTrackPlaying ? "Sonando" : "Pausado"}</span>
                          </span>
                        )}
                        <span className="opacity-70 tabular-nums w-8 text-right">
                          {track.durationLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Scrubber Progress Bar */}
              {ambient && ambient.duration > 0 && (
                <div className="pt-2 border-t border-ink/10 space-y-1">
                  <div
                    className="relative h-1.5 w-full bg-ink/10 rounded-full cursor-pointer overflow-hidden"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const ratio = (e.clientX - rect.left) / rect.width;
                      ambient.seek(ratio);
                    }}
                  >
                    <div
                      className="h-full bg-charcoal rounded-full transition-all duration-100"
                      style={{ width: `${Math.min(100, Math.max(0, ambient.progress * 100))}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-[9px] text-ink-soft tabular-nums">
                    <span>Música activa: {ambient.currentTrack.title}</span>
                    <span>{Math.round(ambient.progress * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Tour() {
  const { content } = useSiteContent();
  const site = content.site;

  return (
    <section
      id="fechas"
      data-tour
      className="relative z-20 bg-acid text-charcoal px-5 sm:px-8 md:px-12 py-20 sm:py-28 md:py-36 border-b border-charcoal/20 w-full max-w-full overflow-hidden"
    >
      <div className="mx-auto max-w-6xl w-full">
        <div className="mb-12 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-charcoal/20 pb-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="size-2 bg-charcoal inline-block shrink-0" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                Tour Dates / En Vivo
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal italic tracking-tight pr-2">
              Próxima Fecha
            </h2>
          </div>

          <a
            href={site.tickets}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 bg-charcoal text-acid rounded-full transition-all hover:bg-black w-full sm:w-auto text-center shrink-0"
          >
            Comprar Entrada · {site.dateShort}
          </a>
        </div>

        {/* Sinopsis del espectáculo y reseña oficial */}
        <div className="mb-12 max-w-3xl space-y-4 font-sans text-sm sm:text-base leading-relaxed text-charcoal/90">
          <p className="font-serif text-xl sm:text-2xl italic text-charcoal leading-snug">
            Presentación en vivo de "Una vuelta menos", el último trabajo de Bruno Berrutti, junto con un recorrido por canciones anteriores.
          </p>
          <p>
            El espectáculo contará con una banda en vivo e invitadas/os especiales, en un formato íntimo que busca generar un encuentro cercano con el público y dar lugar a una experiencia musical cuidada y especial.
          </p>
          <p className="text-charcoal/85 font-medium text-xs sm:text-sm">
            Bruno es cantautor, director de murga y profesor de música. Entre sus composiciones presenta un estilo popular uruguayo, combinando el género Murga, Candombe y Rock con letras introspectivas, explorando temas de identidad y emociones humanas.
          </p>
        </div>

        <div className="border-t border-charcoal/20 w-full" role="table">
          <div
            role="row"
            className="grid grid-cols-12 gap-4 py-3 font-mono text-[11px] font-bold uppercase tracking-wider text-charcoal/60 border-b border-charcoal/15 hidden md:grid"
          >
            <div className="col-span-2">Fecha</div>
            <div className="col-span-4">Evento / Show</div>
            <div className="col-span-4">Lugar</div>
            <div className="col-span-2 text-right">Acceso</div>
          </div>

          <div
            role="row"
            className="tour-tabular-row grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 py-5 sm:py-6 items-center"
          >
            <div className="md:col-span-2 flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-normal italic">
                11 OCT
              </span>
              <span className="font-mono text-[11px] text-charcoal/70 uppercase">
                2026
              </span>
            </div>

            <div className="md:col-span-4">
              <p className="font-mono text-sm font-bold uppercase tracking-wider">
                Una vuelta menos
              </p>
              <p className="font-mono text-xs text-charcoal/75">
                Bruno Berrutti + banda completa
              </p>
            </div>

            <div className="md:col-span-4 font-mono text-xs">
              <p className="font-bold uppercase tracking-wider">
                {site.venue}
              </p>
              <p className="text-charcoal/75">
                {site.neighborhood}, {site.city} · {site.time} hs
              </p>
            </div>

            <div className="md:col-span-2 flex md:justify-end pt-2 md:pt-0">
              <a
                href={site.tickets}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 bg-charcoal text-acid rounded-full hover:bg-black w-full md:w-auto text-center"
              >
                Entradas
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

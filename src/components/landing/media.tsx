// filepath: src/components/landing/media.tsx
import { useEffect, useRef, useState } from "react";
import { Instagram, Play, Film, VolumeX } from "lucide-react";
import { useSiteContent } from "@/lib/content-store";

type Props = {
  onPauseAudio?: () => void;
};

export function InvitationReel({ onPauseAudio }: Props) {
  const { content } = useSiteContent();
  const invitation = content.invitation;
  const site = content.site;

  const [playerMode, setPlayerMode] = useState<"instagram" | "direct">("instagram");
  const [directPlaying, setDirectPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reelUrl = invitation.reelUrl;
  const embedUrl = invitation.embedUrl;

  // Detección de foco en el iframe de Instagram para pausar música ambiental
  useEffect(() => {
    const handleBlur = () => {
      // Si la ventana pierde el foco hacia el iframe del video
      if (document.activeElement && (document.activeElement === iframeRef.current || document.activeElement.tagName === "IFRAME")) {
        onPauseAudio?.();
      }
    };

    // Monitoreo periódico del activeElement para capturar clics internos en el iframe
    const checkInterval = window.setInterval(() => {
      if (document.activeElement && document.activeElement === iframeRef.current) {
        onPauseAudio?.();
      }
    }, 300);

    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.clearInterval(checkInterval);
    };
  }, [onPauseAudio]);

  const handleDirectPlay = () => {
    onPauseAudio?.();
    setDirectPlaying(true);
  };

  const handleDirectPause = () => {
    setDirectPlaying(false);
  };

  return (
    <section
      id="invitacion"
      className="relative z-20 bg-charcoal text-paper py-20 sm:py-28 md:py-36 px-5 sm:px-8 md:px-12 border-b border-paper/10 w-full max-w-full overflow-hidden"
    >
      <div className="mx-auto max-w-6xl w-full">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-paper/15 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="size-2 bg-acid inline-block shrink-0" />
              <span className="kicker-mono text-paper/60">{invitation.kicker}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal italic tracking-tight text-paper pr-2">
              En vivo desde las redes
            </h2>
          </div>

          {/* Switcher de Reproductor: Instagram Reel o Video HD Directo */}
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-full border border-paper/15 self-start sm:self-auto font-mono text-[11px]">
            <button
              type="button"
              onClick={() => {
                setPlayerMode("instagram");
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                playerMode === "instagram"
                  ? "bg-acid text-charcoal font-bold shadow-sm"
                  : "text-paper/60 hover:text-paper"
              }`}
            >
              <Instagram size={12} />
              <span>Instagram</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPlayerMode("direct");
                onPauseAudio?.();
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                playerMode === "direct"
                  ? "bg-acid text-charcoal font-bold shadow-sm"
                  : "text-paper/60 hover:text-paper"
              }`}
            >
              <Film size={12} />
              <span>Video HD</span>
            </button>
          </div>
        </div>

        {/* Video Card & Editorial Copy */}
        <div className="grid items-center gap-10 md:gap-14 lg:grid-cols-12 w-full max-w-full">
          {/* Video Container Column */}
          <div className="mx-auto w-full max-w-[290px] sm:max-w-[340px] md:max-w-[380px] lg:col-span-5">
            <div
              className="relative overflow-hidden rounded-2xl bg-black/80 border border-paper/15 shadow-lift aspect-[9/16] w-full group"
              onPointerDown={() => {
                // Cualquier toque o clic sobre el contenedor de video pausa la música de fondo
                onPauseAudio?.();
              }}
            >
              {playerMode === "instagram" ? (
                <>
                  <iframe
                    ref={iframeRef}
                    src={embedUrl}
                    title="Bruno Berrutti - Invitación en Instagram"
                    className="h-full w-full border-0"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    scrolling="no"
                  />
                  {/* Píldora indicadora de sincronización de audio */}
                  <div className="pointer-events-none absolute top-3 left-3 right-3 z-10 flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-full bg-charcoal/90 text-paper/80 font-mono text-[9px] uppercase tracking-wider backdrop-blur-sm border border-paper/10">
                    <VolumeX size={10} className="text-acid" />
                    <span>Música de fondo se pausa al reproducir</span>
                  </div>
                </>
              ) : (
                <div className="relative h-full w-full flex items-center justify-center bg-black">
                  <video
                    ref={videoRef}
                    src="/video/invitacion.mp4"
                    controls
                    playsInline
                    onPlay={handleDirectPlay}
                    onPause={handleDirectPause}
                    className="h-full w-full object-cover"
                  />
                  {!directPlaying && (
                    <button
                      type="button"
                      onClick={() => {
                        onPauseAudio?.();
                        void videoRef.current?.play();
                      }}
                      className="absolute inset-0 m-auto size-16 rounded-full bg-acid/95 text-charcoal flex items-center justify-center shadow-lift hover:scale-105 transition-transform"
                      aria-label="Reproducir video"
                    >
                      <Play size={24} className="fill-current ml-1" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Editorial Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper/10 font-mono text-[11px] text-acid uppercase tracking-wider">
              <Instagram size={13} />
              <span>{site.instagramHandle} · Reel Oficial</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal italic leading-tight text-paper">
              {invitation.title}
            </h3>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href={site.tickets}
                target="_blank"
                rel="noreferrer"
                className="btn-editorial bg-acid text-charcoal hover:bg-white hover:text-black w-full sm:w-auto text-center"
              >
                Comprar en RedTickets · {site.dateShort}
              </a>

              <a
                href={reelUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-editorial-outline border-paper/30 text-paper hover:bg-paper hover:text-charcoal w-full sm:w-auto text-center inline-flex items-center justify-center gap-2"
              >
                <span>Ver en Instagram</span>
                <span>↗</span>
              </a>
            </div>

            <p className="font-mono text-[11px] text-paper/40 uppercase tracking-widest pt-2">
              {invitation.locationNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

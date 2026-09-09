// filepath: src/components/landing/interactive-gallery.tsx
"use client";

import { useMemo } from "react";
import { MoveHorizontal } from "lucide-react";
import { HaloReel, type HaloReelItem } from "@/components/ui/halo-reel";
import { useSiteContent } from "@/lib/content-store";

export function InteractiveGallery() {
  const { content } = useSiteContent();
  const photos = content.gallery;

  const reelItems: HaloReelItem[] = useMemo(() => {
    return photos.map((photo) => ({
      src: photo.src,
      alt: photo.alt,
      title: photo.title,
      subtitle: photo.tag || "Fotografía",
    }));
  }, [photos]);

  return (
    <section
      id="galeria"
      className="relative z-20 bg-paper py-20 sm:py-28 md:py-32 border-b border-ink/10 w-full max-w-full overflow-hidden select-none"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 md:px-12 mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-ink/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="size-2 bg-acid-dark inline-block shrink-0" />
              <span className="kicker-mono">05 / Galería Orbital 3D</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal italic tracking-tight text-ink pr-2">
              La mirada detrás del disco
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-ink-soft">
            <MoveHorizontal size={14} className="text-acid-dark animate-pulse" />
            <span>Arrastrá o deslizá para girar el halo orbital</span>
          </div>
        </div>
      </div>

      {/* Halo Reel 3D Orbita */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-paper via-paper-deep/30 to-paper py-4">
        <HaloReel
          items={reelItems}
          aria-label="Galería visual orbital de Bruno Berrutti"
          cardWidth={160}
          cardHeight={220}
          minScale={0.38}
          radiusXRatio={0.42}
          radiusYRatio={0.30}
          centerXRatio={0.5}
          holdDuration={1400}
          stepDuration={750}
          spread={1.25}
          autoPlay={true}
          pauseOnHover={true}
          draggable={true}
          className="h-[460px] sm:h-[560px] md:h-[620px]"
          centerLabel={
            <div className="flex flex-col items-center justify-center gap-1.5 select-none pointer-events-none">
              <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-ink/70">
                Una vuelta menos
              </span>
              <span className="font-serif text-3xl sm:text-5xl font-normal italic tracking-tight text-ink">
                Bruno Berrutti
              </span>
            </div>
          }
        />
      </div>

      {/* Reflexión del artista */}
      <div className="mt-12 sm:mt-16 mx-auto max-w-2xl px-6 text-center">
        <div className="space-y-4">
          <p className="font-serif text-xl sm:text-2xl italic text-ink font-normal leading-relaxed">
            “Una vuelta menos” surge en los ratitos libres en una agenda que está a full (por suerte) llena de trabajo, proyectos y ensayos.
          </p>
          <p className="font-sans text-sm sm:text-base text-ink-soft leading-relaxed">
            Escribir canciones es la terapia necesaria que contrarresta la velocidad del día a día.
          </p>
          <p className="font-mono text-xs sm:text-[13px] text-ink/80 pt-3 border-t border-ink/10 leading-relaxed">
            <span className="italic font-bold text-ink">“Tranquilo en mi casa siempre suena mejor”</span>, pero agradezco profundamente haber compartido estas canciones y recibir sus mensajes.
          </p>
        </div>
      </div>
    </section>
  );
}

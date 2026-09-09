// filepath: src/components/landing/album-player.tsx
"use client";

import { Play, Pause, SkipForward, SkipBack, Disc, Radio, Volume2 } from "lucide-react";
import type { AmbientSoundControl } from "@/hooks/use-ambient-sound";

type Props = {
  ambient: AmbientSoundControl;
};

function formatTime(seconds: number) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AlbumPlayer({ ambient }: Props) {
  const {
    tracks,
    currentTrackIndex,
    currentTrack,
    on: isPlaying,
    currentTime,
    duration,
    progress,
    toggle,
    selectTrack,
    nextTrack,
    prevTrack,
    seek,
  } = ambient;

  return (
    <div className="w-full mt-12 sm:mt-16 rounded-3xl border border-ink/15 bg-paper/90 p-5 sm:p-7 md:p-9 shadow-lift backdrop-blur-sm">
      {/* Header of Player */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ink/10">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-charcoal text-acid">
            <Disc size={20} className={isPlaying ? "animate-spin" : ""} style={{ animationDuration: "6s" }} />
          </div>
          <div>
            <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest text-ink/60">
              Reproductor Oficial · Disco Completo
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-normal italic text-ink">
              Una vuelta menos (4 canciones)
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-ink-soft">
          <Radio size={13} className={isPlaying ? "text-green-600 animate-pulse" : "text-ink/40"} />
          <span>Intercambiá la música de fondo tocando cualquier tema</span>
        </div>
      </div>

      {/* Active Track Banner & Scrubber */}
      <div className="py-6 border-b border-ink/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="size-1.5 rounded-full bg-acid-dark animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                {isPlaying ? "Reproduciendo ahora" : "En pausa"}
              </span>
            </div>
            <p className="font-mono text-base sm:text-lg font-bold text-ink truncate">
              {currentTrack.number}. {currentTrack.title}
            </p>
          </div>

          {/* Master Transport Controls */}
          <div className="flex items-center gap-2 sm:gap-3 self-center sm:self-auto shrink-0">
            <button
              type="button"
              onClick={prevTrack}
              className="flex size-9 items-center justify-center rounded-full border border-ink/15 text-ink hover:bg-ink hover:text-paper transition-colors"
              aria-label="Tema anterior"
            >
              <SkipBack size={15} />
            </button>

            <button
              type="button"
              onClick={toggle}
              className="flex size-12 items-center justify-center rounded-full bg-charcoal text-acid shadow-lift hover:scale-105 transition-transform"
              aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
            >
              {isPlaying ? (
                <Pause size={18} className="fill-current" />
              ) : (
                <Play size={18} className="fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={nextTrack}
              className="flex size-9 items-center justify-center rounded-full border border-ink/15 text-ink hover:bg-ink hover:text-paper transition-colors"
              aria-label="Siguiente tema"
            >
              <SkipForward size={15} />
            </button>
          </div>
        </div>

        {/* Timeline Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div
            className="relative h-2.5 w-full bg-ink/10 rounded-full cursor-pointer overflow-hidden group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              seek(ratio);
            }}
          >
            <div
              className="h-full bg-charcoal rounded-full transition-all duration-100 group-hover:bg-acid-dark"
              style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
            />
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-ink-soft tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : currentTrack.durationLabel}</span>
          </div>
        </div>
      </div>

      {/* Tracklist Table */}
      <div className="pt-4 divide-y divide-ink/8">
        {tracks.map((track, idx) => {
          const isSelected = idx === currentTrackIndex;
          const isCurrentPlaying = isSelected && isPlaying;

          return (
            <div
              key={track.id}
              className={`group flex items-center justify-between gap-3 py-3.5 px-3 sm:px-4 rounded-2xl transition-all ${
                isSelected
                  ? "bg-charcoal/5 border border-ink/15 shadow-xs"
                  : "hover:bg-paper-deep/60"
              }`}
            >
              {/* Left: Play button & Track info */}
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  type="button"
                  onClick={() => selectTrack(idx, isSelected ? !isPlaying : true)}
                  className={`flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-full transition-all ${
                    isCurrentPlaying
                      ? "bg-charcoal text-acid shadow-sm"
                      : "border border-ink/20 text-ink group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
                  }`}
                  aria-label={`Reproducir ${track.title}`}
                >
                  {isCurrentPlaying ? (
                    <Pause size={13} className="fill-current" />
                  ) : (
                    <Play size={13} className="fill-current ml-0.5" />
                  )}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ink-faint">
                      {track.number}
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-ink uppercase truncate">
                      {track.title}
                    </span>
                    {track.isAmbientDefault && (
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-acid/40 text-[9px] font-mono text-charcoal font-bold uppercase tracking-wider">
                        Ambiental
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-ink-soft block">
                    {track.artist}
                  </span>
                </div>
              </div>

              {/* Right: Background indicator & Switcher button */}
              <div className="flex items-center gap-3 shrink-0">
                {isSelected ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-charcoal text-acid font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    <Volume2 size={11} className={isCurrentPlaying ? "animate-pulse" : ""} />
                    <span>Música activa</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => selectTrack(idx, true)}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-ink/15 text-ink hover:border-ink hover:bg-paper font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span>Fijar de fondo</span>
                  </button>
                )}

                <span className="font-mono text-xs text-ink-soft tabular-nums w-10 text-right">
                  {track.durationLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left font-mono text-[10px] text-ink-soft uppercase tracking-widest">
        <span>Master oficial · Edición 2026</span>
        <span className="text-ink font-bold">Pista actual se mantiene activa en toda la navegación</span>
      </div>
    </div>
  );
}

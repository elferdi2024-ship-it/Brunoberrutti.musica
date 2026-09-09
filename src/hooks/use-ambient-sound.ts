// filepath: src/hooks/use-ambient-sound.ts
import { useCallback, useEffect, useRef, useState } from "react";

export interface AlbumTrack {
  id: string;
  number: string;
  title: string;
  artist: string;
  src: string;
  durationLabel: string;
  isAmbientDefault?: boolean;
}

export const ALBUM_TRACKS: AlbumTrack[] = [
  {
    id: "un-poco-mas-lento",
    number: "01",
    title: "Un poco más lento",
    artist: "Bruno Berrutti",
    src: "/audio/un-poco-mas-lento.mp3",
    durationLabel: "3:42",
    isAmbientDefault: true,
  },
  {
    id: "calma",
    number: "02",
    title: "Calma",
    artist: "Bruno Berrutti",
    src: "/audio/album/Calma.mp3",
    durationLabel: "3:10",
  },
  {
    id: "caras-desdibujadas",
    number: "03",
    title: "Caras desdibujadas",
    artist: "Bruno Berrutti",
    src: "/audio/album/Caras%20desdibujadas.mp3",
    durationLabel: "2:32",
  },
  {
    id: "mientras-tanto",
    number: "04",
    title: "Mientras tanto",
    artist: "Bruno Berrutti",
    src: "/audio/album/Mientras%20tanto.mp3",
    durationLabel: "3:16",
  },
];

const DEFAULT_VOLUME = 0.55;
const FADE_IN_DURATION_MS = 2200;
const FADE_OUT_DURATION_MS = 700;

export function useAmbientSound() {
  const [on, setOn] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Multi-track state
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const targetVolumeRef = useRef<number>(DEFAULT_VOLUME);
  const fadeIntervalRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    currentIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  // Sincronizar targetVolumeRef
  useEffect(() => {
    targetVolumeRef.current = volume;
    if (audioRef.current && on && !fadeIntervalRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, on]);

  const cancelFade = useCallback(() => {
    if (fadeIntervalRef.current) {
      window.clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  }, []);

  const startFadeIn = useCallback(
    (audio: HTMLAudioElement, targetVol: number) => {
      cancelFade();
      audio.volume = 0.01;
      const startTime = performance.now();
      const initialVol = 0.01;

      fadeIntervalRef.current = window.setInterval(() => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(1, elapsed / FADE_IN_DURATION_MS);
        const eased = 1 - Math.pow(1 - progress, 2.2);
        const currentVol = initialVol + (targetVol - initialVol) * eased;

        if (audioRef.current) {
          audioRef.current.volume = Math.min(1, Math.max(0, currentVol));
        }

        if (progress >= 1) {
          cancelFade();
          if (audioRef.current) audioRef.current.volume = targetVol;
        }
      }, 35);
    },
    [cancelFade],
  );

  const startFadeOut = useCallback(
    (audio: HTMLAudioElement, onComplete?: () => void) => {
      cancelFade();
      const startVol = audio.volume;
      const startTime = performance.now();

      fadeIntervalRef.current = window.setInterval(() => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(1, elapsed / FADE_OUT_DURATION_MS);
        const currentVol = startVol * (1 - progress);

        if (audioRef.current) {
          audioRef.current.volume = Math.max(0, currentVol);
        }

        if (progress >= 1) {
          cancelFade();
          audio.pause();
          if (onComplete) onComplete();
        }
      }, 35);
    },
    [cancelFade],
  );

  // Inicializar instancia de audio
  useEffect(() => {
    const audio = new Audio(ALBUM_TRACKS[0].src);
    audio.preload = "auto";
    audio.volume = 0;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(audio.duration || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    // Auto-advance track when finished
    const handleEnded = () => {
      const nextIdx = (currentIndexRef.current + 1) % ALBUM_TRACKS.length;
      setCurrentTrackIndex(nextIdx);
      audio.src = ALBUM_TRACKS[nextIdx].src;
      audio.currentTime = 0;
      audio.play().then(() => {
        startFadeIn(audio, targetVolumeRef.current);
        setOn(true);
      }).catch(() => {
        setOn(false);
      });
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    audioRef.current = audio;

    return () => {
      cancelFade();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [cancelFade, startFadeIn]);

  const playAudio = useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      await audio.play();
      startFadeIn(audio, targetVolumeRef.current);
      setOn(true);
      setNeedsGesture(false);
      const track = ALBUM_TRACKS[currentIndexRef.current];
      setToastMessage(`${track.title} · Bruno Berrutti`);
      window.setTimeout(() => setToastMessage(null), 4000);
      return true;
    } catch {
      setOn(false);
      setNeedsGesture(true);
      return false;
    }
  }, [startFadeIn]);

  const pauseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    startFadeOut(audio, () => {
      setOn(false);
    });
    setNeedsGesture(false);
  }, [startFadeOut]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused || !on) {
      void playAudio();
    } else {
      pauseAudio();
    }
  }, [on, playAudio, pauseAudio]);

  // Cambiar e intercambiar la música de fondo directamente
  const selectTrack = useCallback(
    async (index: number, shouldPlay: boolean = true) => {
      const audio = audioRef.current;
      if (!audio) return;

      const clampedIndex = Math.max(0, Math.min(ALBUM_TRACKS.length - 1, index));
      const newTrack = ALBUM_TRACKS[clampedIndex];

      // Si es el mismo track, alternar reproducción
      if (clampedIndex === currentIndexRef.current && on) {
        if (!shouldPlay) {
          pauseAudio();
          return;
        }
      }

      setCurrentTrackIndex(clampedIndex);
      currentIndexRef.current = clampedIndex;

      audio.src = newTrack.src;
      audio.currentTime = 0;
      setCurrentTime(0);

      setToastMessage(`Música de fondo: ${newTrack.title}`);
      window.setTimeout(() => setToastMessage(null), 3500);

      if (shouldPlay || on) {
        try {
          await audio.play();
          startFadeIn(audio, targetVolumeRef.current);
          setOn(true);
          setNeedsGesture(false);
        } catch {
          setOn(false);
          setNeedsGesture(true);
        }
      }
    },
    [on, pauseAudio, startFadeIn],
  );

  const nextTrack = useCallback(() => {
    const nextIdx = (currentIndexRef.current + 1) % ALBUM_TRACKS.length;
    void selectTrack(nextIdx, true);
  }, [selectTrack]);

  const prevTrack = useCallback(() => {
    const prevIdx =
      (currentIndexRef.current - 1 + ALBUM_TRACKS.length) % ALBUM_TRACKS.length;
    void selectTrack(prevIdx, true);
  }, [selectTrack]);

  const seek = useCallback((progressRatio: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const target = Math.max(0, Math.min(1, progressRatio)) * audio.duration;
    audio.currentTime = target;
    setCurrentTime(target);
  }, []);

  const setVolume = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    targetVolumeRef.current = clamped;
    if (audioRef.current && !fadeIntervalRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const activateWithGesture = useCallback(() => {
    void playAudio();
  }, [playAudio]);

  // Detección inicial de interacción
  useEffect(() => {
    let triggered = false;

    const onScrollOrTouch = async () => {
      if (triggered) return;
      triggered = true;

      const success = await playAudio();
      if (!success) {
        setNeedsGesture(true);

        const onFirstTap = async () => {
          window.removeEventListener("pointerdown", onFirstTap);
          window.removeEventListener("keydown", onFirstTap);
          await playAudio();
        };

        window.addEventListener("pointerdown", onFirstTap, { once: true });
        window.addEventListener("keydown", onFirstTap, { once: true });
      }
    };

    window.addEventListener("scroll", onScrollOrTouch, { passive: true, once: true });
    window.addEventListener("wheel", onScrollOrTouch, { passive: true, once: true });
    window.addEventListener("touchmove", onScrollOrTouch, { passive: true, once: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrTouch);
      window.removeEventListener("wheel", onScrollOrTouch);
      window.removeEventListener("touchmove", onScrollOrTouch);
    };
  }, [playAudio]);

  return {
    on,
    volume,
    setVolume,
    toggle,
    play: playAudio,
    pause: pauseAudio,
    needsGesture,
    activateWithGesture,
    toastMessage,
    dismissToast: () => setToastMessage(null),

    // Multi-track album features
    tracks: ALBUM_TRACKS,
    currentTrackIndex,
    currentTrack: ALBUM_TRACKS[currentTrackIndex],
    currentTime,
    duration,
    progress: duration > 0 ? currentTime / duration : 0,
    selectTrack,
    nextTrack,
    prevTrack,
    seek,
  };
}

export type AmbientSoundControl = ReturnType<typeof useAmbientSound>;

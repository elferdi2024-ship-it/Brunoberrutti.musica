// filepath: src/lib/content-store.ts
import { useState, useEffect, useCallback } from "react";
import { SITE, PORTRAITS } from "./site";

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  tag: string;
  caption: string;
}

export interface SiteContent {
  site: {
    artist: string;
    album: string;
    track: string;
    instagram: string;
    instagramHandle: string;
    tickets: string;
    venue: string;
    venueKind: string;
    neighborhood: string;
    city: string;
    address: string;
    dateIso: string;
    dateLabel: string;
    dateShort: string;
    time: string;
    year: string;
    heroSubtitle: string;
  };
  albumSection: {
    badgeYear: string;
    kicker: string;
    title: string;
    formats: string;
    description: string;
    coverImage: string;
  };
  invitation: {
    kicker: string;
    title: string;
    description: string;
    reelUrl: string;
    embedUrl: string;
    locationNote: string;
  };
  gallery: GalleryPhoto[];
  design: {
    defaultVolume: number;
    showGrain: boolean;
  };
}

export const DEFAULT_CONTENT: SiteContent = {
  site: {
    artist: SITE.artist,
    album: SITE.album,
    track: SITE.track,
    instagram: SITE.instagram,
    instagramHandle: SITE.instagramHandle,
    tickets: SITE.tickets,
    venue: SITE.venue,
    venueKind: SITE.venueKind,
    neighborhood: SITE.neighborhood,
    city: SITE.city,
    address: SITE.address,
    dateIso: SITE.dateIso,
    dateLabel: SITE.dateLabel,
    dateShort: SITE.dateShort,
    time: SITE.time,
    year: SITE.year,
    heroSubtitle: "Canciones íntimas · Presentación en vivo con banda completa.",
  },
  albumSection: {
    badgeYear: "",
    kicker: "",
    title: SITE.album,
    formats: "Ya disponible en todas las plataformas",
    description:
      "Este EP fue tomando forma en los últimos meses, reúne cuatro canciones que aparecieron en momentos distintos pero que terminaron hablando de lo mismo: el paso del tiempo, los cambios, la ansiedad y la calma.\n\nGracias a todos los amigos y amigas que lo hicieron posible.",
    coverImage: "/images/album-cover.jpg",
  },
  invitation: {
    kicker: "04 / Presentación & Entradas",
    title: "“Una vuelta menos” en vivo · Sociedad Urbana",
    description:
      "Presentación en vivo de \"Una vuelta menos\", el último trabajo de Bruno Berrutti, junto con un recorrido por canciones anteriores.\n\nEl espectáculo contará con una banda en vivo e invitadas/os especiales, en un formato íntimo que busca generar un encuentro cercano con el público y dar lugar a una experiencia musical cuidada y especial.\n\nBruno es cantautor, director de murga y profesor de música. Entre sus composiciones presenta un estilo popular uruguayo, combinando el género Murga, Candombe y Rock con letras introspectivas, explorando temas de identidad y emociones humanas.",
    reelUrl: "https://www.instagram.com/reel/DdCw5QVhReF/",
    embedUrl: "https://www.instagram.com/reel/DdCw5QVhReF/embed",
    locationNote: "Alejo Rosell y Rius 1483 · 20:30 hs",
  },
  gallery: [
    {
      id: "01",
      src: "/images/bruno-field.jpg",
      alt: "Bruno Berrutti en el pastizal con su guitarra",
      title: "El viento en las cuerdas",
      tag: "01 / Campo Abierto",
      caption: "Canciones que nacen despacio entre las espigas y el silencio de la pampa.",
    },
    {
      id: "02",
      src: "/images/bruno-smile.jpg",
      alt: "Retrato de Bruno sonriendo con su guitarra acústica",
      title: "Materia y Madera",
      tag: "02 / Retrato Íntimo",
      caption: "La guitarra hueca como extensión natural del cuerpo y la voz.",
    },
    {
      id: "03",
      src: "/images/bruno-coast.jpg",
      alt: "Bruno Berrutti frente a la costa uruguaya",
      title: "Horizonte Costero",
      tag: "03 / Agua y Orilla",
      caption: "El paisaje del sur templado en los acordes de Una vuelta menos.",
    },
    {
      id: "04",
      src: "/images/bruno-pampas.jpg",
      alt: "Bruno entre las pampas con los ojos cerrados",
      title: "Escucha Profunda",
      tag: "04 / Silencio",
      caption: "Detenerse a escuchar antes de que empiece a sonar la primera nota.",
    },
    {
      id: "05",
      src: "/images/album-cover.jpg",
      alt: "Pintura al agua de la portada del disco",
      title: "Una vuelta menos",
      tag: "05 / Obra Pictórica",
      caption: "Arte de tapa pintado a mano. Un manifiesto de cercanía y calidez.",
    },
  ],
  design: {
    defaultVolume: 0.55,
    showGrain: true,
  },
};

const STORAGE_KEY = "bb_site_content_v4";
const EVENT_NAME = "bb-content-sync";

export function getSavedSiteContent(): SiteContent {
  if (typeof window === "undefined") return DEFAULT_CONTENT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONTENT;
    const parsed = JSON.parse(raw) as Partial<SiteContent>;
    return {
      site: { ...DEFAULT_CONTENT.site, ...parsed.site },
      albumSection: { ...DEFAULT_CONTENT.albumSection, ...parsed.albumSection },
      invitation: { ...DEFAULT_CONTENT.invitation, ...parsed.invitation },
      gallery: Array.isArray(parsed.gallery) && parsed.gallery.length > 0 ? parsed.gallery : DEFAULT_CONTENT.gallery,
      design: { ...DEFAULT_CONTENT.design, ...parsed.design },
    };
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function saveSiteContent(content: SiteContent): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: content }));
  } catch (err) {
    console.error("Error saving site content:", err);
  }
}

export function resetSiteContent(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_CONTENT }));
  } catch (err) {
    console.error("Error resetting site content:", err);
  }
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setContent(getSavedSiteContent());

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<SiteContent>;
      if (customEvent.detail) {
        setContent(customEvent.detail);
      } else {
        setContent(getSavedSiteContent());
      }
    };

    window.addEventListener(EVENT_NAME, handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener(EVENT_NAME, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const update = useCallback((next: SiteContent | ((prev: SiteContent) => SiteContent)) => {
    setContent((prev) => {
      const updated = typeof next === "function" ? next(prev) : next;
      saveSiteContent(updated);
      return updated;
    });
  }, []);

  const reset = useCallback(() => {
    resetSiteContent();
    setContent(DEFAULT_CONTENT);
  }, []);

  return {
    content,
    update,
    reset,
    isClient,
  };
}

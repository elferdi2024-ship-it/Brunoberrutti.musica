// filepath: src/lib/site.ts
export const SITE = {
  artist: "Bruno Berrutti",
  album: "Una vuelta menos",
  track: "Un poco más lento",
  instagram: "https://www.instagram.com/bruno_berrutti",
  instagramHandle: "@bruno_berrutti",
  youtube: "https://www.youtube.com/channel/UCwSn7Eenm5HFVXcH_XgDjhw",
  appleMusic: "https://music.apple.com/us/artist/bruno-berrutti/1684551038",
  spotify: "https://open.spotify.com/search/Bruno%20Berrutti",
  soundcloud: "https://soundcloud.com/search?q=Bruno%20Berrutti",
  tickets:
    "https://redtickets.uy/evento/Bruno-Berrutti---banda-presenta-Una-vuelta-menos/32614/",
  venue: "Sociedad Urbana",
  venueKind: "Espacio cultural",
  neighborhood: "Villa Dolores",
  city: "Montevideo",
  address: "Alejo Rosell y Rius 1483",
  dateIso: "2026-10-11T20:30:00-03:00",
  dateLabel: "Domingo 11 de octubre",
  dateShort: "11.10",
  time: "20:30",
  year: "2026",
} as const;

export const PORTRAITS = [
  {
    src: "/images/bruno-smile.jpg",
    alt: "Bruno Berrutti sonríe con su guitarra hueca bajo el cielo abierto",
    position: "center 18%",
  },
  {
    src: "/images/bruno-pampas.jpg",
    alt: "Bruno Berrutti entre espigas, con los ojos cerrados",
    position: "center 28%",
  },
  {
    src: "/images/bruno-coast.jpg",
    alt: "Bruno Berrutti con guitarra frente al mar",
    position: "center 22%",
  },
] as const;

export const GALLERY = [
  {
    src: "/images/bruno-field.jpg",
    alt: "Bruno sentado entre el pasto y las espigas, guitarra en el regazo",
    caption: "Campo",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/images/bruno-smile.jpg",
    alt: "Retrato de Bruno Berrutti con guitarra hueca",
    caption: "Guitarra",
    className: "",
  },
  {
    src: "/images/bruno-pampas.jpg",
    alt: "Bruno entre espigas de pampa",
    caption: "Viento",
    className: "",
  },
  {
    src: "/images/bruno-coast.jpg",
    alt: "Bruno en la costa con el cielo abierto",
    caption: "Costa",
    className: "md:col-span-2",
  },
] as const;

export const TOUR = [
  {
    date: "11 OCT",
    year: "2026",
    weekday: "Domingo",
    title: "Una vuelta menos",
    billed: "Bruno Berrutti + banda",
    venue: "Sociedad Urbana",
    city: "Villa Dolores, Montevideo",
    time: "20:30",
    tickets: SITE.tickets,
    featured: true,
  },
] as const;

export const LISTEN = [
  { name: "Instagram", href: SITE.instagram, live: true },
  { name: "Spotify", href: SITE.spotify, live: true },
  { name: "YouTube", href: SITE.youtube, live: true },
  { name: "Apple Music", href: SITE.appleMusic, live: true },
  { name: "SoundCloud", href: SITE.soundcloud, live: true },
] as const;

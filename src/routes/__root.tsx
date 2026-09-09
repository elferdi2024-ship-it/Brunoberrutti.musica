import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SITE } from "@/lib/site";
import appCss from "../styles.css?url";

const APP_NAME = SITE.artist;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bruno Berrutti — Una vuelta menos · Sitio Oficial" },
      {
        name: "description",
        content:
          "Sitio oficial de Bruno Berrutti. Presentación en vivo del nuevo EP 'Una vuelta menos' el domingo 11 de octubre en Sociedad Urbana, Montevideo. Escuchá el disco completo y adquirí tus entradas en RedTickets.",
      },
      {
        name: "keywords",
        content:
          "Bruno Berrutti, Una vuelta menos, cantautor uruguayo, murga, candombe, música uruguaya, Sociedad Urbana, Villa Dolores, RedTickets, recital montevideo, nuevo disco uruguay",
      },
      { name: "author", content: "Bruno Berrutti" },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "theme-color", content: "#FAF7F0" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700&display=swap",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://brunoberrutti.uy/#website",
        url: "https://brunoberrutti.uy/",
        name: "Bruno Berrutti Oficial",
        description: "Música, discografía y fechas en vivo de Bruno Berrutti.",
        inLanguage: "es-UY",
      },
      {
        "@type": ["Person", "MusicGroup"],
        "@id": "https://brunoberrutti.uy/#artist",
        name: "Bruno Berrutti",
        description:
          "Cantautor, director de murga y profesor de música uruguayo. Presenta una fusión de murga, candombe y rock introspectivo.",
        image: "https://brunoberrutti.uy/images/bruno-field.jpg",
        genre: ["Murga", "Candombe", "Canción Popular Uruguaya", "Rock"],
        sameAs: [
          "https://www.instagram.com/bruno_berrutti",
          "https://www.youtube.com/channel/UCwSn7Eenm5HFVXcH_XgDjhw",
          "https://open.spotify.com/search/Bruno%20Berrutti",
          "https://music.apple.com/us/artist/bruno-berrutti/1684551038",
          "https://soundcloud.com/brunoberrutti",
        ],
      },
      {
        "@type": "MusicAlbum",
        "@id": "https://brunoberrutti.uy/#album",
        name: "Una vuelta menos",
        byArtist: {
          "@id": "https://brunoberrutti.uy/#artist",
        },
        image: "https://brunoberrutti.uy/images/album-cover.jpg",
        datePublished: "2026",
        numTracks: 4,
        track: [
          { "@type": "MusicRecording", name: "Un poco más lento", position: 1, duration: "PT3M42S" },
          { "@type": "MusicRecording", name: "Calma", position: 2, duration: "PT3M10S" },
          { "@type": "MusicRecording", name: "Caras desdibujadas", position: 3, duration: "PT2M32S" },
          { "@type": "MusicRecording", name: "Mientras tanto", position: 4, duration: "PT3M16S" },
        ],
      },
      {
        "@type": "MusicEvent",
        "@id": "https://brunoberrutti.uy/#live-event",
        name: "Presentación en vivo de 'Una vuelta menos' — Bruno Berrutti",
        startDate: SITE.dateIso,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: SITE.venue,
          address: {
            "@type": "PostalAddress",
            streetAddress: SITE.address,
            addressLocality: SITE.neighborhood,
            addressRegion: SITE.city,
            addressCountry: "UY",
          },
        },
        performer: {
          "@id": "https://brunoberrutti.uy/#artist",
        },
        image: "https://brunoberrutti.uy/og.jpg",
        offers: {
          "@type": "Offer",
          url: SITE.tickets,
          priceCurrency: "UYU",
          availability: "https://schema.org/InStock",
        },
      },
    ],
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <PreviewHostBridge />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

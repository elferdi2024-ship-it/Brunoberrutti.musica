// filepath: src/components/landing/close.tsx
import { useState } from "react";
import { ArrowUpRight, Heart } from "lucide-react";
import { SITE } from "@/lib/site";
import { useSiteContent } from "@/lib/content-store";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section id="newsletter" className="relative z-20 bg-charcoal text-paper py-20 sm:py-28 md:py-32 px-5 sm:px-8 md:px-12 border-b border-paper/10 w-full max-w-full overflow-hidden">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper/10 font-mono text-[11px] text-acid uppercase tracking-wider mb-6">
          <span>06 / Correo Directo</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal italic text-paper mb-6">
          Enterate antes que nadie
        </h2>

        <p className="font-sans text-sm sm:text-base text-paper/70 max-w-md mx-auto mb-8 leading-relaxed">
          Nuevas canciones, ensayos abiertos, fechas en Montevideo e interior, y material exclusivo del disco.
        </p>

        {submitted ? (
          <div className="bg-acid text-charcoal font-mono text-xs sm:text-sm font-bold uppercase tracking-wider py-4 px-6 rounded-full inline-block">
            ✓ Gracias por sumarte · Nos vemos en Sociedad Urbana
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              className="w-full sm:flex-1 px-5 py-3 rounded-full bg-paper/10 border border-paper/20 text-paper font-mono text-xs placeholder:text-paper/40 focus:outline-none focus:border-acid"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-acid text-charcoal font-mono text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors shrink-0 cursor-pointer"
            >
              Suscribirme
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export function Footer() {
  const { content } = useSiteContent();
  const site = content.site;

  return (
    <footer className="relative z-20 bg-paper py-14 pb-32 sm:py-18 px-5 sm:px-8 md:px-12 w-full max-w-full overflow-hidden border-t border-ink/10 select-none">
      <div className="mx-auto max-w-6xl space-y-10 sm:space-y-12">
        {/* Upper Row: Brand & Platforms */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-ink/10">
          <div className="flex items-center gap-3.5">
            <span className="flex size-10 items-center justify-center rounded-full border border-ink/20 font-mono text-xs font-bold text-ink">
              BB
            </span>
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                {site.artist}
              </p>
              <p className="font-mono text-[11px] text-ink-soft">
                {site.album} · 2026
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-7 font-mono text-xs uppercase tracking-wider">
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-ink-soft hover:text-ink transition-colors flex items-center gap-1"
            >
              <span>Instagram</span>
              <ArrowUpRight size={12} />
            </a>
            <a
              href="https://open.spotify.com/search/Bruno%20Berrutti"
              target="_blank"
              rel="noreferrer"
              className="text-ink-soft hover:text-ink transition-colors flex items-center gap-1"
            >
              <span>Spotify</span>
              <ArrowUpRight size={12} />
            </a>
            <a
              href="https://www.youtube.com/channel/UCwSn7Eenm5HFVXcH_XgDjhw"
              target="_blank"
              rel="noreferrer"
              className="text-ink-soft hover:text-ink transition-colors flex items-center gap-1"
            >
              <span>YouTube</span>
              <ArrowUpRight size={12} />
            </a>
            <a
              href="https://music.apple.com/us/artist/bruno-berrutti/1684551038"
              target="_blank"
              rel="noreferrer"
              className="text-ink-soft hover:text-ink transition-colors flex items-center gap-1"
            >
              <span>Apple Music</span>
              <ArrowUpRight size={12} />
            </a>
            <a
              href={site.tickets}
              target="_blank"
              rel="noreferrer"
              className="text-ink font-bold hover:text-acid-dark transition-colors flex items-center gap-1"
            >
              <span>RedTickets</span>
              <ArrowUpRight size={12} />
            </a>
          </div>

          <div className="flex items-center gap-4 text-center md:text-right">
            <a
              href="/admin"
              className="font-mono text-[10px] text-ink-soft hover:text-ink border border-ink/15 rounded-full px-3 py-1 transition-colors hover:border-ink/40"
            >
              CMS ⚙
            </a>
            <p className="font-mono text-[11px] text-ink-soft">
              Montevideo, Uruguay
            </p>
          </div>
        </div>

        {/* Lower Row: Editorial Colophon & Crafted with Love Badge */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left pt-1">
          <p className="font-mono text-[10px] text-ink/40 uppercase tracking-widest">
            © {site.year} Bruno Berrutti · Todos los derechos reservados.
          </p>

          {/* Amargo Creativo Signature Badge */}
          <a
            href="https://amargo-creativo.pages.dev/"
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-ink/12 bg-paper-deep/50 hover:bg-paper hover:border-ink/40 shadow-xs hover:shadow-soft transition-all duration-300 hover:scale-[1.02]"
            aria-label="Sitio web desarrollado con mucho amor por Amargo Creativo"
          >
            <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft group-hover:text-ink transition-colors">
              <span>Diseñado & desarrollado con</span>
              <Heart
                size={11}
                className="fill-red-500 text-red-500 inline-block animate-pulse mx-0.5"
              />
              <span>por</span>
            </span>

            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-widest text-ink uppercase group-hover:text-charcoal transition-colors">
              <span className="underline decoration-acid decoration-2 underline-offset-4 group-hover:decoration-charcoal">
                Amargo Creativo
              </span>
              <ArrowUpRight
                size={12}
                className="text-ink/40 group-hover:text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
              />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

// filepath: src/components/landing/socials.tsx
"use client";

import { ArrowUpRight, Radio } from "lucide-react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { useSiteContent } from "@/lib/content-store";
import { SITE } from "@/lib/site";

interface SocialItem {
  name: string;
  category: "Música" | "Red Social" | "En Vivo";
  handle: string;
  href: string;
  accent: string;
  badge?: string;
  icon: (props: { className?: string }) => React.ReactNode;
}

export function SocialsMarquee() {
  const { content } = useSiteContent();
  const site = content.site;

  const socials: SocialItem[] = [
    {
      name: "Instagram",
      category: "Red Social",
      handle: site.instagramHandle || "@bruno_berrutti",
      href: site.instagram || SITE.instagram,
      accent: "#E1306C",
      badge: "Reels & Diarios",
      icon: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "Spotify",
      category: "Música",
      handle: "Bruno Berrutti",
      href: "https://open.spotify.com/search/Bruno%20Berrutti",
      accent: "#1DB954",
      badge: "Sencillo Disponible",
      icon: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.435-5.308-1.76-8.792-.963-.335.077-.67-.133-.747-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.51 9.722 1.113.294.18.386.563.207.857zm1.224-2.719c-.226.367-.706.482-1.072.257-2.69-1.654-6.79-2.133-9.97-1.167-.413.125-.849-.106-.974-.519-.125-.413.106-.849.519-.974 3.632-1.102 8.147-.568 11.24 1.331.366.226.481.706.257 1.072zm.105-2.835C14.692 8.95 8.085 8.733 4.71 9.758c-.494.15-1.02-.128-1.17-.622-.15-.494.128-1.02.622-1.17 3.944-1.197 11.238-.946 15.053 1.32.444.263.59.84.327 1.284-.264.444-.841.59-1.284.327z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      category: "Música",
      handle: "Bruno Berrutti Oficial",
      href: "https://www.youtube.com/channel/UCwSn7Eenm5HFVXcH_XgDjhw",
      accent: "#FF0000",
      badge: "Canal Oficial",
      icon: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "Apple Music",
      category: "Música",
      handle: "Bruno Berrutti",
      href: "https://music.apple.com/us/artist/bruno-berrutti/1684551038",
      accent: "#FA2D48",
      badge: "Perfil de Artista",
      icon: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.13.64-2.79 1.43-.58.68-1.08 1.74-.94 2.79 1.07.08 2.11-.6 2.72-1.35z" />
        </svg>
      ),
    },
    {
      name: "SoundCloud",
      category: "Música",
      handle: "Bruno Berrutti",
      href: "https://soundcloud.com/search?q=Bruno%20Berrutti",
      accent: "#FF5500",
      badge: "Demos & Directos",
      icon: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.175 12.225c-.06 0-.115.053-.12.118l-.295 2.88c-.007.067.045.122.115.125h.315c.068 0 .123-.058.127-.125l.295-2.88c.006-.065-.045-.118-.115-.118h-.322zm1.22-.924c-.078 0-.142.062-.15.14l-.326 3.805c-.007.078.053.14.137.142h.382c.078 0 .14-.064.148-.142l.325-3.804c.007-.078-.052-.14-.135-.14h-.38zm1.28-.59c-.09 0-.166.074-.176.166l-.317 4.394c-.006.09.062.164.158.167h.43c.09 0 .164-.076.173-.166l.32-4.394c.007-.09-.06-.166-.157-.166h-.43zm1.313-.42c-.105 0-.19.088-.202.193l-.312 4.805c-.008.104.072.19.183.193h.478c.105 0 .192-.088.204-.193l.31-4.805c.008-.105-.07-.193-.182-.193h-.478zm1.353-.167c-.118 0-.214.098-.23.218l-.29 5.025c-.007.118.082.215.207.218h.525c.12 0 .216-.1.23-.218l.29-5.025c.008-.12-.08-.218-.206-.218h-.526zm1.385-.084c-.13 0-.238.107-.253.24l-.272 5.11c-.007.132.09.24.23.24h.575c.132 0 .24-.108.254-.24l.272-5.11c.008-.133-.09-.24-.23-.24h-.576zm1.42-.042c-.143 0-.26.12-.278.264l-.25 5.15c-.007.146.1.264.254.264h.624c.144 0 .262-.118.28-.264l.25-5.15c.007-.144-.1-.264-.253-.264h-.626zm1.455.084c-.157 0-.284.13-.303.29l-.23 5.068c-.008.16.11.29.278.29h.674c.158 0 .285-.13.303-.29l.23-5.068c.008-.16-.11-.29-.278-.29h-.674zm1.49.25c-.17 0-.308.143-.328.314l-.208 4.818c-.008.172.12.314.302.314h.722c.17 0 .31-.142.33-.314l.207-4.818c.008-.17-.12-.314-.302-.314h-.723zm1.614-2.825c-.2 0-.387.042-.555.118-.04.018-.063.058-.057.102l.142 5.097c.003.05.04.088.09.088h.615c.048 0 .087-.038.09-.088l.128-2.61c.002-.04.028-.073.067-.084.774-.216 1.344-.943 1.344-1.808 0-1.04-.84-1.885-1.87-1.885zm4.846 1.834c-.12 0-.236.02-.35.053-.05.016-.08.067-.066.12.348 1.25.105 2.65-.67 3.69-.034.045-.02.11.028.14.346.21.753.33 1.185.33 1.31 0 2.373-1.06 2.373-2.37 0-1.31-1.063-2.37-2.373-2.37l-.127.007z" />
        </svg>
      ),
    },
    {
      name: "RedTickets",
      category: "En Vivo",
      handle: "Sociedad Urbana · 11.10",
      href: site.tickets,
      accent: "#d4fc34",
      badge: "Entradas Oficiales",
      icon: ({ className }) => (
        <Radio className={className} />
      ),
    },
  ];

  return (
    <section
      id="redes"
      className="relative z-20 bg-paper py-14 sm:py-20 md:py-24 border-b border-ink/10 w-full max-w-full overflow-hidden select-none"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 md:px-12 mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="size-2 bg-acid-dark inline-block shrink-0" />
              <span className="kicker-mono">02 / Conectar · Plataformas</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal italic tracking-tight text-ink pr-2">
              Todas mis redes
            </h2>
          </div>

          <p className="font-mono text-xs text-ink-soft max-w-xs leading-relaxed uppercase tracking-wider">
            Escuchá la música, mirá los videos oficiales y enterate de las próximas fechas en vivo.
          </p>
        </div>
      </div>

      {/* InfiniteSlider Integration */}
      <div className="w-full relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <InfiniteSlider
          gap={20}
          duration={30}
          durationOnHover={80}
          reverse={false}
          className="py-3"
        >
          {socials.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center gap-3.5 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-paper-deep/60 border border-ink/12 hover:border-ink/40 shadow-soft hover:shadow-lift transition-all duration-300 hover:scale-[1.03] hover:bg-paper shrink-0 cursor-pointer min-w-[210px] sm:min-w-[240px]"
            >
              <div
                className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-paper text-ink transition-transform duration-300 group-hover:scale-110 group-hover:text-charcoal shadow-sm"
                style={{
                  boxShadow: `0 4px 12px ${item.accent}15`,
                }}
              >
                <item.icon className="size-5 transition-transform group-hover:rotate-6" />
              </div>

              <div className="flex flex-col min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[12px] sm:text-xs font-bold uppercase tracking-wider text-ink group-hover:text-black">
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className="inline-block px-1.5 py-0.5 rounded-full bg-ink/5 text-[9px] font-mono text-ink-soft group-hover:bg-acid/30 group-hover:text-charcoal transition-colors">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] sm:text-[11px] text-ink-soft truncate max-w-[130px] sm:max-w-[150px]">
                  {item.handle}
                </span>
              </div>

              <div className="ml-auto text-ink/30 group-hover:text-ink transition-colors">
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </InfiniteSlider>

        {/* Second reverse row for dynamic depth */}
        <InfiniteSlider
          gap={20}
          duration={36}
          durationOnHover={90}
          reverse={true}
          className="pt-3 pb-2 hidden sm:block"
        >
          {[...socials].reverse().map((item) => (
            <a
              key={`rev-${item.name}`}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center gap-3.5 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-charcoal/5 border border-ink/10 hover:border-ink/40 shadow-soft hover:shadow-lift transition-all duration-300 hover:scale-[1.03] hover:bg-paper shrink-0 cursor-pointer min-w-[210px] sm:min-w-[240px]"
            >
              <div className="flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-paper text-ink transition-transform duration-300 group-hover:scale-110 shadow-sm">
                <item.icon className="size-5 transition-transform group-hover:-rotate-6" />
              </div>

              <div className="flex flex-col min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[12px] sm:text-xs font-bold uppercase tracking-wider text-ink">
                    {item.name}
                  </span>
                </div>
                <span className="font-mono text-[10px] sm:text-[11px] text-ink-soft truncate max-w-[130px] sm:max-w-[150px]">
                  {item.handle}
                </span>
              </div>

              <div className="ml-auto text-ink/30 group-hover:text-ink transition-colors">
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </InfiniteSlider>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 font-mono text-[10px] text-ink-soft uppercase tracking-widest text-center px-4">
        <span>Pasa el cursor o tocá para detener el carrusel</span>
        <span className="size-1 rounded-full bg-ink/30" />
        <span className="text-ink font-bold">Disponible en todas las plataformas</span>
      </div>
    </section>
  );
}

// filepath: src/components/admin/admin-dashboard.tsx
import { useState } from "react";
import { useSiteContent, DEFAULT_CONTENT, type SiteContent, type GalleryPhoto } from "@/lib/content-store";
import {
  Save,
  RotateCcw,
  ArrowLeft,
  Image as ImageIcon,
  Type,
  Disc,
  Video,
  Sliders,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  Download,
  Upload,
  Lock,
  LogOut,
  User,
} from "lucide-react";

const PRESET_IMAGES = [
  { label: "Campo y Guitarra", src: "/images/bruno-field.jpg" },
  { label: "Retrato Sonriente", src: "/images/bruno-smile.jpg" },
  { label: "Costa y Olas", src: "/images/bruno-coast.jpg" },
  { label: "Espigas y Viento", src: "/images/bruno-pampas.jpg" },
  { label: "Arte de Tapa (Acuarela)", src: "/images/album-cover.jpg" },
];

const ADMIN_USER = "bruno@admin";
const ADMIN_PASS = "pasiempre";
const AUTH_KEY = "bb_admin_session_auth";

export function AdminDashboard() {
  const { content, update, reset } = useSiteContent();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [activeTab, setActiveTab] = useState<"general" | "album" | "gallery" | "video" | "design">("general");
  const [savedToast, setSavedToast] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  // Autenticación de acceso
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(AUTH_KEY) === "true";
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim().toLowerCase() === ADMIN_USER.toLowerCase() && passwordInput === ADMIN_PASS) {
      setIsAuthenticated(true);
      setLoginError("");
      sessionStorage.setItem(AUTH_KEY, "true");
    } else {
      setLoginError("Usuario o contraseña incorrectos");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_KEY);
  };

  // Sincronizar draft si content cambia externamente
  const handleSave = () => {
    update(draft);
    setSavedToast(true);
    window.setTimeout(() => setSavedToast(false), 3500);
  };

  const handleReset = () => {
    reset();
    setDraft(DEFAULT_CONTENT);
    setResetConfirm(false);
    setSavedToast(true);
    window.setTimeout(() => setSavedToast(false), 3500);
  };

  // Helper para actualizar campos anidados
  const updateSiteField = (field: keyof SiteContent["site"], val: string) => {
    setDraft((prev) => ({
      ...prev,
      site: { ...prev.site, [field]: val },
    }));
  };

  const updateAlbumField = (field: keyof SiteContent["albumSection"], val: string) => {
    setDraft((prev) => ({
      ...prev,
      albumSection: { ...prev.albumSection, [field]: val },
    }));
  };

  const updateInvitationField = (field: keyof SiteContent["invitation"], val: string) => {
    setDraft((prev) => ({
      ...prev,
      invitation: { ...prev.invitation, [field]: val },
    }));
  };

  // Manejo de galería
  const updateGalleryItem = (index: number, field: keyof GalleryPhoto, val: string) => {
    setDraft((prev) => {
      const nextList = [...prev.gallery];
      nextList[index] = { ...nextList[index], [field]: val };
      return { ...prev, gallery: nextList };
    });
  };

  const addGalleryItem = () => {
    const nextId = String(draft.gallery.length + 1).padStart(2, "0");
    const newItem: GalleryPhoto = {
      id: nextId,
      src: "/images/bruno-field.jpg",
      alt: "Nueva fotografía de Bruno Berrutti",
      title: "Nueva Imagen",
      tag: `${nextId} / Fotografía`,
      caption: "Descripción poética de la imagen para la galería interactiva.",
    };
    setDraft((prev) => ({
      ...prev,
      gallery: [...prev.gallery, newItem],
    }));
  };

  const removeGalleryItem = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  // Exportar JSON
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bruno-berrutti-contenido-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importar JSON
  const importJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result)) as SiteContent;
        setDraft(parsed);
        update(parsed);
        setSavedToast(true);
        window.setTimeout(() => setSavedToast(false), 3500);
      } catch {
        alert("El archivo JSON no tiene un formato válido.");
      }
    };
    reader.readAsText(file);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111] text-[#f4efe6] font-sans antialiased flex flex-col justify-between p-6 sm:p-10 selection:bg-[#d4fc34] selection:text-black">
        <div className="flex justify-between items-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs font-bold text-white transition-all hover:bg-white hover:text-black"
          >
            <ArrowLeft size={14} />
            <span>Volver a la Web</span>
          </a>
          <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest">
            CMS Privado
          </span>
        </div>

        <div className="mx-auto w-full max-w-sm my-auto">
          <div className="rounded-3xl border border-white/12 bg-[#181818] p-7 sm:p-9 shadow-2xl space-y-6 backdrop-blur-md">
            <div className="text-center space-y-2">
              <div className="mx-auto size-12 rounded-full bg-[#d4fc34]/10 border border-[#d4fc34]/30 flex items-center justify-center text-[#d4fc34] mb-4">
                <Lock size={20} />
              </div>
              <h1 className="font-serif text-3xl font-normal italic text-white tracking-tight">
                Bruno Berrutti
              </h1>
              <p className="font-mono text-[11px] uppercase tracking-wider text-white/50">
                Panel de Administración
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 pt-1">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-white/60 mb-1.5">
                  Usuario
                </label>
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    if (loginError) setLoginError("");
                  }}
                  placeholder="bruno@admin"
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 font-mono text-xs text-white placeholder:text-white/30 focus:border-[#d4fc34] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-white/60 mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (loginError) setLoginError("");
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 font-mono text-xs text-white placeholder:text-white/30 focus:border-[#d4fc34] focus:outline-none transition-colors"
                />
              </div>

              {loginError && (
                <div className="rounded-lg bg-red-500/15 border border-red-500/30 p-2.5 text-center font-mono text-xs text-red-300">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-[#d4fc34] py-3 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-white hover:scale-[1.01] active:scale-[0.98] shadow-lift cursor-pointer pt-3"
              >
                Ingresar al Panel
              </button>
            </form>
          </div>
        </div>

        <div className="text-center font-mono text-[10px] text-white/30 uppercase tracking-widest">
          © {new Date().getFullYear()} Bruno Berrutti · AMARGO CREATIVO
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-[#f4efe6] font-sans antialiased selection:bg-acid selection:text-black">
      {/* Top Bar fija */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#141414]/95 px-3.5 py-2.5 sm:px-6 sm:py-4 backdrop-blur-md">
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 font-mono text-[11px] sm:text-xs font-bold text-white transition-all hover:bg-white hover:text-black shrink-0"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Ver Web</span>
          </a>
          <div className="min-w-0">
            <h1 className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white truncate">
              Admin · Bruno Berrutti
            </h1>
            <p className="font-mono text-[9px] sm:text-[10px] text-white/50 uppercase hidden sm:block">
              Gestor de Contenido & Diseño Online
            </p>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {savedToast && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#d4fc34] px-2.5 py-1 font-mono text-[10px] sm:text-xs font-bold text-[#141414] animate-fade-in">
              <Check size={12} />
              <span className="hidden sm:inline">Guardado online</span>
              <span className="sm:hidden">Listo</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 font-mono text-xs font-bold uppercase text-white/70 hover:border-red-400 hover:text-red-400 transition-colors"
          >
            <RotateCcw size={13} />
            <span>Restaurar</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#d4fc34] px-3.5 py-1.5 sm:px-5 sm:py-2 font-mono text-[11px] sm:text-xs font-bold uppercase text-[#141414] hover:bg-white transition-all shadow-lift cursor-pointer hover:scale-[1.02]"
          >
            <Save size={13} />
            <span className="hidden sm:inline">Guardar Cambios</span>
            <span className="sm:hidden">Guardar</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full border border-white/20 size-8 sm:size-auto sm:px-3.5 sm:py-2 font-mono text-xs font-bold uppercase text-white/60 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
            title="Cerrar sesión de administración"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline sm:ml-1.5">Salir</span>
          </button>
        </div>
      </header>

      {/* Modal de confirmación de reset */}
      {resetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-[#1c1c1c] p-6 shadow-2xl">
            <h3 className="font-serif text-2xl font-normal italic text-white mb-2">
              ¿Restaurar valores originales?
            </h3>
            <p className="font-mono text-xs text-white/70 leading-relaxed mb-6">
              Esta acción restablecerá todos los textos, imágenes de la galería y fechas a los valores originales predeterminados del sitio.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="px-4 py-2 rounded-full font-mono text-xs text-white/60 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2 rounded-full bg-red-500 text-white font-mono text-xs font-bold uppercase hover:bg-red-600"
              >
                Restaurar todo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8">
        {/* Banner de Bienvenida: Memoria "Pa Siempre" */}
        <div className="mb-8 relative overflow-hidden rounded-3xl border border-white/12 bg-black/40 shadow-2xl">
          <div className="relative h-44 sm:h-52 md:h-60 w-full overflow-hidden">
            <img
              src="/images/pasiempre.jpg"
              alt="Pa Siempre - Amigos de Bruno Berrutti"
              className="w-full h-full object-cover object-[center_30%] filter saturate-95 brightness-90 hover:scale-[1.01] transition-transform duration-700"
            />
            {/* Gradientes sutiles para fundir con la interfaz oscura */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/25 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/70 via-transparent to-[#141414]/40 pointer-events-none" />

            {/* Badge sutil superior */}
            <div className="absolute top-4 left-5 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/85 font-mono text-[10px] uppercase tracking-wider">
              <span className="size-1.5 rounded-full bg-[#d4fc34] animate-pulse" />
              <span>Espacio de Creación · Bruno Berrutti</span>
            </div>

            {/* Firma manuscrita delicada en la esquina inferior */}
            <div className="absolute bottom-3.5 right-6 sm:bottom-5 sm:right-8 z-10 flex flex-col items-end pointer-events-none">
              <span
                className="text-4xl sm:text-5xl md:text-6xl text-white/95 select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] tracking-wide"
                style={{
                  fontFamily: "'Caveat', cursive",
                  transform: "rotate(-3deg)",
                }}
              >
                Pa Siempre <span className="text-red-400 text-3xl sm:text-4xl">♥</span>
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white/60 pr-1 drop-shadow">
                Las canciones, los amigos y el camino
              </span>
            </div>
          </div>
        </div>

        {/* Pestañas de Navegación del CMS */}
        <div className="mb-6 sm:mb-8 flex gap-2 border-b border-white/10 pb-3 sm:pb-4 font-mono text-xs overflow-x-auto no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {[
            { id: "general", label: "Textos & Fechas", icon: Type },
            { id: "album", label: "El Disco (Vinilo)", icon: Disc },
            { id: "gallery", label: `Galería (${draft.gallery.length} fotos)`, icon: ImageIcon },
            { id: "video", label: "Video / Invitación", icon: Video },
            { id: "design", label: "Diseño & Audio", icon: Sliders },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex items-center gap-2 rounded-full px-3.5 py-2 sm:px-4 sm:py-2 uppercase tracking-wider transition-all shrink-0 text-[11px] sm:text-xs ${
                activeTab === id
                  ? "bg-white text-black font-bold shadow-sm"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ================= PESTAÑA 1: TEXTOS & FECHAS ================= */}
        {activeTab === "general" && (
          <div className="space-y-8 animate-fade-in">
            <div className="rounded-2xl border border-white/10 bg-[#181818] p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-2xl italic text-white flex items-center gap-2">
                <Type size={20} className="text-[#d4fc34]" />
                <span>Información del Artista & Show</span>
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Nombre del Artista
                  </label>
                  <input
                    type="text"
                    value={draft.site.artist}
                    onChange={(e) => updateSiteField("artist", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Subtítulo Editorial (Hero)
                  </label>
                  <input
                    type="text"
                    value={draft.site.heroSubtitle}
                    onChange={(e) => updateSiteField("heroSubtitle", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Fecha Corta (ej: 11.10)
                  </label>
                  <input
                    type="text"
                    value={draft.site.dateShort}
                    onChange={(e) => updateSiteField("dateShort", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Fecha Completa (ej: Domingo 11 de octubre)
                  </label>
                  <input
                    type="text"
                    value={draft.site.dateLabel}
                    onChange={(e) => updateSiteField("dateLabel", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Hora del Show (ej: 20:30)
                  </label>
                  <input
                    type="text"
                    value={draft.site.time}
                    onChange={(e) => updateSiteField("time", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Lugar / Venue (ej: Sociedad Urbana)
                  </label>
                  <input
                    type="text"
                    value={draft.site.venue}
                    onChange={(e) => updateSiteField("venue", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Dirección (ej: Alejo Rosell y Rius 1483)
                  </label>
                  <input
                    type="text"
                    value={draft.site.address}
                    onChange={(e) => updateSiteField("address", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Barrio & Ciudad (ej: Villa Dolores, Montevideo)
                  </label>
                  <input
                    type="text"
                    value={`${draft.site.neighborhood}, ${draft.site.city}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(",");
                      updateSiteField("neighborhood", (parts[0] || "").trim());
                      updateSiteField("city", (parts[1] || "").trim());
                    }}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Enlace Oficial de Entradas (RedTickets)
                  </label>
                  <input
                    type="url"
                    value={draft.site.tickets}
                    onChange={(e) => updateSiteField("tickets", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Enlace de Instagram
                  </label>
                  <input
                    type="url"
                    value={draft.site.instagram}
                    onChange={(e) => updateSiteField("instagram", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Usuario de Instagram
                  </label>
                  <input
                    type="text"
                    value={draft.site.instagramHandle}
                    onChange={(e) => updateSiteField("instagramHandle", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PESTAÑA 2: EL DISCO / VINILO ================= */}
        {activeTab === "album" && (
          <div className="space-y-8 animate-fade-in">
            <div className="rounded-2xl border border-white/10 bg-[#181818] p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl italic text-white flex items-center gap-2">
                  <Disc size={20} className="text-[#d4fc34]" />
                  <span>Sección Álbum & Vinilo Interactivo</span>
                </h2>
                <span className="font-mono text-xs text-white/50 uppercase">
                  (Ref: Screenshot adjuntado)
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Badge Año (ej: 2026)
                  </label>
                  <input
                    type="text"
                    value={draft.albumSection.badgeYear}
                    onChange={(e) => updateAlbumField("badgeYear", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Kicker / Etiqueta (ej: 03 / NUEVA EDICION)
                  </label>
                  <input
                    type="text"
                    value={draft.albumSection.kicker}
                    onChange={(e) => updateAlbumField("kicker", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Título del Álbum
                  </label>
                  <input
                    type="text"
                    value={draft.albumSection.title}
                    onChange={(e) => updateAlbumField("title", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-serif text-xl italic text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Formatos Disponibles
                  </label>
                  <input
                    type="text"
                    value={draft.albumSection.formats}
                    onChange={(e) => updateAlbumField("formats", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Texto Poético / Descripción del Disco
                  </label>
                  <textarea
                    rows={4}
                    value={draft.albumSection.description}
                    onChange={(e) => updateAlbumField("description", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 p-4 font-sans text-sm text-white focus:border-[#d4fc34] outline-none leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Ruta de Portada del Vinilo (Centro giratorio)
                  </label>
                  <div className="flex gap-4 items-center">
                    <img
                      src={draft.albumSection.coverImage}
                      alt="Preview tapa"
                      className="size-16 rounded-full object-cover border border-white/20"
                    />
                    <input
                      type="text"
                      value={draft.albumSection.coverImage}
                      onChange={(e) => updateAlbumField("coverImage", e.target.value)}
                      className="flex-1 rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PESTAÑA 3: GALERÍA VISUAL ================= */}
        {activeTab === "gallery" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl italic text-white flex items-center gap-2">
                  <ImageIcon size={20} className="text-[#d4fc34]" />
                  <span>Galería de Fotos Interactiva</span>
                </h2>
                <p className="font-mono text-xs text-white/50 mt-1">
                  Agregá, editá o cambiá el orden de las fotografías del carrusel.
                </p>
              </div>

              <button
                type="button"
                onClick={addGalleryItem}
                className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 font-mono text-xs font-bold uppercase hover:bg-[#d4fc34] transition-colors"
              >
                <Plus size={14} />
                <span>Agregar Foto</span>
              </button>
            </div>

            <div className="space-y-4">
              {draft.gallery.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="rounded-xl border border-white/10 bg-[#181818] p-5 flex flex-col md:flex-row gap-6 items-start"
                >
                  {/* Preview de la foto */}
                  <div className="w-full md:w-40 aspect-[3/4] shrink-0 rounded-lg overflow-hidden bg-black border border-white/15 relative">
                    <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
                    <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Campos editables */}
                  <div className="flex-1 grid gap-4 sm:grid-cols-2 w-full">
                    <div>
                      <label className="block font-mono text-[10px] uppercase text-white/50 mb-1">
                        Título de la Foto
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateGalleryItem(idx, "title", e.target.value)}
                        className="w-full rounded border border-white/15 bg-black/40 px-3 py-1.5 font-serif text-base italic text-white focus:border-[#d4fc34] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] uppercase text-white/50 mb-1">
                        Etiqueta / Kicker
                      </label>
                      <input
                        type="text"
                        value={item.tag}
                        onChange={(e) => updateGalleryItem(idx, "tag", e.target.value)}
                        className="w-full rounded border border-white/15 bg-black/40 px-3 py-1.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-mono text-[10px] uppercase text-white/50 mb-1">
                        Pie de Foto / Epígrafe
                      </label>
                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) => updateGalleryItem(idx, "caption", e.target.value)}
                        className="w-full rounded border border-white/15 bg-black/40 px-3 py-1.5 font-sans text-xs text-white focus:border-[#d4fc34] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-mono text-[10px] uppercase text-white/50 mb-1">
                        Ruta de Imagen (o seleccioná de los preajustes)
                      </label>
                      <input
                        type="text"
                        value={item.src}
                        onChange={(e) => updateGalleryItem(idx, "src", e.target.value)}
                        className="w-full rounded border border-white/15 bg-black/40 px-3 py-1.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none mb-2"
                      />

                      {/* Presets rápidos */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {PRESET_IMAGES.map((preset) => (
                          <button
                            key={preset.src}
                            type="button"
                            onClick={() => updateGalleryItem(idx, "src", preset.src)}
                            className="rounded border border-white/10 px-2.5 py-1 font-mono text-[9px] uppercase text-white/60 hover:border-white/40 hover:text-white"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(idx)}
                    className="p-2 text-white/40 hover:text-red-400 self-end md:self-start"
                    aria-label="Eliminar foto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PESTAÑA 4: VIDEO / INVITACIÓN ================= */}
        {activeTab === "video" && (
          <div className="space-y-8 animate-fade-in">
            <div className="rounded-2xl border border-white/10 bg-[#181818] p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-2xl italic text-white flex items-center gap-2">
                <Video size={20} className="text-[#d4fc34]" />
                <span>Sección Invitación Oficial & Video</span>
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Kicker (ej: 04 / Invitación Oficial)
                  </label>
                  <input
                    type="text"
                    value={draft.invitation.kicker}
                    onChange={(e) => updateInvitationField("kicker", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Lugar y Hora en Pie de Video
                  </label>
                  <input
                    type="text"
                    value={draft.invitation.locationNote}
                    onChange={(e) => updateInvitationField("locationNote", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Titular Principal del Video
                  </label>
                  <input
                    type="text"
                    value={draft.invitation.title}
                    onChange={(e) => updateInvitationField("title", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-serif text-xl italic text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    Descripción del Concierto
                  </label>
                  <textarea
                    rows={3}
                    value={draft.invitation.description}
                    onChange={(e) => updateInvitationField("description", e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/50 p-4 font-sans text-sm text-white focus:border-[#d4fc34] outline-none leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-white/60 mb-2">
                    URL del Reel de Instagram
                  </label>
                  <input
                    type="url"
                    value={draft.invitation.reelUrl}
                    onChange={(e) => {
                      const url = e.target.value;
                      updateInvitationField("reelUrl", url);
                      // Auto-generar embed URL
                      const clean = url.split("?")[0].replace(/\/$/, "");
                      updateInvitationField("embedUrl", `${clean}/embed`);
                    }}
                    className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-2.5 font-mono text-xs text-white focus:border-[#d4fc34] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PESTAÑA 5: DISEÑO & AUDIO ================= */}
        {activeTab === "design" && (
          <div className="space-y-8 animate-fade-in">
            <div className="rounded-2xl border border-white/10 bg-[#181818] p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-2xl italic text-white flex items-center gap-2">
                <Sliders size={20} className="text-[#d4fc34]" />
                <span>Ajustes de Sonido & Gráfica</span>
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-xs uppercase text-white font-bold">
                      Volumen Inicial por Defecto
                    </label>
                    <span className="font-mono text-xs text-[#d4fc34] font-bold">
                      {Math.round(draft.design.defaultVolume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={draft.design.defaultVolume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setDraft((prev) => ({
                        ...prev,
                        design: { ...prev.design, defaultVolume: val },
                      }));
                    }}
                    className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#d4fc34]"
                  />
                  <p className="font-mono text-[10px] text-white/50">
                    Nivel de volumen en el que inicia la reproducción tras el fade-in progresivo.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-xs uppercase text-white font-bold">
                      Grano de Película Analógico
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setDraft((prev) => ({
                          ...prev,
                          design: { ...prev.design, showGrain: !prev.design.showGrain },
                        }));
                      }}
                      className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase transition-all ${
                        draft.design.showGrain ? "bg-[#d4fc34] text-black" : "bg-white/10 text-white/50"
                      }`}
                    >
                      {draft.design.showGrain ? "Activado" : "Desactivado"}
                    </button>
                  </div>
                  <p className="font-mono text-[10px] text-white/50">
                    Aplica una microtextura táctil de 3.5% de opacidad para dar textura editorial.
                  </p>
                </div>
              </div>
            </div>

            {/* Herramientas de Backup / Portabilidad */}
            <div className="rounded-2xl border border-white/10 bg-[#181818] p-6 sm:p-8 space-y-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                Copia de Seguridad & Portabilidad
              </h3>
              <p className="font-mono text-xs text-white/60">
                Podés descargar una copia de todos los textos y configuración o importar un archivo JSON guardado.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  type="button"
                  onClick={exportJson}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs font-bold uppercase text-white hover:bg-white hover:text-black transition-all"
                >
                  <Download size={14} />
                  <span>Descargar Copia JSON</span>
                </button>

                <label className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs font-bold uppercase text-white hover:bg-white hover:text-black transition-all cursor-pointer">
                  <Upload size={14} />
                  <span>Restaurar desde JSON</span>
                  <input type="file" accept=".json" onChange={importJson} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

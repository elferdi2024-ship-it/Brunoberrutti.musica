// filepath: scripts/generate-og-card.mjs
import fs from "node:fs";
import { chromium } from "playwright";

async function generateOgCard() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2, // 2x high-DPI rasterization
  });

  const coverBase64 = fs.readFileSync("public/images/album-cover.jpg").toString("base64");
  const coverSrc = `data:image/jpeg;base64,${coverBase64}`;

  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="utf-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        width: 1200px;
        height: 630px;
        background-color: #FAF7F0;
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        color: #141414;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      /* Warm organic background with subtle vignette */
      .bg-ambient {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 25% 50%, rgba(212, 252, 52, 0.08) 0%, transparent 60%),
                    radial-gradient(circle at 80% 30%, rgba(200, 190, 175, 0.2) 0%, transparent 60%);
        pointer-events: none;
      }
      /* Editorial hairline frames */
      .frame {
        position: absolute;
        inset: 22px;
        border: 1px solid rgba(20, 20, 20, 0.14);
        pointer-events: none;
        border-radius: 16px;
      }
      .inner-frame {
        position: absolute;
        inset: 30px;
        border: 1px solid rgba(20, 20, 20, 0.06);
        pointer-events: none;
        border-radius: 10px;
      }
      .container {
        width: 100%;
        height: 100%;
        padding: 50px 76px;
        display: grid;
        grid-template-columns: 480px 1fr;
        gap: 56px;
        align-items: center;
        z-index: 2;
      }
      .art-column {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .art-wrapper {
        position: relative;
        width: 470px;
        height: 470px;
        border-radius: 26px;
        overflow: hidden;
        background: #F8F5EE;
        box-shadow: 
          0 28px 70px -15px rgba(20, 20, 20, 0.28),
          0 0 0 1px rgba(20, 20, 20, 0.08);
      }
      .art-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .info-column {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 16px;
      }
      .badge-row {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        background: #141414;
        color: #F8F5EE;
        padding: 6px 14px;
        border-radius: 999px;
        font-family: 'Space Mono', monospace;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .dot {
        width: 7px;
        height: 7px;
        background: #D4FC34;
        border-radius: 50%;
      }
      .kicker {
        font-family: 'Space Mono', monospace;
        font-size: 11px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: rgba(20, 20, 20, 0.55);
        font-weight: 700;
      }
      .artist-name {
        font-size: 40px;
        font-weight: 800;
        letter-spacing: -0.02em;
        text-transform: uppercase;
        color: #141414;
        line-height: 1.05;
      }
      .album-title {
        font-family: 'Instrument Serif', serif;
        font-size: 64px;
        font-style: italic;
        font-weight: 400;
        color: #141414;
        line-height: 1.02;
        margin-top: -6px;
        letter-spacing: -0.01em;
      }
      .divider {
        width: 100%;
        height: 1px;
        background: rgba(20, 20, 20, 0.15);
        margin: 4px 0;
      }
      .event-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .event-date {
        font-family: 'Space Mono', monospace;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #141414;
      }
      .event-venue {
        font-size: 14px;
        color: rgba(20, 20, 20, 0.72);
        font-weight: 500;
      }
      .cta-pill {
        margin-top: 10px;
        display: inline-flex;
        align-items: center;
        gap: 12px;
        background: #141414;
        color: #F8F5EE;
        padding: 12px 24px;
        border-radius: 999px;
        font-family: 'Space Mono', monospace;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        align-self: flex-start;
        box-shadow: 0 10px 24px -6px rgba(0,0,0,0.25);
      }
      .cta-acid {
        color: #D4FC34;
      }
      .signature-mark {
        position: absolute;
        bottom: 34px;
        right: 40px;
        font-family: 'Space Mono', monospace;
        font-size: 10px;
        letter-spacing: 0.12em;
        color: rgba(20, 20, 20, 0.35);
        text-transform: uppercase;
      }
    </style>
  </head>
  <body>
    <div class="bg-ambient"></div>
    <div class="frame"></div>
    <div class="inner-frame"></div>
    <div class="container">
      <div class="art-column">
        <div class="art-wrapper">
          <img src="${coverSrc}" class="art-image" alt="Una vuelta menos - Bruno Berrutti" />
        </div>
      </div>
      <div class="info-column">
        <div class="badge-row">
          <span class="badge"><span class="dot"></span>Nuevo EP</span>
          <span class="kicker">Cantautor · Uruguay</span>
        </div>
        <h1 class="artist-name">Bruno Berrutti</h1>
        <h2 class="album-title">Una vuelta menos</h2>
        <div class="divider"></div>
        <div class="event-details">
          <p class="event-date">Presentación en vivo · Domingo 11 Octubre</p>
          <p class="event-venue">Sociedad Urbana · Villa Dolores, Montevideo</p>
        </div>
        <div class="cta-pill">
          <span>Escuchar Online</span>
          <span class="cta-acid">· Entradas 🎟️</span>
        </div>
      </div>
    </div>
    <div class="signature-mark">brunoberrutti.uy</div>
  </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: "networkidle" });
  // Wait for Google Webfonts to render cleanly
  await page.waitForTimeout(1200);

  // Export 1200x630 JPEG (quality 90, < 200KB for WhatsApp)
  await page.screenshot({
    path: "public/og.jpg",
    type: "jpeg",
    quality: 90,
  });

  // Also export lossless PNG
  await page.screenshot({
    path: "public/og.png",
    type: "png",
  });

  console.log("Successfully generated public/og.jpg and public/og.png");
  await browser.close();
}

generateOgCard().catch((err) => {
  console.error("Error generating OG card:", err);
  process.exit(1);
});

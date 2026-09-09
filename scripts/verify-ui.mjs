// filepath: scripts/verify-ui.mjs
import { chromium } from "playwright";
import fs from "node:fs";

if (!fs.existsSync("screenshots")) {
  fs.mkdirSync("screenshots", { recursive: true });
}

async function verify() {
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Mobile viewport (390 x 844)
    const mobileCtx = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const mobilePage = await mobileCtx.newPage();

    const mobileConsoleErrors = [];
    mobilePage.on("console", (msg) => {
      if (msg.type() === "error") mobileConsoleErrors.push(msg.text());
    });

    await mobilePage.goto("http://localhost:8080/", { waitUntil: "networkidle" });
    await mobilePage.screenshot({ path: "screenshots/mobile-hero-verified.png" });

    // Mobile Disco Section
    const mobileDisco = mobilePage.locator("#disco");
    if (await mobileDisco.count()) {
      await mobileDisco.scrollIntoViewIfNeeded();
      await mobilePage.waitForTimeout(500);
      await mobilePage.screenshot({ path: "screenshots/mobile-disco-verified.png" });
    }

    // Mobile Footer Section
    const mobileFooter = mobilePage.locator("footer");
    if (await mobileFooter.count()) {
      await mobileFooter.scrollIntoViewIfNeeded();
      await mobilePage.waitForTimeout(600);
      await mobilePage.screenshot({ path: "screenshots/mobile-footer-verified.png" });
    }

    // 2. Desktop viewport (1280 x 800)
    const desktopCtx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const desktopPage = await desktopCtx.newPage();
    const desktopConsoleErrors = [];
    desktopPage.on("console", (msg) => {
      if (msg.type() === "error") desktopConsoleErrors.push(msg.text());
    });

    await desktopPage.goto("http://localhost:8080/", { waitUntil: "networkidle" });
    await desktopPage.screenshot({ path: "screenshots/desktop-hero-verified.png" });

    // Desktop Disco Section
    const desktopDisco = desktopPage.locator("#disco");
    if (await desktopDisco.count()) {
      await desktopDisco.scrollIntoViewIfNeeded();
      await desktopPage.waitForTimeout(500);
      await desktopPage.screenshot({ path: "screenshots/desktop-disco-verified.png" });
    }

    // Desktop Gallery Section
    const desktopGaleria = desktopPage.locator("#galeria");
    if (await desktopGaleria.count()) {
      await desktopGaleria.scrollIntoViewIfNeeded();
      await desktopPage.waitForTimeout(500);
      await desktopPage.screenshot({ path: "screenshots/desktop-galeria-verified.png" });
    }

    // Desktop Tour Section (Entradas)
    const desktopTour = desktopPage.locator("#fechas");
    if (await desktopTour.count()) {
      await desktopTour.scrollIntoViewIfNeeded();
      await desktopPage.waitForTimeout(500);
      await desktopPage.screenshot({ path: "screenshots/desktop-tour-verified.png" });
    }

    // 3. Admin Login & Dashboard Test
    const adminPage = await desktopCtx.newPage();
    await adminPage.goto("http://localhost:8080/admin", { waitUntil: "networkidle" });
    await adminPage.screenshot({ path: "screenshots/admin-login-screen.png" });

    // Login with bruno@admin / pasiempre
    await adminPage.fill('input[type="text"]', "bruno@admin");
    await adminPage.fill('input[type="password"]', "pasiempre");
    await adminPage.click('button[type="submit"]');
    await adminPage.waitForTimeout(600);
    await adminPage.screenshot({ path: "screenshots/admin-dashboard-logged-in.png" });

    console.log(
      JSON.stringify({
        success: true,
        mobileErrors: mobileConsoleErrors,
        desktopErrors: desktopConsoleErrors,
      })
    );
  } finally {
    await browser.close();
  }
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});

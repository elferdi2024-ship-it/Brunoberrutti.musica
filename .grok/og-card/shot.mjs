import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const html = pathToFileURL(join(import.meta.dirname, "index.html")).href;
const out = "/workspace/.grok/og-card/og-raw.png";

const browser = await chromium.launch({
  args: ["--allow-file-access-from-files"],
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});
await page.goto(html, { waitUntil: "load" });
await page.waitForFunction(() => document.fonts.status === "loaded");
await page.waitForFunction(() => {
  const imgs = [...document.images];
  return imgs.length > 0 && imgs.every((img) => img.complete && img.naturalWidth > 0);
});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(120);
await page.screenshot({ path: out, type: "png", omitBackground: false });
await browser.close();
console.log("wrote", out);

/**
 * Capture en lot des écrans réels des projets.
 *
 * Même principe que `couverture.mjs` — Chromium n'a pas d'accès réseau dans cet
 * environnement, chaque requête est servie par curl — mais tout se fait dans un
 * seul navigateur : 25 pages dans un processus plutôt que 25 processus, et la
 * session garde le refus des cookies d'une page à l'autre.
 *
 *   node scripts/ecrans.mjs ecrans.json
 *
 * Le fichier décrit, par projet : { base, pages: [{ fichier, chemin, legende,
 * attendre? , defiler? }] }. `defiler` photographie plus bas que le haut de
 * page, pour montrer une section qui n'est pas au-dessus de la ligne de
 * flottaison.
 */
import pw from "/opt/node22/lib/node_modules/playwright/index.js";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync, mkdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";

const sharp = createRequire(import.meta.url)("sharp");
const { chromium } = pw;
const CA = process.env.NODE_EXTRA_CA_CERTS || "/root/.ccr/ca-bundle.crt";
const tmp = mkdtempSync(join(tmpdir(), "ecrans-"));
let n = 0;

const chercher = (u) => {
  const corps = join(tmp, "c" + n), tetes = join(tmp, "h" + (n++));
  execFileSync("curl", [
    "-sS", "-L", "--max-time", "30", "--cacert", CA,
    "-A", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36",
    "-H", "Accept-Language: fr-FR,fr;q=0.9,en;q=0.5",
    "-D", tetes, "-o", corps, u,
  ], { timeout: 40000 });
  const brut = readFileSync(tetes, "utf8").split(/\r?\n\r?\n/).filter((b) => b.trim()).pop() || "";
  const l = brut.split(/\r?\n/);
  const headers = {};
  l.slice(1).forEach((x) => {
    const i = x.indexOf(":");
    if (i < 0) return;
    const k = x.slice(0, i).trim().toLowerCase();
    if (["content-encoding", "content-length", "transfer-encoding",
         "content-security-policy", "strict-transport-security"].includes(k)) return;
    headers[k] = x.slice(i + 1).trim();
  });
  return { statut: Number((l[0].match(/\s(\d{3})\s/) || [])[1] || 200), headers, corps: readFileSync(corps) };
};

const spec = JSON.parse(readFileSync(process.argv[2], "utf8"));
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await b.newContext({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1,
  locale: "fr-FR",
  timezoneId: "Europe/Paris",
  extraHTTPHeaders: { "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.5" },
});
const p = await ctx.newPage();
await p.route("**/*", async (route) => {
  const u = route.request().url();
  if (!/^https?:/.test(u)) return route.continue();
  try { const r = chercher(u); await route.fulfill({ status: r.statut, headers: r.headers, body: r.corps }); }
  catch { await route.abort(); }
});

let ok = 0, rates = 0;
for (const [slug, projet] of Object.entries(spec)) {
  for (const page of projet.pages) {
    const url = projet.base + page.chemin;
    const sortie = `public/projets/ecrans/${page.fichier}.webp`;
    try {
      const r = await p.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
      await p.waitForTimeout(page.attendre ?? 6000);
      // Bandeau cookies : on refuse, comme un visiteur. Une seule fois par
      // domaine suffit, mais le rejouer ne coûte rien et couvre les SPA qui
      // le réaffichent au changement de route.
      await p.evaluate(() => {
        const m = /^(tout refuser|refuser tout|refuser|continuer sans accepter|reject all|decline)$/i;
        [...document.querySelectorAll("button, a[role=button]")]
          .find((e) => m.test(e.textContent.replace(/\s+/g, " ").trim()))?.click();
      });
      await p.waitForTimeout(1200);

      // Badge « Edit with Lovable » : widget de la plateforme d'hébergement,
      // posé par-dessus la page, pas un élément du design d'Eyden. Le laisser
      // dans une capture de portfolio, c'est montrer l'outil au lieu du travail.
      await p.evaluate(() => {
        document.querySelectorAll('a[href*="lovable.dev"], a[href*="lovable.app/?"], [id*="lovable" i], [class*="lovable" i]')
          .forEach((e) => e.remove());
        [...document.querySelectorAll("body > *")].forEach((e) => {
          const s = getComputedStyle(e);
          if (s.position === "fixed" && /edit with/i.test(e.textContent || "")) e.remove();
        });
      });
      if (page.defiler) {
        await p.evaluate((y) => scrollTo(0, y), page.defiler);
        await p.waitForTimeout(2600);
      }
      mkdirSync(dirname(sortie), { recursive: true });
      const png = await p.screenshot({ clip: { x: 0, y: 0, width: 1600, height: 900 } });
      await sharp(png).webp({ quality: 78 }).toFile(sortie);
      const poids = (readFileSync(sortie).length / 1024) | 0;
      console.log(`  ${slug} · ${page.fichier} · ${r.status()} · ${poids} Ko · ${url}`);
      ok++;
    } catch (e) {
      console.log(`  ÉCHEC ${slug} · ${page.fichier} · ${e.message.split("\n")[0]}`);
      rates++;
    }
  }
}
await b.close();
console.log(`\n${ok} écran(s) capturé(s), ${rates} échec(s), ${n} requêtes servies.`);
if (rates) process.exitCode = 1;

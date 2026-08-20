/**
 * Capture la page d'accueil d'un site et en fait une couverture de projet.
 *
 * Chromium n'a pas d'accès réseau ici — connexion coupée sur tout, example.com
 * compris — alors que curl passe par le proxy. Chaque requête de la page est
 * donc servie par curl : ce qui est photographié est le vrai site, avec ses
 * vraies feuilles de style, ses vraies polices et ses vraies images.
 *
 * Cadrage : 1600×900, le rapport des autres couvertures. Assez large pour que
 * les barres de navigation chargées restent dépliées — en dessous de ~1400 px
 * elles passent en menu burger et la couverture ne ressemble plus au site.
 */
import pw from "/opt/node22/lib/node_modules/playwright/index.js";
import { createRequire } from "node:module";
const sharp = createRequire(import.meta.url)("sharp");
import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const { chromium } = pw;
const [url, sortie] = process.argv.slice(2);
const CA = process.env.NODE_EXTRA_CA_CERTS || "/root/.ccr/ca-bundle.crt";
const tmp = mkdtempSync(join(tmpdir(), "cover-"));
let n = 0, echecs = 0;

const chercher = (u) => {
  const corps = join(tmp, "c" + n), tetes = join(tmp, "h" + (n++));
  execFileSync("curl", [
    "-sS", "-L", "--max-time", "30", "--cacert", CA,
    "-A", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36",
    // Sans ça, MindSet répond en anglais : le site choisit sa langue sur
    // l'en-tête du navigateur, et une couverture en anglais ne montrerait pas
    // le site tel que ses visiteurs le voient.
    "-H", "Accept-Language: fr-FR,fr;q=0.9,en;q=0.5",
    "-D", tetes, "-o", corps, u,
  ], { timeout: 40000 });
  const brut = readFileSync(tetes, "utf8").split(/\r?\n\r?\n/).filter((b) => b.trim()).pop() || "";
  const lignes = brut.split(/\r?\n/);
  const statut = Number((lignes[0].match(/\s(\d{3})\s/) || [])[1] || 200);
  const headers = {};
  lignes.slice(1).forEach((l) => {
    const i = l.indexOf(":");
    if (i < 0) return;
    const k = l.slice(0, i).trim().toLowerCase();
    // Recalculés par `fulfill` : les garder produirait des en-têtes contradictoires.
    if (["content-encoding", "content-length", "transfer-encoding",
         "content-security-policy", "strict-transport-security"].includes(k)) return;
    headers[k] = l.slice(i + 1).trim();
  });
  return { statut, headers, corps: readFileSync(corps) };
};

const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1,
  locale: "fr-FR",
  timezoneId: "Europe/Paris",
  extraHTTPHeaders: { "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.5" },
});
await p.route("**/*", async (route) => {
  const u = route.request().url();
  if (!/^https?:/.test(u)) return route.continue();
  try { const r = chercher(u); await route.fulfill({ status: r.statut, headers: r.headers, body: r.corps }); }
  catch { echecs++; await route.abort(); }
});

const r = await p.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await p.waitForTimeout(7000);

// Bandeau cookies : on refuse, comme le ferait n'importe quel visiteur. Le
// masquer sans répondre laisserait le site croire que la question est ouverte,
// et le bandeau reviendrait au premier changement de page.
const refus = await p.evaluate(() => {
  const mots = /^(tout refuser|refuser tout|refuser|continuer sans accepter|reject all|decline)$/i;
  const b = [...document.querySelectorAll("button, a[role=button]")]
    .find((e) => mots.test(e.textContent.replace(/\s+/g, " ").trim()));
  if (!b) return null;
  b.click();
  return b.textContent.trim();
});
if (refus) { console.log("  bandeau cookies :", refus); await p.waitForTimeout(2000); }
// Aller-retour : réveille ce qui s'anime à l'entrée en vue, puis on remonte.
await p.evaluate(() => scrollTo(0, 700));
await p.waitForTimeout(2500);
await p.evaluate(() => scrollTo(0, 0));
await p.waitForTimeout(4000);
const png = await p.screenshot({ clip: { x: 0, y: 0, width: 1600, height: 900 } });
console.log(url, "| statut :", r.status(), "| titre :", await p.title(),
            "| requêtes :", n, "| échecs :", echecs);
console.log("  texte visible :", (await p.evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 140))));
await b.close();

await sharp(png).webp({ quality: 80 }).toFile(sortie);
const m = await sharp(sortie).metadata();
console.log("  ->", sortie, m.width + "x" + m.height, readFileSync(sortie).length + " o");

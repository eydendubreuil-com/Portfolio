/**
 * Recette de l'aperçu en un seul fichier.
 *
 *   node scripts/recette-apercu.mjs [chemin/vers/preview.html]
 *
 * L'aperçu a cette particularité qu'il se casse sans rien dire : une page vide,
 * un script invalide ou un sélecteur trop large donnent un fichier qui s'affiche
 * normalement et où rien ne marche. Cette recette vérifie ce qu'un visiteur fait
 * vraiment — cliquer une carte, feuilleter des chapitres, agrandir un écran,
 * survoler un lien de la carte des dépendances — et sort en échec sur le premier
 * manquement.
 */
import pw from "/opt/node22/lib/node_modules/playwright/index.js";
import { existsSync } from "node:fs";

const { chromium } = pw;
const FICHIER = process.argv[2] || "/home/user/Portfolio/preview.html";
if (!existsSync(FICHIER)) throw new Error(`Introuvable : ${FICHIER}`);

const echecs = [];
const dire = (titre, valeur, attendu) => {
  const ok = typeof attendu === "function" ? attendu(valeur) : valeur === attendu;
  if (!ok) echecs.push(`${titre} — obtenu ${JSON.stringify(valeur)}`);
  console.log(`${ok ? "  ok " : "ÉCHEC"}  ${titre} : ${JSON.stringify(valeur)}`);
};

const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const erreurs = [];
p.on("pageerror", (e) => erreurs.push(e.message));
p.on("console", (m) => m.type() === "error" && erreurs.push(m.text()));

await p.goto("file://" + FICHIER, { waitUntil: "load" });
await p.waitForTimeout(3000);

console.log("\n— Accueil —");
dire("route de départ", await p.evaluate(() => document.documentElement.dataset.apercuCourant), "/");
dire(
  "sections",
  await p.evaluate(() =>
    [...document.querySelectorAll("body > main > section, body > main > div > section")].map((s) => s.id).filter(Boolean),
  ),
  (v) => ["top", "projets", "dependances", "contact", "statistiques"].every((x) => v.includes(x)),
);
dire(
  "images chargées",
  await p.evaluate(() => {
    const i = [...document.querySelectorAll("img[data-apercu-img]")];
    return `${i.filter((x) => x.complete && x.naturalWidth > 0).length}/${i.length}`;
  }),
  (v) => v.split("/")[0] === v.split("/")[1] && Number(v.split("/")[1]) > 100,
);

console.log("\n— Carte des dépendances —");
await p.evaluate(() => document.getElementById("dependances")?.scrollIntoView({ block: "center" }));
await p.waitForTimeout(900);
dire("liens listés", await p.locator("#dependances li button").count(), 10);
// Amener le bouton en vue AVANT de le survoler : un survol qui provoque lui-même
// un défilement fait passer le curseur à côté, et la section paraît morte alors
// qu'elle fonctionne.
const cible = p.locator("#dependances li button").nth(4);
await cible.scrollIntoViewIfNeeded();
await p.waitForTimeout(300);
await cible.hover();
await p.waitForTimeout(700);
dire(
  "survol : citation affichée",
  await p.evaluate(() => (document.querySelector("#dependances blockquote")?.textContent || "").length),
  (v) => v > 40,
);
dire(
  "survol : une seule arête vive",
  await p.evaluate(() => document.querySelectorAll("#dependances path[stroke-width='2.4']").length),
  1,
);
dire(
  "survol : le chapitre source est lié",
  await p.evaluate(() => document.querySelector("#dependances figcaption a")?.getAttribute("href") || ""),
  (v) => /^\/projets\/[a-z-]+\/[a-z-]+$/.test(v),
);
await p.mouse.move(5, 5);
await p.waitForTimeout(600);
dire(
  "au repos : la note revient",
  await p.evaluate(() => (document.querySelector("#dependances [data-citation-hote] p")?.textContent || "").slice(0, 7)),
  "EcoLeaf",
);

console.log("\n— Dossiers —");
await p.evaluate(() => document.getElementById("projets")?.scrollIntoView());
await p.waitForTimeout(700);
await p.locator('#projets article a[href="/projets/ecoleaf"]').first().click();
await p.waitForTimeout(1200);
const route = () => p.evaluate(() => document.documentElement.dataset.apercuCourant);
dire("clic sur une carte", await route(), "/projets/ecoleaf/vue-densemble");
const dansPage = (sel) => `[data-apercu-route="/projets/ecoleaf/vue-densemble"] ${sel}`;
dire("onglets de chapitres", await p.locator(dansPage("nav[aria-label='Chapitres du dossier'] a")).count(), 5);
await p.keyboard.press("ArrowRight");
await p.waitForTimeout(800);
dire("flèche droite", await route(), "/projets/ecoleaf/probleme");
await p.keyboard.press("ArrowLeft");
await p.waitForTimeout(800);
dire("flèche gauche", await route(), "/projets/ecoleaf/vue-densemble");

console.log("\n— Galerie d'écrans —");
await p.evaluate(() =>
  document.querySelector('[data-apercu-route="/projets/ecoleaf/vue-densemble"] #titre-ecrans')?.scrollIntoView(),
);
await p.waitForTimeout(1200);
const vignettes = p.locator(dansPage('button[data-curseur="Agrandir"]'));
dire("vignettes du dossier", await vignettes.count(), 4);
await vignettes.nth(1).click();
await p.waitForTimeout(800);
const dialogue = () =>
  p.evaluate(() => {
    const d = [...document.querySelectorAll('[role="dialog"]')].find((x) => x.style.display === "grid");
    return d ? (d.querySelector("figcaption")?.textContent || "").trim() : null;
  });
dire("agrandissement ouvert", await dialogue(), "Les tutoriels pas à pas");
await p.keyboard.press("ArrowRight");
await p.waitForTimeout(700);
dire("flèche dans le dialogue", await dialogue(), "L'offre pour les établissements scolaires");
dire("le chapitre n'a pas bougé", await route(), "/projets/ecoleaf/vue-densemble");
await p.keyboard.press("Escape");
await p.waitForTimeout(600);
dire("Échap ferme", await dialogue(), null);
dire("défilement rendu", await p.evaluate(() => document.body.style.overflow), "");

console.log("\n— Reste de la navigation —");
await p.locator(dansPage('a[href="/projets"]')).first().click();
await p.waitForTimeout(1000);
dire("index des projets", await route(), "/projets");
dire("dossiers listés", await p.locator('[data-apercu-route="/projets"] main a[href^="/projets/"]').count(), (v) => v >= 7);
await p.evaluate(() => {
  const a = [...document.querySelectorAll('[data-apercu-route="/projets"] a[href="/"]')][0];
  if (a) a.click();
  else document.querySelector('header a[href="#top"]')?.click();
});
await p.waitForTimeout(1000);
dire("retour à l'accueil", await route(), "/");
await p.evaluate(() => document.querySelector('a[href="/faq"]')?.click());
await p.waitForTimeout(1000);
dire("page FAQ", await route(), "/faq");

console.log("\n— Mise en page —");
for (const w of [1440, 1280, 1024, 768, 390]) {
  await p.setViewportSize({ width: w, height: 900 });
  await p.waitForTimeout(500);
  dire(
    `débordement horizontal à ${w}px`,
    await p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - innerWidth)),
    0,
  );
}

dire(
  "aucun passage à compléter publié",
  await p.evaluate(() => (document.body.innerText.match(/À COMPLÉTER/gi) || []).length),
  0,
);
dire("erreurs console", erreurs.length ? erreurs.slice(0, 3) : "aucune", (v) => v === "aucune");

await b.close();

console.log(
  echecs.length
    ? `\n${echecs.length} échec(s) :\n` + echecs.map((e) => "  · " + e).join("\n")
    : "\nRecette passée.",
);
if (echecs.length) process.exitCode = 1;

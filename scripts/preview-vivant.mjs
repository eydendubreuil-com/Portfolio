/**
 * Aperçu VIVANT du site, en un seul fichier.
 *
 * L'aperçu précédent était une photographie : les scripts étaient retirés et les
 * canvas convertis en images, donc rien ne pouvait bouger. Ici on garde le HTML
 * et le CSS réellement produits par le site — donc le vrai contenu, la vraie
 * mise en page — et on réinjecte les effets en JavaScript autonome, sans Next
 * ni React, puisque l'artifact ne peut pas exécuter de serveur.
 *
 * Ce qui reste figé, et pourquoi : le ruban et les étoiles sont des canvas
 * décoratifs propres à leur section ; les rasteriser coûte une image et ne
 * change rien à ce qu'on veut démontrer. Tout ce qui réagit au curseur, lui,
 * est réimplémenté et tourne.
 */
import pw from "/opt/node22/lib/node_modules/playwright/index.js";
const { chromium } = pw;
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ORIGIN = "http://localhost:8942";
const ROOT = "/home/user/Portfolio";
const OUT = "/home/user/Portfolio/preview.html";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const cssHrefs = [];
page.on("response", (r) => r.url().endsWith(".css") && cssHrefs.push(r.url()));

await page.goto(ORIGIN, { waitUntil: "networkidle" });
await page.waitForTimeout(2600);

// Défilement complet : déclenche les <Reveal/>, les compteurs et le rail du
// parcours. Sans ça, tout ce qui attend l'entrée en vue resterait à opacité 0.
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 360) {
    scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 220));
  }
  scrollTo(0, document.body.scrollHeight);
  await new Promise((r) => setTimeout(r, 900));
  scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 1500));
});

let css = "";
for (const href of [...new Set(cssHrefs)]) {
  css += (await (await page.request.get(href)).text()) + "\n";
}
css = css.replace(/url\(\s*\/_next\/static\/media\/([^)"']+?)\s*\)/g, (m, file) => {
  const p = join(ROOT, ".next/static/media", file);
  return existsSync(p) ? `url(data:font/woff2;base64,${readFileSync(p).toString("base64")})` : m;
});
const fontVars = [...css.matchAll(/\.__variable_[a-z0-9]+\{([^}]*)\}/g)].map((m) => m[1]).join(";");

// Images de projets -> data URI
const imgMap = {};
for (const name of ["synthesia", "ecoleaf", "mindset", "cosmos", "eyden-designs", "auteur-edition"]) {
  const p = join(ROOT, "public/projets", `${name}.webp`);
  if (existsSync(p)) imgMap[`/projets/${name}.webp`] = `data:image/webp;base64,${readFileSync(p).toString("base64")}`;
}
await page.evaluate((map) => {
  document.querySelectorAll("img").forEach((img) => {
    const m = img.currentSrc || img.src || "";
    const hit = Object.keys(map).find((k) => decodeURIComponent(m).includes(k));
    if (hit) {
      img.removeAttribute("srcset");
      img.setAttribute("src", map[hit]);
      img.setAttribute("loading", "eager");
    }
  });
}, imgMap);

// Le ruban et les étoiles : figés en image. La grille d'onde, elle, est
// reconstruite en direct — on retire donc son canvas ici.
await page.evaluate(() => {
  document.querySelectorAll("canvas").forEach((c) => {
    const dansGrille = c.closest("[data-grille-vivante]") ||
      (c.parentElement && getComputedStyle(c.parentElement.parentElement || c).zIndex === "-10");
    // Le cerveau est la pièce du hero : le figer en image, c'est exactement le
    // reproche fait à l'ancien aperçu. On garde son enveloppe, vidée.
    if (dansGrille || c.closest("[data-cerveau]")) { c.remove(); return; }
    let url;
    try { url = c.toDataURL("image/png"); } catch { return; }
    const img = document.createElement("img");
    img.src = url; img.setAttribute("aria-hidden", "true");
    img.className = c.className;
    img.style.cssText = c.getAttribute("style") || "";
    img.style.width = "100%"; img.style.height = "100%"; img.style.display = "block";
    c.replaceWith(img);
  });

  // Scripts de Next : inutiles sans serveur, et ils tenteraient de reprendre la
  // main sur un DOM qu'ils n'ont pas produit.
  document.querySelectorAll("script, link[rel='icon']").forEach((n) => n.remove());

  // La pastille du curseur rendue par React est sérialisée dans le HTML mais
  // n'est plus pilotée par personne : elle resterait figée dans un coin. On la
  // retire, notre script en crée une vivante.
  [...document.querySelectorAll("div[aria-hidden]")]
    .filter((d) => getComputedStyle(d).position === "fixed" && getComputedStyle(d).zIndex === "70")
    .forEach((d) => d.remove());

  // La couche de grille garde son enveloppe, vidée : notre script la remplira.
  const couche = [...document.querySelectorAll("div[aria-hidden]")].find(
    (d) => getComputedStyle(d).position === "fixed" && getComputedStyle(d).zIndex === "-10");
  if (couche) { couche.innerHTML = ""; couche.setAttribute("data-grille", ""); }

  // Motion peut laisser des éléments à mi-animation. On les amène à leur état
  // final ici — mais on les MARQUE, pour que le script puisse les remettre à
  // zéro et rejouer la révélation au défilement. Aplatir sans marquer, c'était
  // supprimer l'animation au lieu de la conserver.
  document.querySelectorAll("[style*='opacity']").forEach((el) => {
    if (el.style.opacity && Number(el.style.opacity) < 1) {
      el.style.opacity = "1";
      el.style.transform = "none";
    }
  });
  document.querySelectorAll('div[style*="opacity: 1"][style*="transform: none"]')
    .forEach((el) => el.setAttribute("data-reveal", ""));
  document.querySelectorAll('span[style*="transform-origin: 50% 100%"]')
    .forEach((el) => el.setAttribute("data-mot", ""));
});

const bodyHtml = await page.evaluate(() => document.body.innerHTML);

// L'aperçu est un fichier unique : `/faq` n'y existe pas, et le bouton « Lire
// la suite » y mènerait à une page blanche. On capture donc aussi la FAQ et on
// la garde en réserve dans le même document.
await page.goto(`${ORIGIN}/faq`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 400) {
    scrollTo(0, y); await new Promise((r) => setTimeout(r, 120));
  }
  scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 600));
  document.querySelectorAll("[style*='opacity']").forEach((el) => {
    if (el.style.opacity && Number(el.style.opacity) < 1) {
      el.style.opacity = "1";
      el.style.transform = "none";
    }
  });
  document.querySelectorAll("script").forEach((n) => n.remove());
});
const faqHtml = await page.evaluate(() => document.querySelector("main")?.outerHTML ?? "");

await browser.close();

// Cœur du cerveau, injecté TEL QUEL depuis `src/lib/brain-core.js`.
// Ce fichier est en JavaScript pur précisément pour ça : la version précédente
// retirait les annotations TypeScript à la volée par expressions régulières, et
// a produit trois erreurs de syntaxe successives — chacune donnant une page qui
// s'affiche et où rien ne bouge. Aucune transformation, aucune dérive possible.
const brainCorps = readFileSync(join(ROOT, "src/lib/brain-core.js"), "utf8")
  .replace(/^export function createBrain/m, "function createBrain");

const script = `
(() => {
  "use strict";
  const reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fin = matchMedia("(pointer: fine)").matches;
  const lire = (n, d) => (getComputedStyle(document.documentElement).getPropertyValue(n).trim() || d);
  const hex = (h) => { const s = h.replace("#","").trim();
    return s.length === 3 ? [...s].map(c => parseInt(c+c,16)) : [0,2,4].map(i => parseInt(s.slice(i,i+2),16)); };

  /* ---------- Grille d'onde révélée par la souris ---------- */
  (() => {
    const hote = document.querySelector("[data-grille]");
    if (!hote) return;
    const cv = document.createElement("canvas");
    cv.setAttribute("aria-hidden","true");
    cv.style.cssText = "position:absolute;inset:0;display:block;width:100%;height:100%;opacity:.9";
    hote.appendChild(cv);
    const ctx = cv.getContext("2d");
    const BASE = hex(lire("--wave-base","#243154")), HAUT = hex(lire("--wave-high","#5b8cff"));
    const CELL = 34, PAL = 10, GLOW = 420, REPOS = .1;
    let w=0,h=0,cols=0,rows=0,hx,hy,lv,mx=0,my=0,vx=0,vy=0,dedans=0,cible=0;
    const dim = () => {
      const d = Math.min(devicePixelRatio||1,1.5);
      w = innerWidth; h = innerHeight;
      cv.width = Math.round(w*d); cv.height = Math.round(h*d);
      ctx.setTransform(d,0,0,d,0,0);
      cols = Math.ceil(w/CELL)+2; rows = Math.ceil(h/CELL)+2;
      const n = cols*rows;
      hx = new Float32Array(n); hy = new Float32Array(n); lv = new Float32Array(n);
      mx = w/2; my = h/2; vx = mx; vy = my;
    };
    dim(); addEventListener("resize", dim);
    if (fin && !reduit) {
      addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; cible = 1; }, {passive:true});
      document.addEventListener("pointerleave", () => { cible = 0; });
    }
    const uniforme = (!fin || reduit) ? .55 : 0;
    const ch = [];
    const dessine = (t) => {
      ctx.clearRect(0,0,w,h);
      vx += (mx-vx)*.1; vy += (my-vy)*.1; dedans += (cible-dedans)*.06;
      const T = t*.00042;
      for (let j=0;j<rows;j++) for (let i=0;i<cols;i++) {
        const k=j*cols+i, px=i*CELL-CELL, py=j*CELL-CELL, u=px*.006, v=py*.006;
        const onde = .5*Math.sin(u*1.6+T) + .32*Math.sin(v*1.25-T*.8) + .24*Math.sin((u+v)*1.05+T*1.35);
        const dx=px-vx, dy=py-vy, d2=dx*dx+dy*dy;
        const bosse = d2 < 260*260 ? Math.exp(-d2/(2*(260/2.2)**2))*dedans : 0;
        const halo  = d2 < GLOW*GLOW ? Math.exp(-d2/(2*(GLOW/2.4)**2))*dedans : 0;
        const elev = onde + bosse*1.9, amp = 5 + bosse*16;
        hx[k] = px + Math.sin(v*2.1+T*.9)*amp*.45 + dx*bosse*-.16;
        hy[k] = py + elev*amp + dy*bosse*-.16;
        const rev = uniforme || REPOS + (1-REPOS)*halo;
        lv[k] = Math.min(1,Math.max(0, elev*.42+.34+bosse*.75)) * rev;
      }
      for (let k=0;k<PAL;k++) ch[k] = new Path2D();
      const push = (a,b) => { const k = Math.min(PAL-1,Math.max(0,Math.round(((lv[a]+lv[b])/2)*(PAL-1))));
        ch[k].moveTo(hx[a],hy[a]); ch[k].lineTo(hx[b],hy[b]); };
      for (let j=0;j<rows;j++) for (let i=0;i<cols;i++) {
        const k=j*cols+i;
        if (i<cols-1) push(k,k+1);
        if (j<rows-1) push(k,k+cols);
      }
      for (let k=0;k<PAL;k++) {
        const f = k/(PAL-1);
        const c = BASE.map((b,i)=>Math.round(b+(HAUT[i]-b)*f));
        ctx.strokeStyle = "rgba("+c[0]+","+c[1]+","+c[2]+","+(.035+.86*f**1.5).toFixed(3)+")";
        ctx.lineWidth = .5+f*.8;
        ctx.stroke(ch[k]);
      }
    };
    if (reduit) dessine(0);
    else { let raf; const b = (t) => { dessine(t); raf = requestAnimationFrame(b); }; raf = requestAnimationFrame(b);
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(b);
      }); }
  })();

  /* ---------- Boutons magnétiques ---------- */
  if (fin && !reduit) document.querySelectorAll("#top a[href='#projets'], #top a[href='#contact'], form button[type=submit]").forEach((btn) => {
    let tx=0,ty=0,cx=0,cy=0,raf=0,run=false;
    btn.style.display = btn.style.display || "inline-flex";
    btn.style.willChange = "transform";
    const tick = () => {
      cx += (tx-cx)*.16; cy += (ty-cy)*.16;
      btn.style.transform = "translate("+cx.toFixed(2)+"px,"+cy.toFixed(2)+"px)";
      if (Math.abs(tx-cx)<.05 && Math.abs(tx)<.05) { run=false; btn.style.transform=""; return; }
      raf = requestAnimationFrame(tick);
    };
    addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX-(r.left+r.width/2), dy = e.clientY-(r.top+r.height/2);
      const dist = Math.hypot(dx,dy);
      if (dist > 170) { tx=0; ty=0; }
      else { const f = 1-dist/170; tx = Math.max(-12,Math.min(12,dx*.32*f)); ty = Math.max(-12,Math.min(12,dy*.32*f)); }
      if (!run) { run = true; raf = requestAnimationFrame(tick); }
    }, {passive:true});
  });

  /* ---------- Bandeau défilant ---------- */
  (() => {
    const piste = document.querySelector("#competences .w-max");
    if (!piste || reduit) return;
    let x=0, largeur=piste.scrollWidth/2, dernier=null, run=false, raf=0;
    const tick = (t) => { if(!run) return;
      if (dernier===null) dernier=t;
      const dt = Math.min(48,t-dernier); dernier=t;
      x -= dt/1000*42; if (largeur && x <= -largeur) x += largeur;
      piste.style.transform = "translateX("+x.toFixed(2)+"px)";
      raf = requestAnimationFrame(tick); };
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !run) { run=true; dernier=null; raf=requestAnimationFrame(tick); }
      else if (!e.isIntersecting && run) { run=false; cancelAnimationFrame(raf); }
    },{threshold:0}).observe(piste.parentElement);
    new ResizeObserver(() => { largeur = piste.scrollWidth/2; }).observe(piste);
  })();

  /* ---------- Parallaxe ---------- */
  if (fin && !reduit) (() => {
    const hote = document.querySelector("#statistiques .pointer-events-none.absolute.inset-0");
    if (!hote) return;
    const plans = [...hote.children]; const prof = [12,28,48];
    let tx=0,ty=0,cx=0,cy=0,raf=0,run=false,vu=false;
    const tick = () => { cx += (tx-cx)*.09; cy += (ty-cy)*.09;
      plans.forEach((el,i) => { const d = prof[i] ?? 48;
        el.style.transform = "translate("+(-cx*d).toFixed(2)+"px,"+(-cy*d*.5).toFixed(2)+"px)"; });
      if (Math.abs(tx-cx)<.001 && Math.abs(ty-cy)<.001) { run=false; return; }
      raf = requestAnimationFrame(tick); };
    new IntersectionObserver(([e]) => { vu = e.isIntersecting; },{threshold:0}).observe(hote);
    addEventListener("pointermove", (e) => { if(!vu) return;
      const r = hote.getBoundingClientRect();
      tx = ((e.clientX-r.left)/r.width)*2-1; ty = ((e.clientY-r.top)/r.height)*2-1;
      if (!run) { run=true; raf=requestAnimationFrame(tick); } }, {passive:true});
  })();

  /* ---------- Curseur contextuel ---------- */
  if (fin && !reduit && innerWidth >= 1024) (() => {
    const dot = document.createElement("div");
    dot.setAttribute("aria-hidden","true");
    dot.style.cssText = "position:fixed;left:0;top:0;z-index:70;pointer-events:none;display:grid;"
      + "place-items:center;border-radius:999px;opacity:0;will-change:transform;background:"
      + lire("--color-primary","#5b8cff");
    const mot = document.createElement("span");
    mot.style.cssText = "font-family:var(--font-jetbrains),monospace;font-size:.6rem;letter-spacing:.12em;"
      + "text-transform:uppercase;white-space:nowrap;color:"+lire("--color-bg","#0b1224");
    dot.appendChild(mot); document.body.appendChild(dot);
    let x=innerWidth/2,y=innerHeight/2,cx=x,cy=y,taille=0,cT=0;
    const tick = () => { cx+=(x-cx)*.2; cy+=(y-cy)*.2; cT+=(taille-cT)*.18;
      dot.style.width = dot.style.height = cT.toFixed(1)+"px";
      dot.style.transform = "translate("+(cx-cT/2).toFixed(1)+"px,"+(cy-cT/2).toFixed(1)+"px)";
      dot.style.opacity = Math.min(1,Math.max(0,(cT-2)/12)).toFixed(3);
      requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    addEventListener("pointermove", (e) => { x=e.clientX; y=e.clientY;
      const c = e.target?.closest?.("[data-curseur]");
      if (c) { taille=66; mot.textContent = c.getAttribute("data-curseur"); c.classList.add("curseur-cache"); }
      else { taille=0; mot.textContent=""; document.querySelectorAll(".curseur-cache").forEach(el=>el.classList.remove("curseur-cache")); }
    }, {passive:true});
    document.addEventListener("pointerleave", () => { taille=0; });
  })();

  /* ---------- Barre de navigation : halo + onglet actif ---------- */
  (() => {
    const nav = document.querySelector(".spotlight-nav");
    if (!nav) return;
    const liens = [...nav.querySelectorAll("a[data-index]")];
    const halo = nav.querySelector(":scope > div");
    const barre = nav.querySelectorAll(":scope > div")[1];
    if (fin && !reduit) {
      nav.addEventListener("pointermove", (e) => {
        const r = nav.getBoundingClientRect();
        nav.style.setProperty("--spotlight-x", (e.clientX-r.left)+"px");
        if (halo) halo.style.opacity = "1";
      }, {passive:true});
      nav.addEventListener("pointerleave", () => { if (halo) halo.style.opacity = "0"; });
    }
    const cibles = liens.map(a => document.querySelector(a.getAttribute("href")));
    const maj = () => {
      const ligne = scrollY + parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop||"96") + 1;
      let actif = -1;
      cibles.forEach((el,i) => { if (el && el.getBoundingClientRect().top+scrollY <= ligne) actif = i; });
      liens.forEach((a,i) => {
        a.style.color = i === actif ? lire("--color-ink","#f4f6fb") : "";
        if (i === actif) a.setAttribute("aria-current","true"); else a.removeAttribute("aria-current");
      });
      if (barre) {
        if (actif < 0) barre.style.opacity = "0";
        else { const r = nav.getBoundingClientRect(), ir = liens[actif].getBoundingClientRect();
          nav.style.setProperty("--ambience-x", (ir.left-r.left+ir.width/2)+"px");
          barre.style.opacity = "1"; }
      }
    };
    addEventListener("scroll", maj, {passive:true}); addEventListener("resize", maj); maj();
  })();

  /* ---------- Révélation de texte par masque ---------- */
  (() => {
    if (reduit) return;
    const mots = [...document.querySelectorAll("[data-mot]")];
    if (!mots.length) return;
    // Un groupe par bloc de texte : la cascade doit se rejouer phrase par
    // phrase, pas mot par mot à l'échelle de la page.
    const groupes = new Map();
    mots.forEach((sp) => {
      const cle = sp.closest("p, h1, h2, h3, h4, li, blockquote") || sp.parentElement;
      if (!groupes.has(cle)) groupes.set(cle, []);
      groupes.get(cle).push(sp);
    });
    const CACHE = "perspective(620px) translateY(115%) rotateX(-78deg)";
    const VU = "perspective(620px)";
    const io = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        if (!e.isIntersecting) return;
        const liste = groupes.get(e.target) || [];
        // Pas plafonné : au-delà, une réponse de 200 mots demanderait quarante
        // secondes avant d'être lisible.
        const pas = Math.min(55, 700 / Math.max(1, liste.length));
        liste.forEach((sp, i) => {
          sp.style.transition = "transform 620ms cubic-bezier(.16,1,.3,1) " + Math.round(i * pas) + "ms";
          sp.style.transform = VU;
        });
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    groupes.forEach((liste, cle) => {
      liste.forEach((sp) => { sp.style.transition = "none"; sp.style.transform = CACHE; });
      io.observe(cle);
    });
  })();

  /* ---------- Révélation des blocs au défilement ---------- */
  (() => {
    if (reduit) return;
    const blocs = [...document.querySelectorAll("[data-reveal]")];
    if (!blocs.length) return;
    const io = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.style.transition = "opacity 520ms cubic-bezier(.16,1,.3,1), transform 520ms cubic-bezier(.16,1,.3,1)";
        e.target.style.opacity = "1";
        e.target.style.transform = "none";
        io.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    blocs.forEach((el) => {
      el.style.transition = "none";
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      io.observe(el);
    });
  })();

  /* ---------- Cerveau 3D du hero ---------- */
__CERVEAU__
  (() => {
    const host = document.querySelector("[data-cerveau]");
    if (!host || typeof createBrain !== "function") return;
    const canvas = document.createElement("canvas");
    canvas.className = "block h-full w-full";
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const brain = createBrain(ctx, {
      rampe: [hex(lire("--color-secondary","#6e56cf")), hex(lire("--color-primary","#5b8cff")), hex(lire("--color-accent","#2ed3f6"))],
      reduced: reduit,
      finePointer: fin,
    });

    const dim = () => {
      const d = Math.min(devicePixelRatio || 1, 1.5);
      const w = host.clientWidth, h = host.clientHeight;
      canvas.width = Math.round(w*d); canvas.height = Math.round(h*d);
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(d,0,0,d,0,0);
      brain.resize(w, h);
    };
    dim(); addEventListener("resize", dim);

    if (fin && !reduit) addEventListener("pointermove", (e) => {
      const r = host.getBoundingClientRect();
      brain.aim(((e.clientX-r.left)/r.width-.5)*1.1, ((e.clientY-r.top)/r.height-.5)*.7);
    }, { passive: true });

    let raf = 0, running = false;
    const loop = (t) => { if (!running) return; brain.draw(t); raf = requestAnimationFrame(loop); };
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running && !reduit) { running = true; raf = requestAnimationFrame(loop); }
      else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    }, { threshold: 0 }).observe(host);
    if (reduit) brain.draw(0);
  })();

  /* ---------- Bascule vers la FAQ (aperçu en un seul fichier) ---------- */
  (() => {
    const reserve = document.getElementById("apercu-faq");
    const accueil = document.querySelector("body > main");
    if (!reserve || !accueil) return;
    const faq = reserve.firstElementChild;
    if (!faq) return;
    faq.hidden = true;
    accueil.parentNode.insertBefore(faq, accueil.nextSibling);
    reserve.remove();

    const montrer = (versFaq) => {
      accueil.hidden = versFaq;
      faq.hidden = !versFaq;
      scrollTo(0, 0);
    };
    document.addEventListener("click", (e) => {
      const a = e.target?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href");
      if (href === "/faq" || href.startsWith("/faq#")) {
        e.preventDefault();
        montrer(true);
        const id = href.split("#")[1];
        if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
        return;
      }
      // Depuis la FAQ, tout lien vers l'accueil ramène l'accueil.
      if (!faq.hidden && (href === "/" || href.startsWith("/#"))) {
        e.preventDefault();
        montrer(false);
        const id = href.split("#")[1];
        if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
      }
    });
  })();

  /* ---------- Filtres de projets ---------- */
  (() => {
    const boutons = [...document.querySelectorAll("#projets button")];
    const cartes = [...document.querySelectorAll("#projets article")];
    if (!boutons.length || !cartes.length) return;
    boutons.forEach((b) => b.addEventListener("click", () => {
      const f = b.textContent.trim().toLowerCase();
      boutons.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
      cartes.forEach((c) => {
        const t = c.textContent.toLowerCase();
        const montre = f.startsWith("tous") || t.includes(f.split(" ")[0]);
        c.style.display = montre ? "" : "none";
      });
    }));
  })();
})();
`;

const out = `<title>Eyden — Portfolio (aperçu vivant)</title>
<style>
${css}
:root { ${fontVars} }
/* Le fond n'est posé QUE sur html.
   La grille vit dans une couche en "z-index: -10", enfant de body. Un enfant à
   z-index négatif remonte jusqu'au contexte d'empilement le plus proche — la
   racine — et se peint donc AU-DESSUS du fond de html, mais SOUS le fond de
   body. Tant que body n'a pas de fond à lui, le sien est propagé au canevas
   racine et body reste transparent : la grille passe. Dès qu'on donne un fond
   à html ET à body, la propagation n'a plus lieu, body peint le sien, et la
   grille disparaît derrière — c'est exactement ce qui se produisait ici. */
:root, :root[data-theme="dark"], :root[data-theme="light"] { color-scheme: dark; background: #0b1224; }
body { background: transparent; color:#f4f6fb; font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif; }
</style>
${bodyHtml}
<div id="apercu-faq" hidden>${faqHtml}</div>
<script>${script}<\/script>
`;

const final = out.replace("__CERVEAU__", brainCorps);

// Le script embarqué est vérifié AVANT écriture. Une erreur de syntaxe y est
// silencieuse à l'exécution — la page s'affiche, rien ne bouge, et c'est
// exactement le symptôme qu'on cherche à ne plus produire.
const dedans = final.slice(final.lastIndexOf("<script>") + 8, final.lastIndexOf("<" + "/script>"));
try {
  new Function(dedans);
} catch (e) {
  throw new Error("Script de l'aperçu invalide : " + e.message);
}

writeFileSync(OUT, final);
console.log("écrit :", (out.length / 1024 | 0) + " Ko | images :", Object.keys(imgMap).length);

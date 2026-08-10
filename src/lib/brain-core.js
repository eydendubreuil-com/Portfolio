/**
 * Cœur du cerveau 3D : géométrie et rendu, en JavaScript pur.
 *
 * Ce fichier n'est PAS en TypeScript, et c'est délibéré. Il sert deux
 * consommateurs : le composant React du site, et le générateur d'aperçu qui
 * l'injecte tel quel dans une page autonome. Tant qu'il portait des annotations
 * de type, l'aperçu devait les retirer à la volée — trois erreurs de syntaxe
 * silencieuses en ont découlé, chacune donnant une page où « rien ne bouge ».
 * Ici, aucune transformation : le même code tourne des deux côtés.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ rampe: number[][], reduced: boolean, finePointer: boolean }} opts
 * @returns {{ draw: (t: number) => void, resize: (w: number, h: number) => void, aim: (yaw: number, pitch: number) => void }}
 */
export function createBrain(ctx, opts) {
  const { rampe: RAMPE, reduced, finePointer } = opts;

  const teinte = (t) => {
    const x = Math.min(0.999, Math.max(0, t)) * (RAMPE.length - 1);
    const i = Math.floor(x);
    const f = x - i;
    const a = RAMPE[i];
    const b = RAMPE[i + 1] ?? RAMPE[i];
    return [
      Math.round(a[0] + (b[0] - a[0]) * f),
      Math.round(a[1] + (b[1] - a[1]) * f),
      Math.round(a[2] + (b[2] - a[2]) * f),
    ];
  };

  let w = 0;
  let h = 0;
  let targetYaw = 0;
  let targetPitch = 0;
  let yaw = 0;
  let pitch = 0;

  // ---------------------------------------------------------------- géométrie
  const pts = [];
  
  /**
   * Silhouette de cerveau vue de profil, en coordonnées normalisées.
   * x : arrière (-1) vers avant (+1). y : bas vers haut.
   *
   * Un ellipsoïde ne donne jamais un cerveau — il donne une patate. Ce qui
   * rend la forme reconnaissable, c'est le contour : front bombé à l'avant,
   * sommet haut et légèrement reculé, occiput qui redescend d'un coup, et le
   * plat sous les lobes temporaux.
   */
  const PROFIL = [
    [0.92, 0.10], [0.90, 0.34], [0.78, 0.56], [0.58, 0.72],
    [0.30, 0.82], [0.00, 0.84], [-0.30, 0.78], [-0.58, 0.62],
    [-0.80, 0.36], [-0.88, 0.06], [-0.82, -0.20], [-0.60, -0.34],
    [-0.30, -0.42], [0.02, -0.46], [0.34, -0.44], [0.62, -0.34],
    [0.84, -0.14],
  ];
  
  const dansProfil = (x, y) => {
    let dedans = false;
    for (let i = 0, j = PROFIL.length - 1; i < PROFIL.length; j = i++) {
      const [xi, yi] = PROFIL[i];
      const [xj, yj] = PROFIL[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) dedans = !dedans;
    }
    return dedans;
  };
  
  /** Distance au bord de la silhouette, pour arrondir l'épaisseur. */
  const marge = (x, y) => {
    let d = Infinity;
    for (let i = 0, j = PROFIL.length - 1; i < PROFIL.length; j = i++) {
      const [xi, yi] = PROFIL[i];
      const [xj, yj] = PROFIL[j];
      const dx = xj - xi;
      const dy = yj - yi;
      const t = Math.max(0, Math.min(1, ((x - xi) * dx + (y - yi) * dy) / (dx * dx + dy * dy)));
      d = Math.min(d, Math.hypot(x - (xi + t * dx), y - (yi + t * dy)));
    }
    return d;
  };
  
  /**
   * Circonvolutions : le pli est ce qui distingue un cerveau d'un galet.
   * Amplitude franche (0,13) et haute fréquence, sinon la surface reste lisse
   * et la forme perd sa lecture — c'était le défaut de la première version.
   */
  const plis = (x, y, z) =>
    0.13 *
      (0.5 * Math.sin(11 * x + 5 * y) +
        0.4 * Math.sin(9 * y - 7 * z) +
        0.35 * Math.sin(10 * z + 6 * x)) +
    0.05 * Math.sin(19 * (x + y + z));
  
  // Cortex : points tirés dans la silhouette, poussés en surface de part et
  // d'autre du plan médian. `u` sert à la couleur (avant -> arrière).
  let essais = 0;
  while (pts.length < 1000 && essais < 40000) {
    essais++;
    const x = -0.95 + Math.random() * 1.95;
    const y = -0.5 + Math.random() * 1.4;
    if (!dansProfil(x, y)) continue;
    const m = marge(x, y);
    if (m < 0.02) continue;
    // Épaisseur : maximale au centre de la silhouette, nulle au bord.
    const demi = 0.66 * Math.sqrt(Math.min(1, m / 0.42));
    const cote = Math.random() < 0.5 ? -1 : 1;
    // La scissure longitudinale : on écarte les deux hémisphères du plan
    // médian, sinon ils se soudent en une seule masse.
    const z = cote * (0.1 + demi * (0.55 + 0.45 * Math.random()));
    const g = 1 + plis(x, y, z);
    pts.push({ x: x * g, y: y * g, z: z * g, u: (x + 1) / 2 });
  }
  
  // Cervelet : masse distincte, en bas à l'arrière, plis plus serrés.
  for (let i = 0; i < 170; i++) {
    const a = Math.random() * Math.PI * 2;
    const b = Math.acos(2 * Math.random() - 1);
    const ux = Math.sin(b) * Math.cos(a);
    const uy = Math.cos(b);
    const uz = Math.sin(b) * Math.sin(a);
    const g = 1 + 0.16 * Math.sin(17 * ux + 13 * uy) + 0.1 * Math.sin(15 * uz);
    pts.push({
      x: -0.62 + ux * 0.30 * g,
      y: -0.46 + uy * 0.20 * g,
      z: uz * 0.34 * g,
      u: 0.08,
    });
  }
  
  // Tronc cérébral : court, droit, effilé. La première version le faisait
  // tourner en spirale, ce qui se lisait comme un fil qui pend.
  for (let i = 0; i < 90; i++) {
    const t = Math.random();
    const r = 0.15 * (1 - t * 0.4);
    const a = Math.random() * Math.PI * 2;
    pts.push({
      x: -0.34 + t * 0.1 + Math.cos(a) * r,
      y: -0.44 - t * 0.5,
      z: Math.sin(a) * r,
      u: 0.02,
    });
  }
  
  // Arêtes : voisinage court, deux par point au plus. Calculé une seule fois —
  // le refaire par image coûterait O(n²) soixante fois par seconde.
  const edges = [];
  const SEUIL = 0.14;
  for (let i = 0; i < pts.length; i++) {
    let poses = 0;
    for (let j = i + 1; j < pts.length && poses < 2; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const dz = pts[i].z - pts[j].z;
      if (dx * dx + dy * dy + dz * dz < SEUIL * SEUIL) {
        edges.push([i, j]);
        poses++;
      }
    }
  }
  
  // Impulsions : quelques arêtes s'allument tour à tour.
  const pulses = Array.from({ length: 16 }, () => ({
    e: Math.floor(Math.random() * Math.max(1, edges.length)),
    t: Math.random(),
    v: 0.3 + Math.random() * 0.5,
  }));

  const PALIERS = 8;
  const px = new Float32Array(pts.length);
  const py = new Float32Array(pts.length);
  const pz = new Float32Array(pts.length);
  
  const draw = (t) => {
    ctx.clearRect(0, 0, w, h);
    yaw += (targetYaw - yaw) * 0.05;
    pitch += (targetPitch - pitch) * 0.05;
  
    // Oscillation, pas rotation complète. Une révolution entière ramène le
    // cerveau de face deux fois par tour, où il n'est plus qu'une masse : la
    // silhouette de profil est la seule qui se lit. On balaie donc ±0,55 rad
    // autour de ce profil.
    const a = Math.sin(t * 0.00013) * 0.55 + yaw;
    const b = 0.18 + pitch;
    const ech = Math.min(w, h) * 0.42;
    const cx = w / 2;
    const cy = h / 2;
    const foc = 3.4;
  
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const x1 = p.x * Math.cos(a) - p.z * Math.sin(a);
      const z1 = p.x * Math.sin(a) + p.z * Math.cos(a);
      const y2 = p.y * Math.cos(b) - z1 * Math.sin(b);
      const z2 = p.y * Math.sin(b) + z1 * Math.cos(b);
      const k = foc / (foc + z2);
      px[i] = cx + x1 * ech * k;
      py[i] = cy - y2 * ech * k;
      pz[i] = z2;
    }
  
    // Arêtes, groupées par palier de profondeur : 8 tracés au lieu d'un par
    // arête. Le fond est plus sombre et plus fin, l'avant plus clair et net.
    const chemins = [];
    for (let k = 0; k < PALIERS; k++) chemins[k] = new Path2D();
    for (const [i, j] of edges) {
      const prof = (1.1 - (pz[i] + pz[j]) / 2) / 2.2;
      const u = (pts[i].u + pts[j].u) / 2;
      const mix = 0.32 * prof + 0.68 * u;
      const k = Math.min(PALIERS - 1, Math.max(0, Math.round(mix * (PALIERS - 1))));
      chemins[k].moveTo(px[i], py[i]);
      chemins[k].lineTo(px[j], py[j]);
    }
    for (let k = 0; k < PALIERS; k++) {
      const f = k / (PALIERS - 1);
      const c = teinte(f);
      ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${(0.09 + f * 0.4).toFixed(3)})`;
      ctx.lineWidth = 0.4 + f * 0.5;
      ctx.stroke(chemins[k]);
    }
  
    // Points, mêmes paliers. `fillRect` et non `arc` : à cette taille la
    // différence ne se voit pas, et un arc coûte plusieurs fois plus cher.
    // Palier = mélange de la profondeur ET de la position avant/arrière.
    // Sur la seule profondeur, tout l'objet portait la même teinte à un
    // instant donné et le dégradé ne se voyait pas.
    const sacs = Array.from({ length: PALIERS }, () => []);
    for (let i = 0; i < pts.length; i++) {
      const prof = (1.1 - pz[i]) / 2.2;
      const mix = 0.32 * prof + 0.68 * pts[i].u;
      const k = Math.min(PALIERS - 1, Math.max(0, Math.round(mix * (PALIERS - 1))));
      sacs[k].push(i);
    }
    for (let k = 0; k < PALIERS; k++) {
      const f = k / (PALIERS - 1);
      const c = teinte(f);
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${(0.3 + f * 0.65).toFixed(3)})`;
      const s = 1.1 + f * 1.7;
      for (const i of sacs[k]) ctx.fillRect(px[i] - s / 2, py[i] - s / 2, s, s);
    }
  
    // Impulsions le long des connexions.
    if (!reduced) {
      for (const p of pulses) {
        p.t += p.v * 0.012;
        if (p.t > 1) {
          p.t = 0;
          p.e = Math.floor(Math.random() * edges.length);
        }
        const [i, j] = edges[p.e] ?? edges[0];
        const x = px[i] + (px[j] - px[i]) * p.t;
        const y = py[i] + (py[j] - py[i]) * p.t;
        const prof = pz[i] + (pz[j] - pz[i]) * p.t;
        const f = Math.min(1, Math.max(0, (1.1 - prof) / 2.2));
        const c = teinte(f);
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${(0.5 + f * 0.5).toFixed(2)})`;
        const s = 1.6 + f * 1.8;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    }
  };

  return {
    draw,
    resize(nw, nh) { w = nw; h = nh; },
    aim(y, p) { targetYaw = y; targetPitch = p; },
  };
}

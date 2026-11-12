// Persistance de la méta-progression dans localStorage (navigateur uniquement ;
// hors navigateur — tests — on retombe sur la méta par défaut en mémoire).
const SAVE_KEY = "camping-car-td-meta-v1";

// Méta-progression neuve (niveau 1, 1 point de talent, carte Prairie).
export function defaultMeta() {
  return {
    xp: 0,
    level: 1,
    points: 1,
    talents: {}, // {talentId: rang}
    achievements: [], // ids des succès débloqués
    totalKills: 0,
    totalEarned: 0,
    best: {}, // {mapId: meilleure vague atteinte}
    currentMap: "prairie",
    speedIndex: 0,
  };
}

// Charge la méta sauvegardée, ou la valeur par défaut.
export function loadMeta() {
  const storage = typeof window !== "undefined" ? window.localStorage : null;
  if (!storage) return defaultMeta();
  try {
    const raw = storage.getItem(SAVE_KEY);
    return raw ? { ...defaultMeta(), ...JSON.parse(raw) } : defaultMeta();
  } catch {
    return defaultMeta();
  }
}

// Sauvegarde la méta (silencieuse si le stockage est indisponible ou plein).
export function saveMeta(meta) {
  const storage = typeof window !== "undefined" ? window.localStorage : null;
  if (!storage) return;
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(meta));
  } catch {
    // quota dépassé ou stockage privé : on ignore
  }
}

// Efface la sauvegarde et retourne une méta neuve.
export function wipeMeta() {
  const fresh = defaultMeta();
  saveMeta(fresh);
  return fresh;
}

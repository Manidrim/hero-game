// Méta-progression persistante entre les parties : XP, niveaux, talents, succès.

// Arbre de talents (dépense de points gagnés en montant de niveau).
export const TALENTS = [
  { id: "degats", emoji: "💪", name: "Dégâts", max: 3, desc: "+12% de dégâts pour tous les véhicules, par rang." },
  { id: "portee", emoji: "🎯", name: "Portée", max: 3, desc: "+10% de portée, par rang." },
  { id: "cadence", emoji: "⚡", name: "Cadence", max: 3, desc: "+10% de vitesse de tir, par rang." },
  { id: "gains", emoji: "💰", name: "Gains", max: 3, desc: "+12% d'euros gagnés (butins, primes, food trucks), par rang." },
  { id: "vies", emoji: "❤️", name: "Vies max", max: 3, desc: "+3 vies au départ de chaque partie, par rang." },
];

// Succès : `points` = points de talent offerts ; `dmgPct`/`gainsPct` = bonus
// permanents en pourcentage.
export const ACHIEVEMENTS = [
  { id: "first_blood", emoji: "🩸", name: "Premier campeur", desc: "Élimine ton premier ennemi.", points: 1 },
  { id: "cent", emoji: "💯", name: "Cent campeurs", desc: "Élimine 100 ennemis (cumul).", points: 1, dmgPct: 5 },
  { id: "mille", emoji: "🔥", name: "Massacre", desc: "Élimine 1000 ennemis (cumul).", points: 2, dmgPct: 10 },
  { id: "riche", emoji: "💎", name: "Roi du camping", desc: "Gagne 5000€ au total (cumul).", points: 1, gainsPct: 5 },
  { id: "vague10", emoji: "🌊", name: "Marée montante", desc: "Atteins la vague 10 sur une carte.", points: 1 },
  { id: "vague25", emoji: "🌪️", name: "Tempête", desc: "Atteins la vague 25 sur une carte.", points: 2 },
  { id: "vague50", emoji: "👑", name: "Légende du camping", desc: "Atteins la vague 50 sur une carte.", points: 3, dmgPct: 10 },
  { id: "boss", emoji: "🚌", name: "Gare au bus !", desc: "Élimine un boss.", points: 1, gainsPct: 5 },
  { id: "etoiles", emoji: "⭐", name: "Camping 5 étoiles", desc: "Améliore un véhicule au niveau 5.", points: 1 },
  { id: "conquerant", emoji: "🏁", name: "Conquérant", desc: "Atteins la vague 30 sur une carte.", points: 2 },
];

// XP nécessaire pour passer du niveau `level` au suivant.
export const xpForLevel = (level) => Math.round(80 * Math.pow(level, 1.55));

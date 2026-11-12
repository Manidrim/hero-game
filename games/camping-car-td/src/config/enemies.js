// Définition des ennemis (vacanciers) qui suivent le chemin.
// hp : PV de base (avant multiplicateur de vague) ; bounty : prime de base ;
// xp : XP rapportée ; leak : vies perdues s'il atteint la base ; unlock : vague
// à partir de laquelle il apparaît.
export const ENEMY_TYPES = {
  touriste: {
    emoji: "🚶", name: "Touriste", hp: 30, speed: 55,
    bounty: 8, xp: 4, leak: 1, unlock: 1,
  },
  cycliste: {
    emoji: "🚴", name: "Cycliste", hp: 22, speed: 98,
    bounty: 10, xp: 5, leak: 1, unlock: 2,
  },
  randonneur: {
    emoji: "🥾", name: "Randonneur", hp: 62, speed: 44,
    bounty: 13, xp: 6, leak: 1, unlock: 4,
  },
  vanRival: {
    emoji: "🚐", name: "Van rival", hp: 95, speed: 62,
    bounty: 17, xp: 9, leak: 2, unlock: 6,
  },
  famille: {
    emoji: "👨‍👩‍👧‍👦", name: "Famille nombreuse", hp: 150, speed: 32,
    bounty: 22, xp: 11, leak: 2, unlock: 8,
  },
  boss: {
    emoji: "🚌", name: "Bus des vacanciers", hp: 900, speed: 26,
    bounty: 160, xp: 90, leak: 5, unlock: 10, boss: true,
  },
};

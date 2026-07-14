import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import { grantWeaponXp } from "../src/domain/weapon-leveling.js";

describe("grantWeaponXp", () => {
  it("fait monter l'arme équipée de niveau et octroie un point", () => {
    const state = createState();
    grantWeaponXp(state, 30); // WEAPON_XP_BASE
    const w = state.hero.weapons.smg;
    expect(w.level).toBe(2);
    expect(w.points).toBe(1);
    expect(w.xp).toBe(0);
    expect(w.xpNext).toBe(48); // round(30 * 1.6)
  });

  it("gère plusieurs niveaux d'un coup et cumule les points", () => {
    const state = createState();
    grantWeaponXp(state, 78); // 30 (niv.2) puis 48 (niv.3)
    expect(state.hero.weapons.smg.level).toBe(3);
    expect(state.hero.weapons.smg.points).toBe(2);
  });

  it("ne crédite que l'arme équipée", () => {
    const state = createState();
    grantWeaponXp(state, 30);
    expect(state.hero.weapons.bazooka.xp).toBe(0);
    expect(state.hero.weapons.bazooka.level).toBe(1);
  });
});

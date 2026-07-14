import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import { grantWeaponLevel } from "../src/domain/weapon-level-grant.js";

describe("grantWeaponLevel", () => {
  it("dépense un point d'arme pour donner un niveau à l'arme équipée", () => {
    const state = createState();
    state.hero.weaponPoints = 1;
    const ok = grantWeaponLevel(state, "smg");
    const w = state.hero.weapons.smg;
    expect(ok).toBe(true);
    expect(state.hero.weaponPoints).toBe(0);
    expect(w.level).toBe(2);
    expect(w.points).toBe(1); // le niveau gagné octroie un point à répartir
  });

  it("ne fait rien sans point d'arme disponible", () => {
    const state = createState();
    const ok = grantWeaponLevel(state, "smg");
    expect(ok).toBe(false);
    expect(state.hero.weapons.smg.level).toBe(1);
  });

  it("refuse une arme non possédée", () => {
    const state = createState();
    state.hero.weaponPoints = 1;
    const ok = grantWeaponLevel(state, "bazooka"); // non possédée d'emblée
    expect(ok).toBe(false);
    expect(state.hero.weaponPoints).toBe(1);
    expect(state.hero.weapons.bazooka.level).toBe(1);
  });
});

import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import { buyWeapon } from "../src/domain/weapon-shop.js";

describe("buyWeapon", () => {
  it("achète une arme et débite l'or", () => {
    const state = createState();
    state.gold = 1000;
    expect(buyWeapon(state, "bazooka")).toBe(true);
    expect(state.hero.weapons.bazooka.owned).toBe(true);
    expect(state.gold).toBe(0);
  });

  it("refuse l'achat si l'or est insuffisant", () => {
    const state = createState();
    state.gold = 500;
    expect(buyWeapon(state, "bazooka")).toBe(false);
    expect(state.hero.weapons.bazooka.owned).toBe(false);
    expect(state.gold).toBe(500);
  });

  it("ne rachète pas une arme déjà possédée", () => {
    const state = createState();
    state.gold = 9999;
    expect(buyWeapon(state, "smg")).toBe(false);
    expect(state.gold).toBe(9999);
  });
});

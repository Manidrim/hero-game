import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import { grantXp } from "../src/domain/leveling.js";

describe("grantXp", () => {
  it("fait monter le héros de niveau au seuil d'XP", () => {
    const state = createState();
    grantXp(state, 10);
    const h = state.hero;
    expect(h.level).toBe(2);
    expect(h.xp).toBe(0);
    expect(h.xpNext).toBe(15);
    expect(h.maxHp).toBe(120);
    expect(h.damage).toBe(19);
    expect(h.range).toBe(96);
  });

  it("gère plusieurs montées de niveau d'un coup", () => {
    const state = createState();
    grantXp(state, 25); // 10 (niv.2) puis 15 (niv.3)
    expect(state.hero.level).toBe(3);
  });

  it("annonce le déblocage d'une arme au bon niveau", () => {
    const state = createState();
    state.hero.level = 4;
    state.hero.xpNext = 10;
    grantXp(state, 10); // passage au niveau 5 → bazooka
    const unlock = state.floaters.find((f) => f.text.includes("Bazooka"));
    expect(unlock).toBeTruthy();
  });
});

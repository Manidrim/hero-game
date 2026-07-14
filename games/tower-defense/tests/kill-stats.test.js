import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import { recordHeroKill } from "../src/domain/kill-stats.js";
import { killEnemy } from "../src/domain/enemy-damage.js";

function addEnemy(state) {
  const enemy = { x: 0, y: 0, hp: 10, reward: 5, size: 8 };
  state.enemies.push(enemy);
  return enemy;
}

describe("recordHeroKill", () => {
  it("incrémente le total du héros et le compteur de l'arme", () => {
    const state = createState();
    recordHeroKill(state, "smg");
    recordHeroKill(state, "smg");
    recordHeroKill(state, "bazooka");
    expect(state.hero.kills).toBe(3);
    expect(state.hero.weapons.smg.kills).toBe(2);
    expect(state.hero.weapons.bazooka.kills).toBe(1);
    expect(state.hero.weapons.sniper.kills).toBe(0);
  });
});

describe("killEnemy avec source", () => {
  it("attribue l'élimination au héros et à son arme", () => {
    const state = createState();
    addEnemy(state);
    killEnemy(state, 0, { type: "hero", weapon: "sniper" });
    expect(state.hero.kills).toBe(1);
    expect(state.hero.weapons.sniper.kills).toBe(1);
  });

  it("n'attribue rien au héros pour une source de tour", () => {
    const state = createState();
    addEnemy(state);
    killEnemy(state, 0, { type: "tower" });
    expect(state.hero.kills).toBe(0);
  });

  it("ne casse pas sans source (compatibilité)", () => {
    const state = createState();
    addEnemy(state);
    killEnemy(state, 0);
    expect(state.hero.kills).toBe(0);
  });
});

import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import { applyHit } from "../src/domain/bullets.js";

function enemy(x, y, hp) {
  return { x, y, hp, maxHp: hp, reward: 10, slowTimer: 0, size: 10 };
}

describe("applyHit", () => {
  it("n'endommage que la cible sans splash", () => {
    const state = createState();
    const target = enemy(100, 100, 50);
    const other = enemy(110, 100, 50);
    state.enemies.push(target, other);
    applyHit(state, { target, damage: 30, splash: 0, slow: 0 });
    expect(target.hp).toBe(20);
    expect(other.hp).toBe(50);
  });

  it("endommage tous les ennemis dans le rayon de splash", () => {
    const state = createState();
    const target = enemy(100, 100, 50);
    const near = enemy(130, 100, 50); // dans le rayon 60
    const far = enemy(300, 100, 50); // hors rayon
    state.enemies.push(target, near, far);
    applyHit(state, { target, damage: 20, splash: 60, slow: 0 });
    expect(target.hp).toBe(30);
    expect(near.hp).toBe(30);
    expect(far.hp).toBe(50);
  });

  it("tue l'ennemi et crédite l'or et l'XP", () => {
    const state = createState();
    const target = enemy(100, 100, 5);
    state.enemies.push(target);
    const goldBefore = state.gold;
    applyHit(state, { target, damage: 10, splash: 0, slow: 0 });
    expect(state.enemies).toHaveLength(0);
    expect(state.gold).toBe(goldBefore + 10);
    expect(state.hero.level).toBe(2); // 10 XP fait passer le héros au niveau 2
  });
});

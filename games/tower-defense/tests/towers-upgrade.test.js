import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import { selectType, tryBuild } from "../src/domain/towers-build.js";
import { nearbyTowers, upgradeTower } from "../src/domain/towers-upgrade.js";

function stateWithTower() {
  const state = createState();
  selectType(state, "arrow"); // coût 50
  tryBuild(state, 5, 5);
  return state;
}

describe("upgradeTower", () => {
  it("améliore la tour et débite le coût", () => {
    const state = stateWithTower();
    const id = state.towers[0].id;
    const goldBefore = state.gold;
    upgradeTower(state, id);
    expect(state.towers[0].level).toBe(2);
    expect(state.gold).toBe(goldBefore - 40); // upgradeCost niveau 1 = 40
  });

  it("ne dépasse pas le niveau maximum", () => {
    const state = stateWithTower();
    state.towers[0].level = 10;
    state.gold = 9999;
    upgradeTower(state, state.towers[0].id);
    expect(state.towers[0].level).toBe(10);
  });

  it("n'améliore pas sans or suffisant", () => {
    const state = stateWithTower();
    state.gold = 0;
    upgradeTower(state, state.towers[0].id);
    expect(state.towers[0].level).toBe(1);
  });
});

describe("nearbyTowers", () => {
  it("liste les tours à portée du héros", () => {
    const state = stateWithTower();
    state.hero.x = state.towers[0].x;
    state.hero.y = state.towers[0].y;
    expect(nearbyTowers(state)).toHaveLength(1);
  });

  it("exclut les tours trop éloignées", () => {
    const state = stateWithTower();
    state.hero.x = 0;
    state.hero.y = 0;
    expect(nearbyTowers(state)).toHaveLength(0);
  });
});

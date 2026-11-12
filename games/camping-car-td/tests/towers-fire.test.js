import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import { selectVehicle, tryPlace } from "../src/domain/vehicles-build.js";
import { spawnEnemy } from "../src/domain/enemy-factory.js";
import { updateTowers } from "../src/domain/towers-fire.js";

// Pose un véhicule juste au-dessus du chemin de la Prairie (rangée 6).
function placeNearPath(state, type, c = 0, r = 5) {
  selectVehicle(state, type);
  tryPlace(state, c, r);
  selectVehicle(state, null);
  return state.towers[state.towers.length - 1];
}

describe("tirs des véhicules", () => {
  it("tir sur l'ennemi en portée, l'élimine, rapporte prime et XP", () => {
    const state = createState();
    state.wave = 1;
    placeNearPath(state, "van");
    spawnEnemy(state, "touriste"); // 30 PV à la vague 1
    const moneyBefore = state.money;
    for (let i = 0; i < 5; i++) updateTowers(state, 1.1); // cadence 1/s, 9 dégâts
    expect(state.enemies).toHaveLength(0);
    expect(state.kills).toBe(1);
    expect(state.money).toBeGreaterThan(moneyBefore);
    expect(state.meta.totalKills).toBe(1);
    expect(state.meta.achievements).toContain("first_blood");
    expect(state.effects.some((f) => f.kind === "tracer")).toBe(true);
  });

  it("ne tire pas sans ennemi à portée", () => {
    const state = createState();
    state.wave = 1;
    placeNearPath(state, "van", 15, 0); // loin du chemin
    spawnEnemy(state, "touriste");
    updateTowers(state, 2);
    expect(state.enemies[0].hp).toBe(30);
  });
});

describe("véhicules spéciaux", () => {
  it("le bivouac ralentit les ennemis dans sa zone", () => {
    const state = createState();
    state.wave = 1;
    placeNearPath(state, "bivouac");
    spawnEnemy(state, "touriste");
    state.enemies[0].x = 24;
    state.enemies[0].y = 264; // au centre de l'aura
    updateTowers(state, 0.1);
    expect(state.enemies[0].slowFactor).toBeCloseTo(0.35);
    expect(state.enemies[0].slowTimer).toBeGreaterThan(0);
  });

  it("le food truck rapporte de l'argent en continu", () => {
    const state = createState();
    state.money = 1000; // le food truck coûte 320€
    placeNearPath(state, "foodtruck", 5, 5);
    const before = state.money;
    updateTowers(state, 2); // 3€/s
    expect(state.money).toBeCloseTo(before + 6, 5);
    expect(state.meta.totalEarned).toBeCloseTo(6, 5);
  });
});

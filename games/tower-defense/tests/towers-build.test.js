import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import { canBuildAt, tryBuild, selectType } from "../src/domain/towers-build.js";

describe("canBuildAt", () => {
  it("refuse hors de la grille", () => {
    const state = createState();
    selectType(state, "arrow");
    expect(canBuildAt(state, -1, 0)).toBe(false);
    expect(canBuildAt(state, 20, 0)).toBe(false);
  });

  it("refuse sur une case du chemin", () => {
    const state = createState();
    selectType(state, "arrow");
    expect(canBuildAt(state, 0, 2)).toBe(false); // départ du chemin
  });

  it("refuse une case déjà occupée par une tour", () => {
    const state = createState();
    selectType(state, "arrow");
    tryBuild(state, 5, 5);
    expect(canBuildAt(state, 5, 5)).toBe(false);
  });

  it("refuse sans or suffisant", () => {
    const state = createState();
    state.gold = 10;
    selectType(state, "cannon"); // coût 100
    expect(canBuildAt(state, 5, 5)).toBe(false);
  });

  it("autorise une case libre avec assez d'or", () => {
    const state = createState();
    selectType(state, "arrow");
    expect(canBuildAt(state, 5, 5)).toBe(true);
  });
});

describe("tryBuild", () => {
  it("construit la tour et débite l'or", () => {
    const state = createState();
    selectType(state, "arrow");
    tryBuild(state, 5, 5);
    expect(state.towers).toHaveLength(1);
    expect(state.gold).toBe(150);
    const t = state.towers[0];
    expect(t.level).toBe(1);
    expect(t.x).toBe(5 * 40 + 20);
  });

  it("ne construit pas sur une case invalide", () => {
    const state = createState();
    selectType(state, "arrow");
    tryBuild(state, 0, 2); // sur le chemin
    expect(state.towers).toHaveLength(0);
    expect(state.gold).toBe(200);
  });
});

describe("selectType", () => {
  it("bascule la sélection puis la désélectionne", () => {
    const state = createState();
    selectType(state, "arrow");
    expect(state.selectedType).toBe("arrow");
    selectType(state, "arrow");
    expect(state.selectedType).toBeNull();
  });
});

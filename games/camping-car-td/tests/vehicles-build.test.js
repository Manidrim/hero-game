import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import {
  canPlaceAt, tryPlace, selectVehicle, towerById,
} from "../src/domain/vehicles-build.js";

describe("canPlaceAt", () => {
  it("refuse sans véhicule sélectionné", () => {
    const state = createState();
    expect(canPlaceAt(state, 0, 0)).toBe(false);
  });

  it("refuse hors grille, sur le chemin ou sur une case occupée", () => {
    const state = createState();
    selectVehicle(state, "van");
    expect(canPlaceAt(state, -1, 0)).toBe(false);
    expect(canPlaceAt(state, 20, 0)).toBe(false);
    expect(canPlaceAt(state, 0, 6)).toBe(false); // case du chemin (Prairie)
    tryPlace(state, 5, 5);
    expect(canPlaceAt(state, 5, 5)).toBe(false);
  });

  it("refuse sans assez d'euros, autorise sinon", () => {
    const state = createState();
    state.money = 10;
    selectVehicle(state, "van"); // coût 100
    expect(canPlaceAt(state, 5, 5)).toBe(false);
    state.money = 260;
    expect(canPlaceAt(state, 5, 5)).toBe(true);
  });
});

describe("tryPlace", () => {
  it("pose le véhicule et débite les euros", () => {
    const state = createState();
    selectVehicle(state, "van");
    expect(tryPlace(state, 5, 5)).toBe(true);
    expect(state.towers).toHaveLength(1);
    expect(state.money).toBe(160);
    const t = state.towers[0];
    expect(t.level).toBe(1);
    expect(t.invested).toBe(100);
    expect(t.x).toBe(5 * 48 + 24);
  });

  it("ne pose rien sur une case invalide", () => {
    const state = createState();
    selectVehicle(state, "van");
    expect(tryPlace(state, 0, 6)).toBe(false);
    expect(state.towers).toHaveLength(0);
    expect(state.money).toBe(260);
  });
});

describe("selectVehicle / towerById", () => {
  it("bascule la sélection puis la désélectionne", () => {
    const state = createState();
    selectVehicle(state, "van");
    expect(state.placing).toBe("van");
    selectVehicle(state, "van");
    expect(state.placing).toBeNull();
  });

  it("retrouve un véhicule posé par son id", () => {
    const state = createState();
    selectVehicle(state, "van");
    tryPlace(state, 5, 5);
    const t = state.towers[0];
    expect(towerById(state, t.id)).toBe(t);
    expect(towerById(state, 999)).toBeNull();
  });
});

import { describe, it, expect } from "vitest";
import { createState } from "../src/domain/state.js";
import { selectVehicle, tryPlace } from "../src/domain/vehicles-build.js";
import { vehicleStats } from "../src/domain/vehicle-stats.js";
import {
  canUpgrade, upgradeVehicle, sellValue, sellVehicle,
} from "../src/domain/vehicles-upgrade.js";

function placeVan(state) {
  selectVehicle(state, "van");
  tryPlace(state, 5, 5);
  return state.towers[0];
}

describe("vehicleStats", () => {
  it("les dégâts et la portée montent avec le niveau", () => {
    const state = createState();
    const t = placeVan(state);
    const s1 = vehicleStats(state, t);
    expect(s1.damage).toBeCloseTo(9);
    expect(s1.range).toBeCloseTo(2.4);
    t.level = 3;
    const s3 = vehicleStats(state, t);
    expect(s3.damage).toBeCloseTo(9 * 1.4 * 1.4);
    expect(s3.range).toBeCloseTo(2.4 * 1.12);
  });

  it("les talents de la méta s'appliquent", () => {
    const state = createState();
    const t = placeVan(state);
    state.meta.talents.degats = 2;
    state.meta.talents.portee = 1;
    const s = vehicleStats(state, t);
    expect(s.damage).toBeCloseTo(9 * 1.24);
    expect(s.range).toBeCloseTo(2.4 * 1.1);
  });
});

describe("amélioration et revente", () => {
  it("améliore un véhicule et cumule l'investissement", () => {
    const state = createState();
    const t = placeVan(state); // 260 - 100 = 160€
    expect(canUpgrade(state, t)).toBe(true); // coût niv 1→2 : 80€
    expect(upgradeVehicle(state, t.id)).toBe(true);
    expect(t.level).toBe(2);
    expect(t.invested).toBe(180);
    expect(state.money).toBe(80);
  });

  it("refuse d'améliorer sans assez d'euros", () => {
    const state = createState();
    const t = placeVan(state);
    state.money = 10;
    expect(canUpgrade(state, t)).toBe(false);
    expect(upgradeVehicle(state, t.id)).toBe(false);
    expect(t.level).toBe(1);
  });

  it("revend au prorata de l'investissement et désélectionne", () => {
    const state = createState();
    const t = placeVan(state);
    upgradeVehicle(state, t.id); // investi 180
    state.selectedId = t.id;
    expect(sellValue(t)).toBe(126); // 70%
    const value = sellVehicle(state, t.id);
    expect(value).toBe(126);
    expect(state.towers).toHaveLength(0);
    expect(state.selectedId).toBeNull();
    expect(state.money).toBe(80 + 126);
  });

  it("le niveau 5 débloque le succès 'etoiles'", () => {
    const state = createState();
    state.money = 100000;
    const t = placeVan(state);
    while (canUpgrade(state, t)) upgradeVehicle(state, t.id);
    expect(t.level).toBe(5);
    expect(state.meta.achievements).toContain("etoiles");
  });
});

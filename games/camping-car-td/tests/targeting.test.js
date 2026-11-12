import { describe, it, expect } from "vitest";
import { furthestEnemy } from "../src/domain/targeting.js";

const enemy = (x, y, dist) => ({ x, y, dist });

describe("furthestEnemy", () => {
  it("choisit l'ennemi le plus avancé dans la portée", () => {
    const enemies = [enemy(10, 0, 10), enemy(20, 0, 50), enemy(30, 0, 30)];
    expect(furthestEnemy(enemies, 0, 0, 100).dist).toBe(50);
  });

  it("retourne null si personne n'est à portée", () => {
    const enemies = [enemy(200, 0, 100)];
    expect(furthestEnemy(enemies, 0, 0, 100)).toBeNull();
  });
});

import { describe, it, expect } from "vitest";
import { nearestEnemy } from "../src/domain/targeting.js";

describe("nearestEnemy", () => {
  const enemies = [
    { id: "a", x: 50, y: 0 },
    { id: "b", x: 20, y: 0 },
    { id: "c", x: 200, y: 0 },
  ];

  it("renvoie l'ennemi le plus proche dans la portée", () => {
    const hit = nearestEnemy(enemies, 0, 0, 100);
    expect(hit.enemy.id).toBe("b");
    expect(hit.dist).toBeCloseTo(20);
  });

  it("renvoie null si aucun ennemi n'est à portée", () => {
    expect(nearestEnemy(enemies, 0, 0, 10)).toBeNull();
  });

  it("renvoie null sans ennemi", () => {
    expect(nearestEnemy([], 0, 0, 100)).toBeNull();
  });
});

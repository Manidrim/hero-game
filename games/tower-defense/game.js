(() => {
  "use strict";

  // ---------------------------------------------------------------------------
  // Configuration de base
  // ---------------------------------------------------------------------------
  const TILE = 40;
  const COLS = 20;
  const ROWS = 15;
  const WIDTH = COLS * TILE;   // 800
  const HEIGHT = ROWS * TILE;  // 600

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  // Chemin suivi par les ennemis, exprimé en coordonnées de grille.
  const PATH_CELLS = [
    [0, 2], [4, 2], [4, 10], [9, 10], [9, 4], [14, 4], [14, 12], [19, 12],
  ];

  // Points de passage en pixels (centre des cases).
  const WAYPOINTS = PATH_CELLS.map(([c, r]) => ({
    x: c * TILE + TILE / 2,
    y: r * TILE + TILE / 2,
  }));

  // Ensemble des cases occupées par le chemin (non constructibles).
  const pathSet = new Set();
  for (let i = 0; i < PATH_CELLS.length - 1; i++) {
    let [c0, r0] = PATH_CELLS[i];
    const [c1, r1] = PATH_CELLS[i + 1];
    const dc = Math.sign(c1 - c0);
    const dr = Math.sign(r1 - r0);
    while (c0 !== c1 || r0 !== r1) {
      pathSet.add(c0 + "," + r0);
      c0 += dc;
      r0 += dr;
    }
    pathSet.add(c1 + "," + r1);
  }

  // ---------------------------------------------------------------------------
  // Définition des tours
  // ---------------------------------------------------------------------------
  const TOWER_TYPES = {
    arrow: {
      name: "Archers", cost: 50, range: 120, damage: 8, fireRate: 0.55,
      color: "#4dabf7", bullet: "#a5d8ff", splash: 0, slow: 0, emoji: "🏹",
    },
    cannon: {
      name: "Canon", cost: 100, range: 110, damage: 22, fireRate: 1.3,
      color: "#e8863c", bullet: "#ffd8a8", splash: 45, slow: 0, emoji: "💣",
    },
    frost: {
      name: "Givre", cost: 75, range: 100, damage: 4, fireRate: 0.8,
      color: "#63e6be", bullet: "#c3fae8", splash: 0, slow: 0.5, emoji: "❄️",
    },
  };

  const MAX_TOWER_LEVEL = 10;
  const UPGRADE_RADIUS = 110;   // distance héros→tour pour pouvoir améliorer

  // Statistiques effectives d'une tour selon son niveau (1 → 10).
  function getTowerStats(t) {
    const def = TOWER_TYPES[t.type];
    const step = t.level - 1;
    return {
      range: def.range + 8 * step,
      damage: def.damage * Math.pow(1.22, step),
      fireRate: def.fireRate * Math.pow(0.93, step),
      splash: def.splash > 0 ? def.splash + 4 * step : 0,
      slow: def.slow > 0 ? Math.min(0.8, def.slow + 0.03 * step) : 0,
      bullet: def.bullet,
    };
  }

  // Coût pour faire passer une tour à son niveau suivant.
  function upgradeCost(t) {
    const def = TOWER_TYPES[t.type];
    return Math.round(def.cost * (0.8 + 0.5 * (t.level - 1)));
  }

  // ---------------------------------------------------------------------------
  // État du jeu
  // ---------------------------------------------------------------------------
  let state;

  function newState() {
    return {
      gold: 200,
      lives: 20,
      wave: 0,
      towers: [],
      enemies: [],
      bullets: [],
      floaters: [],       // textes flottants (or gagné, level up…)
      spawnQueue: [],
      spawnTimer: 0,
      waveActive: false,
      selectedType: null, // type de tour choisi pour la construction
      hoverCell: null,
      gameOver: false,
      nextTowerId: 1,
      panelSig: null,      // signature du panneau d'amélioration (pour éviter les redraws DOM)
      hero: {
        x: WIDTH / 2,
        y: HEIGHT / 2,
        tx: WIDTH / 2,
        ty: HEIGHT / 2,
        speed: 140,
        level: 1,
        xp: 0,
        xpNext: 10,
        maxHp: 100,
        hp: 100,
        damage: 14,
        range: 90,
        fireRate: 0.5,
        cooldown: 0,
        regen: 2,        // PV par seconde
      },
    };
  }

  // ---------------------------------------------------------------------------
  // Éléments d'interface
  // ---------------------------------------------------------------------------
  const el = {
    gold: document.getElementById("gold"),
    lives: document.getElementById("lives"),
    wave: document.getElementById("wave"),
    heroLevel: document.getElementById("hero-level"),
    heroXpFill: document.getElementById("hero-xpfill"),
    heroDmg: document.getElementById("hero-dmg"),
    heroRange: document.getElementById("hero-range"),
    heroHp: document.getElementById("hero-hp"),
    startWave: document.getElementById("start-wave"),
    reset: document.getElementById("reset"),
    buildHint: document.getElementById("build-hint"),
    nearbyTowers: document.getElementById("nearby-towers"),
    nearbyHint: document.getElementById("nearby-hint"),
    overlay: document.getElementById("overlay"),
    overlayTitle: document.getElementById("overlay-title"),
    overlayText: document.getElementById("overlay-text"),
    overlayBtn: document.getElementById("overlay-btn"),
    buildButtons: Array.from(document.querySelectorAll(".build-btn")),
  };

  function syncHud() {
    el.gold.textContent = state.gold;
    el.lives.textContent = state.lives;
    el.wave.textContent = state.wave;
    const h = state.hero;
    el.heroLevel.textContent = h.level;
    el.heroXpFill.style.width = Math.min(100, (h.xp / h.xpNext) * 100) + "%";
    el.heroDmg.textContent = Math.round(h.damage);
    el.heroRange.textContent = Math.round(h.range);
    el.heroHp.textContent = Math.round(h.hp) + "/" + h.maxHp;
    el.startWave.disabled = state.waveActive || state.gameOver;
  }

  // ---------------------------------------------------------------------------
  // Gestion des vagues
  // ---------------------------------------------------------------------------
  function startWave() {
    if (state.waveActive || state.gameOver) return;
    state.wave++;
    state.waveActive = true;

    const n = 8 + state.wave * 2;               // nombre d'ennemis
    const baseHp = 20 + state.wave * 12;        // PV de base croissants
    const queue = [];
    for (let i = 0; i < n; i++) {
      let kind = "basic";
      if (state.wave >= 3 && i % 5 === 0) kind = "tank";
      else if (state.wave >= 2 && i % 3 === 0) kind = "fast";
      queue.push(makeEnemyDef(kind, baseHp));
    }
    state.spawnQueue = queue;
    state.spawnTimer = 0;
    syncHud();
  }

  function makeEnemyDef(kind, baseHp) {
    if (kind === "fast") {
      return { kind, hp: baseHp * 0.6, speed: 105, reward: 8, color: "#ffd43b", size: 9 };
    }
    if (kind === "tank") {
      return { kind, hp: baseHp * 3.2, speed: 42, reward: 25, color: "#c92a2a", size: 15 };
    }
    return { kind, hp: baseHp, speed: 65, reward: 10, color: "#e64980", size: 11 };
  }

  function spawnEnemy(def) {
    state.enemies.push({
      x: WAYPOINTS[0].x,
      y: WAYPOINTS[0].y,
      wp: 1,                 // index du prochain point de passage
      hp: def.hp,
      maxHp: def.hp,
      speed: def.speed,
      baseSpeed: def.speed,
      reward: def.reward,
      color: def.color,
      size: def.size,
      slowTimer: 0,
    });
  }

  // ---------------------------------------------------------------------------
  // Boucle de mise à jour
  // ---------------------------------------------------------------------------
  function update(dt) {
    if (state.gameOver) return;

    // Apparition des ennemis
    if (state.waveActive && state.spawnQueue.length > 0) {
      state.spawnTimer -= dt;
      if (state.spawnTimer <= 0) {
        spawnEnemy(state.spawnQueue.shift());
        state.spawnTimer = 0.7;
      }
    }

    updateEnemies(dt);
    updateHero(dt);
    updateTowers(dt);
    updateBullets(dt);
    updateFloaters(dt);
    refreshUpgradePanel();

    // Fin de vague
    if (state.waveActive && state.spawnQueue.length === 0 && state.enemies.length === 0) {
      state.waveActive = false;
      state.gold += 40 + state.wave * 5;         // prime de fin de vague
      addFloater(WIDTH / 2, 40, "Vague terminée ! +" + (40 + state.wave * 5) + "💰", "#ffd43b");
    }

    syncHud();
  }

  function updateEnemies(dt) {
    for (let i = state.enemies.length - 1; i >= 0; i--) {
      const e = state.enemies[i];

      // Ralentissement (tour de givre)
      if (e.slowTimer > 0) {
        e.slowTimer -= dt;
        e.speed = e.baseSpeed * (e.slowTimer > 0 ? 0.5 : 1);
      } else {
        e.speed = e.baseSpeed;
      }

      const target = WAYPOINTS[e.wp];
      if (!target) { reachBase(e, i); continue; }

      const dx = target.x - e.x;
      const dy = target.y - e.y;
      const dist = Math.hypot(dx, dy);
      const step = e.speed * dt;

      if (dist <= step) {
        e.x = target.x;
        e.y = target.y;
        e.wp++;
        if (e.wp >= WAYPOINTS.length) reachBase(e, i);
      } else {
        e.x += (dx / dist) * step;
        e.y += (dy / dist) * step;
      }
    }
  }

  function reachBase(e, index) {
    state.enemies.splice(index, 1);
    state.lives--;
    addFloater(WIDTH - 30, HEIGHT - 40, "-1 ❤️", "#ff6b6b");
    if (state.lives <= 0) {
      state.lives = 0;
      endGame(false);
    }
  }

  function killEnemy(index) {
    const e = state.enemies[index];
    state.enemies.splice(index, 1);
    state.gold += e.reward;
    addFloater(e.x, e.y, "+" + e.reward + "💰", "#ffd43b");
    grantXp(e.reward);
  }

  // ---------------------------------------------------------------------------
  // Héros
  // ---------------------------------------------------------------------------
  function updateHero(dt) {
    const h = state.hero;

    // Déplacement au clavier (ZQSD/AZERTY, WASD/QWERTY ou flèches).
    // Prioritaire sur le déplacement à la souris tant qu'une touche est tenue.
    const move = readMoveVector();
    if (move.x !== 0 || move.y !== 0) {
      const len = Math.hypot(move.x, move.y);
      h.x += (move.x / len) * h.speed * dt;
      h.y += (move.y / len) * h.speed * dt;
      h.x = Math.max(0, Math.min(WIDTH, h.x));
      h.y = Math.max(0, Math.min(HEIGHT, h.y));
      // On synchronise la cible souris pour que le héros ne soit pas rappelé.
      h.tx = h.x;
      h.ty = h.y;
    } else {
      // Déplacement vers la cible (clic souris)
      const dx = h.tx - h.x;
      const dy = h.ty - h.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 1) {
        const step = Math.min(dist, h.speed * dt);
        h.x += (dx / dist) * step;
        h.y += (dy / dist) * step;
      }
    }

    // Régénération
    if (h.hp < h.maxHp) h.hp = Math.min(h.maxHp, h.hp + h.regen * dt);

    // Attaque automatique
    h.cooldown -= dt;
    if (h.cooldown <= 0) {
      const target = nearestEnemy(h.x, h.y, h.range);
      if (target) {
        spawnBullet(h.x, h.y, target.enemy, h.damage, "#ffe066", 0, 0);
        h.cooldown = h.fireRate;
      }
    }
  }

  function grantXp(amount) {
    const h = state.hero;
    h.xp += amount;
    while (h.xp >= h.xpNext) {
      h.xp -= h.xpNext;
      h.level++;
      h.xpNext = Math.round(h.xpNext * 1.5);
      h.maxHp += 20;
      h.hp = h.maxHp;
      h.damage += 5;
      h.range += 6;
      h.fireRate = Math.max(0.18, h.fireRate * 0.95);
      addFloater(h.x, h.y - 20, "NIVEAU " + h.level + " !", "#63e6be");
    }
  }

  // ---------------------------------------------------------------------------
  // Tours
  // ---------------------------------------------------------------------------
  function updateTowers(dt) {
    for (const t of state.towers) {
      t.cooldown -= dt;
      if (t.cooldown > 0) continue;
      const s = getTowerStats(t);
      const target = nearestEnemy(t.x, t.y, s.range);
      if (target) {
        spawnBullet(t.x, t.y, target.enemy, s.damage, s.bullet, s.splash, s.slow);
        t.cooldown = s.fireRate;
      }
    }
  }

  function nearestEnemy(x, y, range) {
    let best = null;
    let bestDist = range;
    for (const enemy of state.enemies) {
      const d = Math.hypot(enemy.x - x, enemy.y - y);
      if (d <= bestDist) {
        bestDist = d;
        best = enemy;
      }
    }
    return best ? { enemy: best, dist: bestDist } : null;
  }

  // ---------------------------------------------------------------------------
  // Projectiles
  // ---------------------------------------------------------------------------
  function spawnBullet(x, y, target, damage, color, splash, slow) {
    state.bullets.push({
      x, y, target, damage, color, splash, slow, speed: 420, dead: false,
    });
  }

  function updateBullets(dt) {
    for (let i = state.bullets.length - 1; i >= 0; i--) {
      const b = state.bullets[i];

      // La cible est morte : le projectile disparaît.
      if (!state.enemies.includes(b.target)) {
        state.bullets.splice(i, 1);
        continue;
      }

      const dx = b.target.x - b.x;
      const dy = b.target.y - b.y;
      const dist = Math.hypot(dx, dy);
      const step = b.speed * dt;

      if (dist <= step + b.target.size) {
        applyHit(b);
        state.bullets.splice(i, 1);
      } else {
        b.x += (dx / dist) * step;
        b.y += (dy / dist) * step;
      }
    }
  }

  function applyHit(b) {
    if (b.splash > 0) {
      // Dégâts de zone autour du point d'impact.
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const e = state.enemies[i];
        if (Math.hypot(e.x - b.target.x, e.y - b.target.y) <= b.splash) {
          damageEnemy(i, b.damage, b.slow);
        }
      }
    } else {
      const idx = state.enemies.indexOf(b.target);
      if (idx !== -1) damageEnemy(idx, b.damage, b.slow);
    }
  }

  function damageEnemy(index, damage, slow) {
    const e = state.enemies[index];
    e.hp -= damage;
    if (slow > 0) e.slowTimer = 1.5;
    if (e.hp <= 0) killEnemy(index);
  }

  // ---------------------------------------------------------------------------
  // Textes flottants
  // ---------------------------------------------------------------------------
  function addFloater(x, y, text, color) {
    state.floaters.push({ x, y, text, color, life: 1 });
  }

  function updateFloaters(dt) {
    for (let i = state.floaters.length - 1; i >= 0; i--) {
      const f = state.floaters[i];
      f.y -= 24 * dt;
      f.life -= dt;
      if (f.life <= 0) state.floaters.splice(i, 1);
    }
  }

  // ---------------------------------------------------------------------------
  // Rendu
  // ---------------------------------------------------------------------------
  function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawGrid();
    drawPath();
    drawTowers();
    drawHero();
    drawEnemies();
    drawBullets();
    drawFloaters();
    drawPlacementPreview();
  }

  function drawGrid() {
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        if (pathSet.has(c + "," + r)) continue;
        ctx.fillStyle = (c + r) % 2 === 0 ? "#153a22" : "#12331d";
        ctx.fillRect(c * TILE, r * TILE, TILE, TILE);
      }
    }
  }

  function drawPath() {
    ctx.strokeStyle = "#5c4a2a";
    ctx.lineWidth = TILE * 0.7;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(WAYPOINTS[0].x, WAYPOINTS[0].y);
    for (let i = 1; i < WAYPOINTS.length; i++) {
      ctx.lineTo(WAYPOINTS[i].x, WAYPOINTS[i].y);
    }
    ctx.stroke();

    ctx.strokeStyle = "#6b5836";
    ctx.lineWidth = TILE * 0.5;
    ctx.stroke();

    // Base à défendre
    const end = WAYPOINTS[WAYPOINTS.length - 1];
    ctx.font = "26px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🏰", end.x, end.y);

    // Portail de départ
    ctx.fillText("🌀", WAYPOINTS[0].x + 6, WAYPOINTS[0].y);
  }

  function drawTowers() {
    const h = state.hero;
    for (const t of state.towers) {
      const def = TOWER_TYPES[t.type];
      const near = Math.hypot(t.x - h.x, t.y - h.y) <= UPGRADE_RADIUS;

      // Surbrillance des tours à portée du héros (améliorables).
      if (near) {
        ctx.strokeStyle = "rgba(99, 230, 190, 0.7)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(t.x, t.y, 19, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath();
      ctx.arc(t.x, t.y, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = def.color;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "18px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(def.emoji, t.x, t.y + 1);

      // Pastille de niveau
      ctx.fillStyle = "#0f1226";
      ctx.beginPath();
      ctx.arc(t.x + 11, t.y + 11, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#63e6be";
      ctx.font = "bold 10px system-ui, sans-serif";
      ctx.fillText(String(t.level), t.x + 11, t.y + 12);
    }
  }

  function drawHero() {
    const h = state.hero;

    // Cercle de portée d'attaque (discret)
    ctx.strokeStyle = "rgba(255, 224, 102, 0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(h.x, h.y, h.range, 0, Math.PI * 2);
    ctx.stroke();

    // Zone d'amélioration des tours (les tours à l'intérieur sont améliorables)
    ctx.strokeStyle = "rgba(99, 230, 190, 0.3)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(h.x, h.y, UPGRADE_RADIUS, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.arc(h.x, h.y, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "24px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🦸", h.x, h.y);

    // Barre de vie du héros
    drawBar(h.x, h.y - 22, 30, h.hp / h.maxHp, "#63e6be");
  }

  function drawEnemies() {
    for (const e of state.enemies) {
      ctx.fillStyle = e.color;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      ctx.fill();

      if (e.slowTimer > 0) {
        ctx.strokeStyle = "#c3fae8";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      drawBar(e.x, e.y - e.size - 7, e.size * 2, e.hp / e.maxHp, "#ff6b6b");
    }
  }

  function drawBar(cx, cy, width, ratio, color) {
    ratio = Math.max(0, Math.min(1, ratio));
    const h = 4;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(cx - width / 2, cy, width, h);
    ctx.fillStyle = color;
    ctx.fillRect(cx - width / 2, cy, width * ratio, h);
  }

  function drawBullets() {
    for (const b of state.bullets) {
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.splash > 0 ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawFloaters() {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const f of state.floaters) {
      ctx.globalAlpha = Math.max(0, Math.min(1, f.life));
      ctx.fillStyle = f.color;
      ctx.font = "bold 15px system-ui, sans-serif";
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
  }

  function drawPlacementPreview() {
    if (!state.selectedType || !state.hoverCell) return;
    const { c, r } = state.hoverCell;
    const def = TOWER_TYPES[state.selectedType];
    const ok = canBuildAt(c, r);
    const cx = c * TILE + TILE / 2;
    const cy = r * TILE + TILE / 2;

    ctx.fillStyle = ok ? "rgba(99, 230, 190, 0.25)" : "rgba(255, 107, 107, 0.25)";
    ctx.fillRect(c * TILE, r * TILE, TILE, TILE);

    ctx.strokeStyle = ok ? "rgba(99, 230, 190, 0.6)" : "rgba(255, 107, 107, 0.7)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, def.range, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ---------------------------------------------------------------------------
  // Construction
  // ---------------------------------------------------------------------------
  function canBuildAt(c, r) {
    if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return false;
    if (pathSet.has(c + "," + r)) return false;
    for (const t of state.towers) {
      if (t.c === c && t.r === r) return false;
    }
    if (!state.selectedType) return false;
    return state.gold >= TOWER_TYPES[state.selectedType].cost;
  }

  function tryBuild(c, r) {
    if (!canBuildAt(c, r)) {
      if (state.selectedType && state.gold < TOWER_TYPES[state.selectedType].cost) {
        addFloater(c * TILE + TILE / 2, r * TILE + TILE / 2, "Pas assez d'or", "#ff6b6b");
      }
      return;
    }
    const def = TOWER_TYPES[state.selectedType];
    state.gold -= def.cost;
    state.towers.push({
      id: state.nextTowerId++,
      type: state.selectedType,
      level: 1,
      c, r,
      x: c * TILE + TILE / 2,
      y: r * TILE + TILE / 2,
      cooldown: 0,
    });
    syncHud();
  }

  function selectType(type) {
    state.selectedType = state.selectedType === type ? null : type;
    el.buildButtons.forEach((b) =>
      b.classList.toggle("selected", b.dataset.type === state.selectedType)
    );
  }

  // ---------------------------------------------------------------------------
  // Amélioration des tours (uniquement celles proches du héros)
  // ---------------------------------------------------------------------------
  function nearbyTowers() {
    const h = state.hero;
    return state.towers
      .map((t) => ({ t, dist: Math.hypot(t.x - h.x, t.y - h.y) }))
      .filter((o) => o.dist <= UPGRADE_RADIUS)
      .sort((a, b) => a.dist - b.dist)
      .map((o) => o.t);
  }

  function upgradeTower(id) {
    const t = state.towers.find((x) => x.id === id);
    if (!t || t.level >= MAX_TOWER_LEVEL) return;
    const cost = upgradeCost(t);
    if (state.gold < cost) {
      addFloater(t.x, t.y, "Pas assez d'or", "#ff6b6b");
      return;
    }
    state.gold -= cost;
    t.level++;
    addFloater(t.x, t.y - 20, "Niveau " + t.level, "#63e6be");
    state.panelSig = null; // force la reconstruction du panneau
    syncHud();
  }

  function refreshUpgradePanel() {
    const list = nearbyTowers();

    // Signature : ne reconstruit le DOM que si quelque chose a changé.
    const sig = list
      .map((t) => {
        const maxed = t.level >= MAX_TOWER_LEVEL;
        const afford = !maxed && state.gold >= upgradeCost(t);
        return t.id + ":" + t.level + ":" + (maxed ? "m" : afford ? "1" : "0");
      })
      .join("|");
    if (sig === state.panelSig) return;
    state.panelSig = sig;

    if (list.length === 0) {
      el.nearbyTowers.innerHTML = "";
      el.nearbyHint.style.display = "";
      return;
    }
    el.nearbyHint.style.display = "none";

    el.nearbyTowers.innerHTML = list
      .map((t) => {
        const def = TOWER_TYPES[t.type];
        const s = getTowerStats(t);
        const maxed = t.level >= MAX_TOWER_LEVEL;
        const cost = maxed ? 0 : upgradeCost(t);
        const afford = !maxed && state.gold >= cost;
        const btn = maxed
          ? `<button class="tr-up maxed" disabled>Max</button>`
          : `<button class="tr-up" data-id="${t.id}" ${afford ? "" : "disabled"}>+ ${cost}💰</button>`;
        return `
          <div class="tower-row">
            <span class="tr-emoji">${def.emoji}</span>
            <div class="tr-info">
              <div class="tr-name">${def.name} <span class="tr-lvl">Niv. ${t.level}/${MAX_TOWER_LEVEL}</span></div>
              <div class="tr-stats">Dég. ${Math.round(s.damage)} · Portée ${Math.round(s.range)}</div>
            </div>
            ${btn}
          </div>`;
      })
      .join("");
  }

  // ---------------------------------------------------------------------------
  // Fin de partie
  // ---------------------------------------------------------------------------
  function endGame(won) {
    state.gameOver = true;
    state.waveActive = false;
    el.overlay.classList.remove("hidden");
    if (won) {
      el.overlayTitle.textContent = "Victoire !";
      el.overlayText.textContent = "Tu as tenu bon.";
    } else {
      el.overlayTitle.textContent = "Défaite";
      el.overlayText.textContent =
        "Ta base est tombée à la vague " + state.wave + ". Héros niveau " + state.hero.level + ".";
    }
    el.overlayBtn.textContent = "Rejouer";
    syncHud();
  }

  // ---------------------------------------------------------------------------
  // Entrées
  // ---------------------------------------------------------------------------

  // Déplacement du héros au clavier.
  // On se base sur `event.code`, c.-à-d. la POSITION PHYSIQUE de la touche,
  // indépendamment de la disposition du clavier. Les positions KeyW/KeyA/KeyS/KeyD
  // correspondent ainsi à ZQSD sur un AZERTY et à WASD sur un QWERTY : le même code
  // fonctionne sur les deux dispositions sans avoir besoin de les détecter.
  const MOVE_KEYS = {
    KeyW: [0, -1], KeyS: [0, 1], KeyA: [-1, 0], KeyD: [1, 0],       // ZQSD / WASD
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
  };
  const pressedKeys = new Set();

  function readMoveVector() {
    let x = 0, y = 0;
    for (const code of pressedKeys) {
      const v = MOVE_KEYS[code];
      if (v) { x += v[0]; y += v[1]; }
    }
    return { x, y };
  }

  window.addEventListener("keyup", (e) => { pressedKeys.delete(e.code); });
  // Si la fenêtre perd le focus, on relâche tout pour éviter un déplacement bloqué.
  window.addEventListener("blur", () => { pressedKeys.clear(); });

  function canvasPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (evt.clientX - rect.left) * scaleX,
      y: (evt.clientY - rect.top) * scaleY,
    };
  }

  canvas.addEventListener("mousemove", (evt) => {
    const p = canvasPos(evt);
    state.hoverCell = {
      c: Math.floor(p.x / TILE),
      r: Math.floor(p.y / TILE),
    };
  });

  canvas.addEventListener("mouseleave", () => { state.hoverCell = null; });

  canvas.addEventListener("click", (evt) => {
    if (state.gameOver) return;
    const p = canvasPos(evt);
    if (state.selectedType) {
      tryBuild(Math.floor(p.x / TILE), Math.floor(p.y / TILE));
    } else {
      // Déplacer le héros
      state.hero.tx = p.x;
      state.hero.ty = p.y;
    }
  });

  el.buildButtons.forEach((b) =>
    b.addEventListener("click", () => selectType(b.dataset.type))
  );

  el.nearbyTowers.addEventListener("click", (evt) => {
    const btn = evt.target.closest(".tr-up");
    if (!btn || btn.disabled || !btn.dataset.id) return;
    upgradeTower(Number(btn.dataset.id));
  });

  el.startWave.addEventListener("click", startWave);
  el.reset.addEventListener("click", reset);
  el.overlayBtn.addEventListener("click", reset);

  window.addEventListener("keydown", (e) => {
    // Déplacement du héros : on mémorise la touche tenue.
    if (MOVE_KEYS[e.code]) { pressedKeys.add(e.code); e.preventDefault(); }
    if (e.key === "Escape") selectType(state.selectedType); // désélectionne
    if (e.key === " " || e.key === "Enter") { startWave(); e.preventDefault(); }
    if (e.key === "1") selectType("arrow");
    if (e.key === "2") selectType("cannon");
    if (e.key === "3") selectType("frost");
  });

  // ---------------------------------------------------------------------------
  // Initialisation & boucle principale
  // ---------------------------------------------------------------------------
  function reset() {
    state = newState();
    el.overlay.classList.add("hidden");
    el.buildButtons.forEach((b) => b.classList.remove("selected"));
    el.nearbyTowers.innerHTML = "";
    el.nearbyHint.style.display = "";
    syncHud();
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  reset();
  requestAnimationFrame(loop);
})();

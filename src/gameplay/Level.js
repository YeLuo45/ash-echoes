export class Level {
  constructor(enemyManager, player) {
    this.enemyManager = enemyManager;
    this.player = player;
    this.width = 2400;
    this.height = 800;
    this.platforms = [];
    this.platformColor = '#1a1a2e';
    this.bgColor1 = '#0a0a0f';
    this.bgColor2 = '#12121a';
    this.resonanceShrines = [];
    this.collectibles = [];
    this.portal = null;
  }

  init() {
    this.platforms = [
      // Ground
      { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
      // Platforms
      { x: 200, y: 380, w: 150, h: 20, type: 'platform' },
      { x: 450, y: 320, w: 120, h: 20, type: 'platform' },
      { x: 700, y: 280, w: 180, h: 20, type: 'platform' },
      { x: 950, y: 380, w: 100, h: 20, type: 'platform' },
      { x: 1100, y: 300, w: 140, h: 20, type: 'platform' },
      { x: 1350, y: 250, w: 160, h: 20, type: 'platform' },
      { x: 1550, y: 350, w: 120, h: 20, type: 'platform' },
      { x: 1750, y: 280, w: 200, h: 20, type: 'platform' },
      { x: 2000, y: 350, w: 150, h: 20, type: 'platform' },
      { x: 2200, y: 400, w: 180, h: 20, type: 'platform' },
    ];

    // 回响祭坛 (Resonance Shrines / 存档点)
    this.resonanceShrines = [
      { x: 150, y: 460, w: 40, h: 20, active: false },
      { x: 1100, y: 280, w: 40, h: 20, active: true },
      { x: 1750, y: 260, w: 40, h: 20, active: false },
    ];

    // 回响碎片 collectibles
    this.collectibles = [
      { x: 270, y: 360, collected: false },
      { x: 500, y: 300, collected: false },
      { x: 780, y: 260, collected: false },
      { x: 990, y: 360, collected: false },
      { x: 1170, y: 280, collected: false },
      { x: 1430, y: 230, collected: false },
      { x: 1600, y: 330, collected: false },
      { x: 1850, y: 260, collected: false },
      { x: 2070, y: 330, collected: false },
      { x: 2280, y: 380, collected: false },
    ];

    // Portal to next area
    this.portal = { x: 2280, y: 380, w: 50, h: 100, active: false };

    this._initEnemies();
  }

  _initEnemies() {
    const enemyData = {
      enemies: [
        { type: 'scavenger', x: 300, y: 460 },
        { type: 'scavenger', x: 600, y: 460 },
        { type: 'patroller', x: 800, y: 460 },
        { type: 'ranged', x: 500, y: 280 },
        { type: 'scavenger', x: 1000, y: 460 },
        { type: 'patroller', x: 1200, y: 280 },
        { type: 'scavenger', x: 1400, y: 460 },
        { type: 'ranged', x: 1600, y: 310 },
        { type: 'elite', x: 1800, y: 260 },
        { type: 'scavenger', x: 1900, y: 460 },
        { type: 'patroller', x: 2050, y: 460 },
        { type: 'ranged', x: 2100, y: 320 },
        { type: 'boss', x: 2250, y: 380 },
      ]
    };
    this.enemyManager.init(enemyData);
  }

  update(dt) {
    // Update enemy targets
    for (const e of this.enemyManager.enemies) {
      e.setTarget(this.player.x, this.player.y);
    }

    // Collision detection
    this._checkCollisions();

    // Collectibles
    this._checkCollectibles();

    // Portal check
    if (this.portal.active) {
      this._checkPortal();
    }
  }

  _checkCollisions() {
    // Player vs platforms
    for (const plat of this.platforms) {
      if (this.player.x + this.player.width > plat.x &&
          this.player.x < plat.x + plat.w &&
          this.player.y + this.player.height > plat.y &&
          this.player.y + this.player.height < plat.y + plat.h + 20 &&
          this.player.vy >= 0) {
        this.player.y = plat.y - this.player.height;
        this.player.vy = 0;
      }
    }

    // Player bullets vs enemies
    for (const p of this.enemyManager.projectiles.getProjectiles()) {
      if (p.owner !== 'player') continue;
      for (const e of this.enemyManager.enemies) {
        const dx = p.x - e.x;
        const dy = p.y - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < p.radius + e.size / 2) {
          e.takeDamage(p.damage);
          p.isDead = true;
        }
      }
    }

    // Enemy bullets vs player
    for (const p of this.enemyManager.projectiles.getProjectiles()) {
      if (p.owner !== 'enemy') continue;
      const dx = p.x - (this.player.x + this.player.width / 2);
      const dy = p.y - (this.player.y + this.player.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < p.radius + 16) {
        this.player.takeDamage(p.damage);
        p.isDead = true;
      }
    }

    // Player vs enemies (contact damage)
    for (const e of this.enemyManager.enemies) {
      const dx = (this.player.x + this.player.width / 2) - e.x;
      const dy = (this.player.y + this.player.height / 2) - e.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 24 + e.size / 2) {
        this.player.takeDamage(e.damage * 0.1);
      }
    }
  }

  _checkCollectibles() {
    for (const c of this.collectibles) {
      if (c.collected) continue;
      const dx = (this.player.x + this.player.width / 2) - c.x;
      const dy = (this.player.y + this.player.height / 2) - c.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 30) {
        c.collected = true;
        this.player.addResonance(15);
        this.player.addAsh(5);
      }
    }

    // Check if all regular enemies defeated → activate portal
    if (this.enemyManager.getCount() === 0 && !this.portal.active) {
      this.portal.active = true;
    }
  }

  _checkPortal() {
    const p = this.portal;
    if (this.player.x + this.player.width > p.x &&
        this.player.x < p.x + p.w &&
        this.player.y + this.player.height > p.y &&
        this.player.y < p.y + p.h) {
      // Next level / victory
      this._showVictory();
    }
  }

  _showVictory() {
    // Placeholder - boss defeated → show victory screen
  }

  renderBackground(ctx) {
    // Parallax sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, '#0a0a0f');
    grad.addColorStop(1, '#15151f');
    ctx.fillStyle = grad;
    ctx.fillRect(this.x || 0, this.y || 0, this.width, this.height);

    // Background ruins (silhouettes)
    ctx.fillStyle = '#0d0d15';
    // Distant buildings
    ctx.fillRect(100, 300, 60, 180);
    ctx.fillRect(200, 350, 40, 130);
    ctx.fillRect(350, 280, 80, 200);
    ctx.fillRect(500, 320, 50, 160);
    ctx.fillRect(650, 250, 70, 230);
    ctx.fillRect(800, 300, 55, 180);
    ctx.fillRect(950, 270, 65, 210);
    ctx.fillRect(1100, 310, 45, 170);
    ctx.fillRect(1300, 240, 90, 240);
    ctx.fillRect(1500, 290, 60, 190);
    ctx.fillRect(1700, 260, 75, 220);
    ctx.fillRect(1900, 300, 50, 180);
    ctx.fillRect(2100, 280, 70, 200);
  }

  render(ctx) {
    // Platforms
    for (const plat of this.platforms) {
      if (plat.type === 'ground') {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
        ctx.fillStyle = '#2a2a4e';
        ctx.fillRect(plat.x, plat.y, plat.w, 4);
      } else {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(plat.x, plat.y, plat.w, 2);
      }
    }

    // Resonance Shrines
    for (const s of this.resonanceShrines) {
      ctx.fillStyle = s.active ? '#00d4ff' : '#3a3a5e';
      ctx.fillRect(s.x, s.y, s.w, s.h);
      // Glow
      if (s.active) {
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 15;
        ctx.fillRect(s.x + 5, s.y - 10, s.w - 10, 10);
        ctx.shadowBlur = 0;
      }
    }

    // Collectibles
    for (const c of this.collectibles) {
      if (c.collected) continue;
      const pulse = Math.sin(performance.now() * 0.005) * 3;
      ctx.fillStyle = '#7b2cbf';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 10 + pulse;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Portal
    if (this.portal.active) {
      const p = this.portal;
      ctx.fillStyle = '#00d4ff';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 20;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.shadowBlur = 0;
    }
  }
}

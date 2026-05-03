import { ENEMY_TEMPLATES } from './enemies.js';

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
    this.accentColor = '#ff6b35';
    this.resonanceShrines = [];
    this.collectibles = [];
    this.portal = null;
    this.theme = 'ruins';
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

    this.resonanceShrines = [
      { x: 150, y: 460, w: 40, h: 20, active: false },
      { x: 1100, y: 280, w: 40, h: 20, active: true },
      { x: 1750, y: 260, w: 40, h: 20, active: false },
    ];

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

    this.portal = { x: 2280, y: 380, w: 50, h: 100, active: false };

    this._initEnemies();
  }

  // V2: Initialize from chapter data
  initFromData(levelData, chapterData) {
    this.width = levelData.width || 2400;
    this.height = levelData.height || 800;
    this.platforms = levelData.platforms || [];
    this.resonanceShrines = (levelData.shrines || []).map(s => ({ ...s }));
    this.collectibles = (levelData.collectibles || []).map(c => ({ ...c, collected: false }));
    this.portal = levelData.portal ? { ...levelData.portal, active: false } : null;
    this.theme = chapterData.theme || 'ruins';
    this.bgColor1 = chapterData.bgColor1 || '#0a0a0f';
    this.bgColor2 = chapterData.bgColor2 || '#12121a';
    this.accentColor = chapterData.accentColor || '#ff6b35';

    // Spawn enemies
    this.enemyManager.enemies = [];
    for (const e of levelData.enemies) {
      const template = ENEMY_TEMPLATES[e.type] || ENEMY_TEMPLATES.scavenger;
      this.enemyManager.spawn(e.type, e.x, e.y);
    }
  }

  // V2: Initialize from roguelite room
  initFromRogueliteRoom(room) {
    this.width = room.width || 2400;
    this.height = room.height || 800;
    this.platforms = room.platforms || [];
    this.collectibles = (room.collectibles || []).map(c => ({ ...c, collected: false }));
    this.portal = null;
    this.theme = 'roguelite';
    this.bgColor1 = '#0a0a1a';
    this.bgColor2 = '#0a0a2a';
    this.accentColor = '#9b59b6';

    // Spawn enemies with scaled HP
    this.enemyManager.enemies = [];
    for (const e of room.enemies) {
      const enemy = this.enemyManager.spawn(e.type, e.x, e.y);
      if (e.hp && enemy) {
        enemy.hp = e.hp;
        enemy.maxHp = e.hp;
      }
    }
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
    for (const e of this.enemyManager.enemies) {
      e.setTarget(this.player.x, this.player.y);
    }

    this._checkCollisions();
    this._checkCollectibles();

    if (this.portal?.active) {
      this._checkPortal();
    }

    // Roguelite room complete
    if (this.enemyManager.getCount() === 0 && !this.portal?.active && !this._isRogueliteEvent) {
      // Nothing to do - waiting for room advance
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
    if (this.enemyManager.getCount() === 0 && !this.portal?.active && this.portal) {
      this.portal.active = true;
    }
  }

  _checkPortal() {
    const p = this.portal;
    if (this.player.x + this.player.width > p.x &&
        this.player.x < p.x + p.w &&
        this.player.y + this.player.height > p.y &&
        this.player.y < p.y + p.h) {
      // Handled by GameV2._onLevelComplete
    }
  }

  _showVictory() {
    // Placeholder
  }

  renderBackground(ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, this.bgColor1);
    grad.addColorStop(1, this.bgColor2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Background buildings/silhouettes
    ctx.fillStyle = '#0d0d15';
    const positions = [100, 200, 350, 500, 650, 800, 950, 1100, 1300, 1500, 1700, 1900, 2100];
    const heights = [180, 130, 200, 160, 230, 180, 210, 170, 240, 190, 220, 180, 200];
    const widths = [60, 40, 80, 50, 70, 55, 65, 45, 90, 60, 75, 50, 70];

    for (let i = 0; i < positions.length; i++) {
      ctx.fillRect(positions[i], this.height - heights[i], widths[i], heights[i]);
    }

    // Theme-specific overlays
    if (this.theme === 'underwater') {
      // Water caustics effect
      ctx.fillStyle = 'rgba(0, 100, 150, 0.05)';
      for (let i = 0; i < 5; i++) {
        const x = (performance.now() * 0.02 + i * 200) % (this.width + 400) - 200;
        ctx.beginPath();
        ctx.ellipse(x, 200, 100, 40, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (this.theme === 'spacetime') {
      // Fractured spacetime - floating debris
      ctx.fillStyle = 'rgba(100, 50, 150, 0.1)';
      for (let i = 0; i < 8; i++) {
        const x = (i * 300 + performance.now() * 0.01) % this.width;
        const y = 100 + i * 50;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(performance.now() * 0.001 + i);
        ctx.fillRect(-20, -20, 40, 40);
        ctx.restore();
      }
    } else if (this.theme === 'roguelite') {
      // Roguelite - purple void
      ctx.fillStyle = 'rgba(80, 20, 120, 0.08)';
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  render(ctx) {
    // Platforms
    for (const plat of this.platforms) {
      if (plat.type === 'ground') {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
        ctx.fillStyle = this.accentColor;
        ctx.fillRect(plat.x, plat.y, plat.w, 4);
      } else {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
        ctx.fillStyle = this.accentColor;
        ctx.fillRect(plat.x, plat.y, plat.w, 2);
      }
    }

    // Resonance Shrines
    for (const s of this.resonanceShrines) {
      ctx.fillStyle = s.active ? this.accentColor : '#3a3a5e';
      ctx.fillRect(s.x, s.y, s.w, s.h);
      if (s.active) {
        ctx.shadowColor = this.accentColor;
        ctx.shadowBlur = 15;
        ctx.fillRect(s.x + 5, s.y - 10, s.w - 10, 10);
        ctx.shadowBlur = 0;
      }
    }

    // Collectibles
    for (const c of this.collectibles) {
      if (c.collected) continue;
      const pulse = Math.sin(performance.now() * 0.005) * 3;
      ctx.fillStyle = this.accentColor;
      ctx.shadowColor = this.accentColor;
      ctx.shadowBlur = 10 + pulse;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Portal
    if (this.portal?.active) {
      const p = this.portal;
      ctx.fillStyle = this.accentColor;
      ctx.shadowColor = this.accentColor;
      ctx.shadowBlur = 20;
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.shadowBlur = 0;
    }
  }
}

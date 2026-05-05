import { Enemy } from './Enemy.js';
import { ENEMY_TEMPLATES } from './enemies.js';
import { attachBossBehavior } from './BossBehaviors.js';

export class EnemyManager {
  constructor(projectiles, particles) {
    this.projectiles = projectiles;
    this.particles = particles;
    this.enemies = [];
    // Use ENEMY_TEMPLATES directly for all enemy types
    this.enemyTypes = ENEMY_TEMPLATES;
  }

  init(levelData) {
    this.enemies = [];
    if (!levelData || !levelData.enemies) return;

    for (const e of levelData.enemies) {
      this.spawn(e.type, e.x, e.y);
    }
  }

  init() {
    // Default level - enemies will be set by Level
  }

  spawn(type, x, y) {
    const template = this.enemyTypes[type] || this.enemyTypes['scavenger'];
    const enemy = new Enemy(type, x, y, template, this.projectiles, this.particles);
    enemy._gameRef = this._gameRef;
    this.enemies.push(enemy);
    // Attach boss behavior for all boss types
    if (this._gameRef && ['boss_ruins_king', 'boss_base_commander', 'boss_core_will', 'boss_core_guardian'].includes(type)) {
      attachBossBehavior(enemy, this._gameRef);
    }
    return enemy;
  }

  // Called by GameV2 to pass game reference for boss AI
  setGameRef(game) {
    this._gameRef = game;
  }

  update(dt) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.update(dt);

      if (e.isDead) {
        // Death particles
        for (let j = 0; j < 12; j++) {
          this.particles.spawn(e.x, e.y, 'enemy_death', {
            vx: (Math.random() - 0.5) * 200,
            vy: (Math.random() - 0.5) * 200,
            life: 0.5,
            color: e.color
          });
        }
        this.enemies.splice(i, 1);
      }
    }
  }

  applyEchoPulse(cx, cy, radius, damage, knockback) {
    for (const e of this.enemies) {
      const dx = e.x - cx;
      const dy = e.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius) {
        e.takeDamage(damage);
        const angle = Math.atan2(dy, dx);
        e.vx += Math.cos(angle) * knockback;
        e.vy += Math.sin(angle) * knockback;
      }
    }
  }

  render(ctx) {
    for (const e of this.enemies) {
      e.render(ctx);
    }
  }

  getCount() {
    return this.enemies.length;
  }
}

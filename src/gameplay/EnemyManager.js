import { Enemy } from './Enemy.js';

export class EnemyManager {
  constructor(projectiles, particles) {
    this.projectiles = projectiles;
    this.particles = particles;
    this.enemies = [];
    this.enemyTypes = {
      'scavenger': { hp: 30, speed: 80, damage: 10, attackRange: 40, color: '#8b5a5a', size: 28, score: 10 },
      'patroller': { hp: 50, speed: 60, damage: 15, attackRange: 60, color: '#5a8b5a', size: 32, score: 20 },
      'ranged': { hp: 25, speed: 40, damage: 8, attackRange: 300, color: '#5a5a8b', size: 26, shootInterval: 1.5, score: 15 },
      'elite': { hp: 120, speed: 50, damage: 25, attackRange: 50, color: '#8b5a8b', size: 40, score: 50 },
      'boss': { hp: 500, speed: 30, damage: 30, attackRange: 80, color: '#8b0000', size: 64, score: 200 },
    };
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
    this.enemies.push(enemy);
    return enemy;
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

import { Projectile } from './Projectile.js';

export class ProjectileManager {
  constructor() {
    this.projectiles = [];
  }

  spawnPlayerBullet(x, y, vx, vy, type = 'player_bullet') {
    const p = new Projectile(x, y, vx, vy, type, 'player');
    p.damage = 20;
    p.radius = 5;
    this.projectiles.push(p);
  }

  spawnEnemyBullet(x, y, vx, vy, damage = 10) {
    const p = new Projectile(x, y, vx, vy, 'enemy_bullet', 'enemy');
    p.damage = damage;
    p.radius = 4;
    this.projectiles.push(p);
  }

  update(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.update(dt);
      if (p.isDead) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  render(ctx) {
    for (const p of this.projectiles) {
      p.render(ctx);
    }
  }

  getProjectiles() {
    return this.projectiles;
  }

  clear() {
    this.projectiles = [];
  }
}

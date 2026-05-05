export class Enemy {
  constructor(type, x, y, config, projectiles, particles) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.config = config;
    this.projectiles = projectiles;
    this.particles = particles;

    this.hp = config.hp;
    this.maxHp = config.hp;
    this.speed = config.speed;
    this.damage = config.damage;
    this.attackRange = config.attackRange;
    this.color = config.color;
    this.size = config.size;
    this.score = config.score;

    this.vx = 0;
    this.vy = 0;
    this.facingRight = true;
    this.state = 'idle';
    this.stateTimer = 0;
    this.attackTimer = 0;
    this.shootInterval = config.shootInterval || 0;
    this.isDead = false;

    // AI state
    this.targetX = 0;
    this.targetY = 0;
    this.aiState = 'wander';
    this.wanderTimer = 0;
    this.aggroRange = 200;
    this.attackCooldown = 1.0;

    // Visual
    this.hitFlash = 0;
    this.animFrame = 0;
    this.animTimer = 0;
  }

  update(dt) {
    if (this.isDead) return;

    this.stateTimer += dt;
    this.attackTimer += dt;
    if (this.hitFlash > 0) this.hitFlash -= dt * 5;
    if (this.animTimer > 0) this.animTimer -= dt;

    // Boss special AI (M4 bosses)
    if (this._bossUpdate) {
      this._bossUpdate(dt, this._gameRef);
    } else {
      this._updateAI(dt);
      this._applyVelocity(dt);
      this._checkAttack(dt);
    }
  }

  _updateAI(dt) {
    // Speed scales with corruption
    const speedMod = 1;
    const moveSpeed = this.speed * speedMod;

    if (this.aiState === 'wander') {
      this.wanderTimer += dt;
      if (this.wanderTimer > 2) {
        this.wanderTimer = 0;
        this.targetX = this.x + (Math.random() - 0.5) * 100;
        this.targetY = this.y + (Math.random() - 0.5) * 60;
      }

      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 5) {
        this.vx = (dx / dist) * moveSpeed * 0.5;
        this.vy = (dy / dist) * moveSpeed * 0.5;
      } else {
        this.vx *= 0.9;
        this.vy *= 0.9;
      }
    } else if (this.aiState === 'chase') {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 10) {
        this.vx = (dx / dist) * moveSpeed;
        this.vy = (dy / dist) * moveSpeed;
      }
    }
  }

  _applyVelocity(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vx *= 0.95;
    this.vy *= 0.95;
  }

  _checkAttack(dt) {
    if (this.attackTimer < this.attackCooldown) return;

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.attackRange) {
      this.attack();
      this.attackTimer = 0;
    }
  }

  attack() {
    if (this.type === 'ranged') {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const dirX = dx / dist;
      const dirY = dy / dist;

      this.projectiles.spawnEnemyBullet(
        this.x, this.y,
        dirX * 200, dirY * 200,
        this.damage
      );
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    this.hitFlash = 1;

    if (this.hp <= 0) {
      this.isDead = true;
    }
  }

  setTarget(x, y) {
    this.targetX = x;
    this.targetY = y;
    if (Math.abs(x - this.x) > this.aggroRange * 0.5) {
      this.aiState = 'chase';
    }
  }

  render(ctx) {
    // Boss phase label
    if (this._bossRender) {
      this._bossRender(ctx);
    }

    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + this.size / 2, this.size / 2, this.size / 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    const flashColor = this.hitFlash > 0 ? '#fff' : this.color;
    ctx.fillStyle = flashColor;

    // 回响污染光晕
    ctx.shadowColor = '#7b2cbf';
    ctx.shadowBlur = 10 + Math.sin(performance.now() * 0.005) * 5;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Eyes
    const eyeOffset = this.facingRight ? 4 : -4;
    ctx.fillStyle = this.hitFlash > 0 ? '#fff' : '#ff3333';
    ctx.beginPath();
    ctx.arc(this.x + eyeOffset - 4, this.y - 4, 3, 0, Math.PI * 2);
    ctx.arc(this.x + eyeOffset + 4, this.y - 4, 3, 0, Math.PI * 2);
    ctx.fill();

    // HP bar
    if (this.hp < this.maxHp) {
      const barW = this.size;
      const barH = 4;
      const barY = this.y - this.size / 2 - 10;

      ctx.fillStyle = '#333';
      ctx.fillRect(this.x - barW / 2, barY, barW, barH);
      ctx.fillStyle = '#ff3333';
      ctx.fillRect(this.x - barW / 2, barY, barW * (this.hp / this.maxHp), barH);
    }

    ctx.restore();
  }
}

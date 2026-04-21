import { Projectile } from './Projectile.js';

export class Player {
  constructor(input, projectiles, particles, enemies) {
    this.input = input;
    this.projectiles = projectiles;
    this.particles = particles;
    this.enemies = enemies;

    this.x = 0;
    this.y = 0;
    this.width = 32;
    this.height = 48;
    this.vx = 0;
    this.vy = 0;
    this.speed = 200;
    this.facingRight = true;

    this.hp = 100;
    this.maxHp = 100;
    this.resonance = 0;
    this.maxResonance = 100;

    // Dash
    this.isDashing = false;
    this.canDash = true;
    this.dashTimer = 0;
    this.dashDuration = 0.12;
    this.dashSpeed = 600;
    this.dashCooldown = 0.8;
    this.dashCooldownTimer = 0;
    this.invincible = false;
    this.invincibleTimer = 0;

    // Shooting
    this.shootTimer = 0;
    this.shootInterval = 0.12;
    this.bulletSpeed = 500;

    // Skills
    this.skillTimer = 0;
    this.skillCooldown = 3.0;
    this.echoPulseReady = true;

    // Corruption (回响侵蚀)
    this.corruption = 0;
    this.maxCorruption = 100;
    this.corruptionLevel = 0; // 0-3 visual stages

    // Stats
    this.ash = 0; // Currency
    this.echoFragments = 0; // Collectible

    // Animation
    this.frame = 0;
    this.frameTimer = 0;
    this.state = 'idle'; // idle, run, dash, shoot

    this.isDead = false;
  }

  init(x, y) {
    this.x = x;
    this.y = y;
    this.hp = this.maxHp;
    this.resonance = 0;
    this.corruption = 0;
    this.corruptionLevel = 0;
    this.ash = 0;
    this.echoFragments = 0;
    this.isDead = false;
    this.canDash = true;
    this.dashCooldownTimer = 0;
    this.invincible = false;
    this.echoPulseReady = true;
    this.skillTimer = 0;
    this.vx = 0;
    this.vy = 0;
  }

  update(dt) {
    if (this.isDead) return;

    this.input.update();
    this._updateTimers(dt);
    this._handleMovement(dt);
    this._handleDash(dt);
    this._handleShooting(dt);
    this._handleSkills(dt);
    this._updateCorruption(dt);
    this._applyVelocity(dt);
    this._updateAnimation(dt);
    this._updateUI();
  }

  _updateTimers(dt) {
    if (this.dashCooldownTimer > 0) this.dashCooldownTimer -= dt;
    if (this.shootTimer > 0) this.shootTimer -= dt;
    if (this.skillTimer > 0) this.skillTimer -= dt;
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= dt;
      if (this.invincibleTimer <= 0) this.invincible = false;
    }
  }

  _handleMovement(dt) {
    if (this.isDashing) return;

    let mx = 0, my = 0;
    if (this.input.isLeft()) mx -= 1;
    if (this.input.isRight()) mx += 1;
    if (this.input.isUp()) my -= 1;
    if (this.input.isDownKey()) my += 1;

    if (mx !== 0 || my !== 0) {
      const len = Math.sqrt(mx * mx + my * my);
      mx /= len;
      my /= len;
    }

    const corruptionSlow = 1 - (this.corruption / this.maxCorruption) * 0.3;
    this.vx = mx * this.speed * corruptionSlow;
    this.vy = my * this.speed * corruptionSlow;

    if (mx > 0) this.facingRight = true;
    if (mx < 0) this.facingRight = false;
  }

  _handleDash(dt) {
    if (this.input.isDash() && this.canDash && !this.isDashing) {
      this.isDashing = true;
      this.canDash = false;
      this.dashTimer = this.dashDuration;
      this.invincible = true;
      this.invincibleTimer = this.dashDuration;
      this.vx = (this.facingRight ? 1 : -1) * this.dashSpeed;
      this.vy = 0;

      // Dash particles
      for (let i = 0; i < 8; i++) {
        this.particles.spawn(
          this.x + this.width / 2,
          this.y + this.height / 2,
          'dash_trail',
          { vx: (Math.random() - 0.5) * 100, vy: (Math.random() - 0.5) * 100, life: 0.3 }
        );
      }
    }

    if (this.isDashing) {
      this.dashTimer -= dt;
      if (this.dashTimer <= 0) {
        this.isDashing = false;
        this.vx *= 0.3;
      }
    }

    if (!this.canDash && this.dashCooldownTimer <= 0) {
      this.canDash = true;
    }
  }

  _handleShooting(dt) {
    if (this.input.isShoot() && this.shootTimer <= 0) {
      this.shootTimer = this.shootInterval;
      const dir = this.facingRight ? 1 : -1;
      const bulletX = this.x + (this.facingRight ? this.width : 0);
      const bulletY = this.y + this.height / 2 - 4;

      this.projectiles.spawnPlayerBullet(bulletX, bulletY, dir * this.bulletSpeed, 0, 'player_bullet');
      this.state = 'shoot';

      // Muzzle flash
      this.particles.spawn(bulletX, bulletY, 'muzzle_flash', { vx: dir * 50, vy: 0, life: 0.1 });
    }
  }

  _handleSkills(dt) {
    if (this.input.isSkill() && this.skillTimer <= 0 && this.resonance >= 20) {
      this.skillTimer = this.skillCooldown;
      this.resonance -= 20;

      // 回响脉冲 - Echo Pulse (knockback + damage)
      const cx = this.x + this.width / 2;
      const cy = this.y + this.height / 2;

      // Visual effect
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        this.particles.spawn(cx, cy, 'echo_pulse', {
          vx: Math.cos(angle) * 200,
          vy: Math.sin(angle) * 200,
          life: 0.4
        });
      }

      // Damage and knockback enemies in range
      this.enemies.applyEchoPulse(cx, cy, 120, 25, 150);

      this.echoPulseReady = false;
      setTimeout(() => { this.echoPulseReady = true; }, 2000);
    }
  }

  _updateCorruption(dt) {
    // Corruption increases slowly over time and from enemy hits
    if (this.corruption > 0) {
      this.corruption -= 2 * dt; // Slowly decay
    }
    this.corruption = Math.max(0, this.corruption);

    // Update visual corruption level
    const ratio = this.corruption / this.maxCorruption;
    if (ratio > 0.75) this.corruptionLevel = 3;
    else if (ratio > 0.5) this.corruptionLevel = 2;
    else if (ratio > 0.25) this.corruptionLevel = 1;
    else this.corruptionLevel = 0;

    // Update overlay opacity
    document.getElementById('corruption-overlay').style.opacity = ratio * 0.6;
  }

  _applyVelocity(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  _updateAnimation(dt) {
    if (this.isDashing) {
      this.state = 'dash';
    } else if (Math.abs(this.vx) > 10 || Math.abs(this.vy) > 10) {
      this.state = 'run';
    } else {
      this.state = 'idle';
    }

    this.frameTimer += dt;
    if (this.frameTimer > 0.1) {
      this.frameTimer = 0;
      this.frame = (this.frame + 1) % 4;
    }
  }

  _updateUI() {
    const hpPct = (this.hp / this.maxHp) * 100;
    const echoPct = (this.resonance / this.maxResonance) * 100;
    document.getElementById('hp-fill').style.width = hpPct + '%';
    document.getElementById('echo-fill').style.width = echoPct + '%';

    const indicator = document.getElementById('resonance-indicator');
    if (this.resonance >= 20) {
      indicator.textContent = '[K] 回响脉冲 READY';
      indicator.style.color = '#00d4ff';
    } else {
      indicator.textContent = `RESONANCE: ${Math.floor(this.resonance)}/${this.maxResonance}`;
      indicator.style.color = '#7b2cbf';
    }
  }

  takeDamage(amount) {
    if (this.invincible) return;
    this.hp -= amount;
    this.corruption += amount * 0.5;
    this.invincible = true;
    this.invincibleTimer = 0.5;

    // Screen shake and particles
    this.particles.spawn(this.x + this.width / 2, this.y + this.height / 2, 'hit', {
      vx: 0, vy: 0, life: 0.3
    });

    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
    }
  }

  addResonance(amount) {
    this.resonance = Math.min(this.resonance + amount, this.maxResonance);
  }

  addAsh(amount) {
    this.ash += amount;
  }

  render(ctx) {
    ctx.save();
    const alpha = this.invincible ? (Math.sin(performance.now() * 0.02) > 0 ? 1 : 0.3) : 1;
    ctx.globalAlpha = alpha;

    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(cx, this.y + this.height, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.save();
    if (!this.facingRight) {
      ctx.translate(cx * 2, 0);
      ctx.scale(-1, 1);
    }

    // Corruption visual effects
    const corruptionColor = this.corruptionLevel > 0 ? `hsl(270, 80%, ${50 + this.corruptionLevel * 10}%)` : '#ff6b35';

    // Legs (simple)
    ctx.fillStyle = '#2a2a3e';
    ctx.fillRect(-8, 12, 7, 16);
    ctx.fillRect(1, 12, 7, 16);

    // Body
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(-12, -8, 24, 22);

    // Armor plate
    ctx.fillStyle = '#3a3a5e';
    ctx.fillRect(-10, -6, 20, 10);

    // Head
    ctx.fillStyle = '#2a2a3e';
    ctx.fillRect(-8, -22, 16, 16);

    // Visor (回响能量色)
    ctx.fillStyle = this.facingRight ? corruptionColor : '#ff6b35';
    ctx.fillRect(-6, -18, 12, 5);

    // Echo collector (backpack glow)
    if (this.resonance > 0) {
      ctx.fillStyle = `rgba(0, 212, 255, ${this.resonance / this.maxResonance * 0.8})`;
      ctx.beginPath();
      ctx.arc(-14, 0, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Corruption veins
    if (this.corruptionLevel > 0) {
      ctx.strokeStyle = `rgba(123, 44, 191, ${this.corruption / this.maxCorruption})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-6, -10);
      ctx.lineTo(-10, 0);
      ctx.lineTo(-6, 10);
      ctx.stroke();
    }

    ctx.restore();
    ctx.restore();
  }
}

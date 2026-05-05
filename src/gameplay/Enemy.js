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
    this.shootInterval = config.shootInterval || 0;
    this.isStealth = config.isStealth || false;
    this.disruptsSkills = config.disruptsSkills || false;
    this.isArcing = config.isArcing || false;
    this.isGuardian = config.isGuardian || false;
    this.splitsInto = config.splitsInto || 0;
    this.explosionRadius = config.explosionRadius || 0;
    this.hasShield = config.hasShield || false;

    this.vx = 0;
    this.vy = 0;
    this.facingRight = true;
    this.state = 'idle';
    this.stateTimer = 0;
    this.attackTimer = 0;
    this.attackCooldown = 1.0;
    this.isDead = false;

    // AI state
    this.targetX = 0;
    this.targetY = 0;
    this.aiState = 'wander';
    this.wanderTimer = 0;
    this.aggroRange = 200;
    this._stealthAlpha = 1.0;
    this._guardianDormant = this.isGuardian;
    this._hasSplit = false;
    this._shieldUp = this.hasShield;
    this._hackerDisruptTimer = 0;
    this._explosionTriggered = false;

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
    if (this._hackerDisruptTimer > 0) this._hackerDisruptTimer -= dt;

    // Boss special AI (M4+ bosses)
    if (this._bossUpdate) {
      this._bossUpdate(dt, this._gameRef);
    } else {
      this._updateAI(dt);
      this._applyVelocity(dt);
      this._checkAttack(dt);
    }
  }

  _updateAI(dt) {
    const speedMod = 1;
    const moveSpeed = this.speed * speedMod;

    // Guardian: dormant until player approaches
    if (this._guardianDormant) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        this._guardianDormant = false;
        // Activation particles
        if (this.particles) {
          for (let i = 0; i < 10; i++) {
            this.particles.spawn(this.x, this.y, 'enemy_death', {
              vx: (Math.random() - 0.5) * 100, vy: -Math.random() * 80,
              life: 0.4, color: this.color
            });
          }
        }
      }
      return; // Stay dormant
    }

    // Stalker: stealth behavior
    if (this.isStealth) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        // Ambush! Reveal and attack
        this._stealthAlpha = 1.0;
        this.aiState = 'chase';
      } else {
        // Stay stealthy
        this._stealthAlpha = 0.25;
        this.aiState = 'wander';
        this.wanderTimer += dt;
        if (this.wanderTimer > 2) {
          this.wanderTimer = 0;
          this.targetX = this.x + (Math.random() - 0.5) * 80;
          this.targetY = this.y + (Math.random() - 0.5) * 60;
        }
      }
    }

    // Hacker: periodically disrupt player skills
    if (this.disruptsSkills && this._gameRef && this._gameRef.player) {
      if (this._hackerDisruptTimer <= 0) {
        this._hackerDisruptTimer = 5.0; // Re-check every 5s
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.attackRange) {
          this._gameRef.player._skillDisabled = true;
          this._gameRef.player._skillDisabledTimer = 2.5;
          // Visual disruption effect
          if (this.particles) {
            for (let i = 0; i < 8; i++) {
              this.particles.spawn(
                this._gameRef.player.x + (Math.random() - 0.5) * 30,
                this._gameRef.player.y + (Math.random() - 0.5) * 30,
                'enemy_death',
                { vx: 0, vy: -30, life: 0.4, color: '#00ff88' }
              );
            }
          }
        }
      }
    }

    // Core Fusion Drone: split when low HP
    if (this.splitsInto > 0 && !this._hasSplit && this.hp < this.maxHp * 0.5) {
      this._hasSplit = true;
      if (this._gameRef && this._gameRef.enemies) {
        for (let i = 0; i < this.splitsInto; i++) {
          const offsetX = (i === 0 ? -1 : 1) * 40;
          const drone = this._gameRef.enemies.spawn('void_specter', this.x + offsetX, this.y - 30);
          if (drone) {
            drone.hp = 30;
            drone.maxHp = 30;
            drone.color = '#ff88ff';
            drone.size = 18;
          }
        }
        // Split explosion
        if (this.particles) {
          for (let i = 0; i < 15; i++) {
            this.particles.spawn(this.x, this.y, 'enemy_death', {
              vx: (Math.random() - 0.5) * 200, vy: (Math.random() - 0.5) * 200,
              life: 0.5, color: '#ff88ff'
            });
          }
        }
      }
    }

    // Standard AI states
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
    // Turret doesn't move
    if (this.speed === 0) {
      this.vx = 0;
      this.vy = 0;
      return;
    }
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

    // Bomber: explodes when close
    if (this.type === 'bomber' && dist < this.attackRange && !this._explosionTriggered) {
      this._explosionTriggered = true;
      this._doExplosion();
      return;
    }

    if (dist < this.attackRange) {
      this.attack();
      this.attackTimer = 0;
    }
  }

  _doExplosion() {
    // Explosion visual + damage in radius
    if (this.particles) {
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 50 + Math.random() * 150;
        this.particles.spawn(this.x, this.y, 'enemy_death', {
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 0.5, color: '#ff4400'
        });
      }
    }
    // Damage player if in radius
    if (this._gameRef && this._gameRef.player) {
      const dx = this._gameRef.player.x - this.x;
      const dy = this._gameRef.player.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.explosionRadius) {
        const dmg = this.explosionRadius > 0 ? 30 : this.damage;
        if (this._gameRef.player.takeDamage) {
          this._gameRef.player.takeDamage(dmg);
        }
        // Knockback
        const angle = Math.atan2(dy, dx);
        const force = 200;
        this._gameRef.player.vx += Math.cos(angle) * force;
        this._gameRef.player.vy += Math.sin(angle) * force;
      }
    }
    this.isDead = true;
  }

  attack() {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Ranged attack (base)
    if (this.type === 'ranged' || this.type === 'drifter' || this.type === 'tide_caller' ||
        this.type === 'chronofrog' || this.type === 'temporal_rift' || this.type === 'void_specter' ||
        this.type === 'turret' || this.type === 'hacker' || this.type === 'core_fusion_drone' ||
        this.type === 'elite_mutant') {
      const dirX = dx / dist;
      const dirY = dy / dist;

      if (this.type === 'artillery') {
        // Arcing projectile
        this.projectiles.spawnEnemyBullet(
          this.x, this.y - 10,
          dirX * 180, -200, // Upward arc
          this.damage,
          true // arcing flag
        );
      } else if (this.type === 'turret' || this.type === 'hacker') {
        this.projectiles.spawnEnemyBullet(
          this.x, this.y,
          dirX * 200, dirY * 200,
          this.damage
        );
      } else if (this.shootInterval > 0) {
        const bulletSpeed = 160 + (this.type === 'elite_mutant' ? 60 : 0);
        this.projectiles.spawnEnemyBullet(
          this.x, this.y,
          dirX * bulletSpeed, dirY * bulletSpeed,
          this.damage
        );
      }
    }

    // Melee attacks
    if (this.type === 'scavenger' || this.type === 'patroller' || this.type === 'ripper' ||
        this.type === 'abyssal_crawler' || this.type === 'void_wraith' || this.type === 'echo_shade' ||
        this.type === 'stalker' || this.type === 'shield') {
      // Direct damage on contact
      if (this._gameRef && this._gameRef.player && dist < this.attackRange) {
        if (this._gameRef.player.takeDamage) {
          this._gameRef.player.takeDamage(this.damage);
        }
        // Shield: blocks and reflects if player attacks from front
        if (this._shieldUp && this.hasShield) {
          const playerFacingRight = this._gameRef.player.facingRight || false;
          const enemyFacingRight = dx > 0;
          if (playerFacingRight === enemyFacingRight) {
            // Attack reflected
            if (this._gameRef.player.takeDamage) {
              this._gameRef.player.takeDamage(5);
            }
          }
        }
      }
    }
  }

  takeDamage(amount) {
    // Shield blocks frontal damage
    if (this._shieldUp && this.hasShield) {
      // Check if attack is from front
      if (this._gameRef && this._gameRef.player) {
        const dx = this._gameRef.player.x - this.x;
        const playerFacingRight = this._gameRef.player.facingRight || false;
        const enemyFacingRight = dx > 0;
        if (playerFacingRight === enemyFacingRight) {
          // Shield blocks - slight knockback
          this._gameRef.player.vx -= Math.sign(dx) * 50;
          amount = Math.max(1, amount * 0.15); // 85% reduction
          if (this.particles) {
            for (let i = 0; i < 4; i++) {
              this.particles.spawn(this.x, this.y, 'enemy_death', {
                vx: (Math.random() - 0.5) * 80, vy: -Math.random() * 60,
                life: 0.3, color: '#cc8800'
              });
            }
          }
        }
      }
    }
    this.hp -= amount;
    this.hitFlash = 1;

    if (this.hp <= 0) {
      this.isDead = true;
    }
  }

  setTarget(x, y) {
    this.targetX = x;
    this.targetY = y;
    const dx = x - this.x;
    const dy = y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > this.aggroRange * 0.5) {
      this.aiState = 'chase';
    }

    // Bomber: always chase aggressively
    if (this.type === 'bomber') {
      this.aiState = 'chase';
    }

    // Turret: always chase if player in range
    if (this.type === 'turret' && dist < this.attackRange) {
      this.aiState = 'chase';
    }
  }

  render(ctx) {
    // Boss phase label
    if (this._bossRender) {
      this._bossRender(ctx);
    }

    ctx.save();

    // Stealth alpha
    if (this.isStealth && this._stealthAlpha < 1) {
      ctx.globalAlpha = this._stealthAlpha;
    }

    // Guardian dormant visual
    if (this._guardianDormant) {
      ctx.globalAlpha = 0.3;
    }

    // Shield visual
    if (this._shieldUp && this.hasShield) {
      // Draw shield in front
      const shieldX = this.x + (this.facingRight ? this.size / 2 + 5 : -this.size / 2 - 5);
      ctx.fillStyle = 'rgba(200, 150, 0, 0.6)';
      ctx.beginPath();
      ctx.arc(shieldX, this.y, 14, -Math.PI / 2, Math.PI / 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 200, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(shieldX, this.y, 10, -Math.PI / 2, Math.PI / 2);
      ctx.fill();
    }

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + this.size / 2, this.size / 2, this.size / 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    const flashColor = this.hitFlash > 0 ? '#fff' : this.color;
    ctx.fillStyle = flashColor;

    // Stalker glow when revealed
    if (this.isStealth && this._stealthAlpha > 0.8) {
      ctx.shadowColor = '#00ff44';
      ctx.shadowBlur = 12;
    } else {
      ctx.shadowColor = '#7b2cbf';
      ctx.shadowBlur = 10 + Math.sin(performance.now() * 0.005) * 5;
    }

    // Guardian pulsing dormant indicator
    if (this._guardianDormant) {
      ctx.globalAlpha = 0.2 + Math.sin(performance.now() * 0.003) * 0.1;
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Bomber: pulsing red glow
    if (this.type === 'bomber') {
      ctx.save();
      ctx.globalAlpha = 0.3 + Math.sin(performance.now() * 0.01) * 0.15;
      ctx.fillStyle = '#ff2200';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size / 2 + 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Hacker: green circuit lines
    if (this.disruptsSkills) {
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2 + performance.now() * 0.001;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.cos(angle) * (this.size / 2 + 4), this.y + Math.sin(angle) * (this.size / 2 + 4));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Artillery: dark blue with muzzle glow
    if (this.isArcing) {
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = '#0044ff';
      ctx.beginPath();
      ctx.arc(this.x, this.y - this.size / 2 - 5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Elite mutant: dual-eye glow
    if (this.type === 'elite_mutant') {
      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size / 2 + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Guardian dormant ring
    if (this.isGuardian) {
      ctx.strokeStyle = '#ff0088';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3 + Math.sin(performance.now() * 0.004) * 0.2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size / 2 + 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Core fusion: orbiting ring
    if (this.type === 'core_fusion_drone') {
      const ringAngle = performance.now() * 0.003;
      ctx.strokeStyle = '#ff88ff';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size / 2 + 8, ringAngle, ringAngle + Math.PI * 1.5);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

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

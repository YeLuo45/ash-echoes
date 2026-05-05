// BossBehaviors.js — Special AI for M4 Bosses
// Extends Enemy instances with phase-based and special-attack logic

/**
 * Boss 1: 废墟之王 (Ruins King) — Ch4
 * Abilities: Earthquake Shockwave | Summon Minions | Spin Charge
 */
export function applyRuinsKingBehavior(enemy, game) {
  enemy._bossPhase = 'idle';     // idle | spin | quake | summon
  enemy._phaseTimer = 0;
  enemy._actionTimer = 0;
  enemy._spinAngle = 0;
  enemy._originalX = enemy.x;
  enemy._originalY = enemy.y;
  enemy._isCharging = false;

  const IDLE_DURATION = 2.5;
  const QUAKE_DURATION = 1.8;
  const SPIN_DURATION = 2.0;
  const SUMMON_COOLDOWN = 8.0;

  enemy._bossUpdate = function(dt, game) {
    this._phaseTimer += dt;
    this._actionTimer += dt;

    const distToPlayer = Math.hypot(game.player.x - this.x, game.player.y - this.y);

    if (this._bossPhase === 'idle') {
      // Chase player slowly
      if (distToPlayer > 60) {
        const angle = Math.atan2(game.player.y - this.y, game.player.x - this.x);
        this.vx = Math.cos(angle) * this.speed * 0.4;
        this.vy = Math.sin(angle) * this.speed * 0.4;
      } else {
        this.vx *= 0.85;
        this.vy *= 0.85;
      }

      // Transition to action
      if (this._phaseTimer >= IDLE_DURATION) {
        this._phaseTimer = 0;
        const roll = Math.random();
        if (roll < 0.4) {
          this._bossPhase = 'spin';
        } else if (roll < 0.7) {
          this._bossPhase = 'quake';
        } else {
          this._bossPhase = 'summon';
        }
      }
    } else if (this._bossPhase === 'spin') {
      // Spin charge: rapid circular movement then dash at player
      this._spinAngle += dt * 6;
      const radius = 120;
      const cx = this._originalX;
      const cy = this._originalY - 80;

      if (this._spinAngle < Math.PI * 3) {
        // Circular orbit
        this.x = cx + Math.cos(this._spinAngle) * radius;
        this.y = cy + Math.sin(this._spinAngle) * radius;
        this.vx = 0;
        this.vy = 0;

        // Trail particles
        game.particles.spawn(this.x, this.y, 'enemy_death', {
          vx: (Math.random() - 0.5) * 80,
          vy: (Math.random() - 0.5) * 80,
          life: 0.4,
          color: '#ff4400'
        });
      } else {
        // Dash toward player
        const angle = Math.atan2(game.player.y - this.y, game.player.x - this.x);
        this.vx = Math.cos(angle) * 380;
        this.vy = Math.sin(angle) * 380;
      }

      if (this._phaseTimer >= SPIN_DURATION) {
        this._bossPhase = 'idle';
        this._phaseTimer = 0;
        this._spinAngle = 0;
        this._originalX = this.x;
        this._originalY = this.y;
      }
    } else if (this._bossPhase === 'quake') {
      // Earthquake: teleport/shockwave every 0.4s
      if (this._spinAngle === 0) {
        // Wind-up: jump up
        this.vy = -200;
        this._spinAngle = 1; // flag set
      }

      if (this.y >= 400 && this._spinAngle === 1) {
        // Land and fire shockwave
        this.y = 400;
        this._spinAngle = 2;
        // Screen shake effect via camera
        if (game.camera && game.camera.shake) game.camera.shake(0.5, 8);
        // Damage + knockback all enemies in radius
        const radius = 300;
        const cx = this.x;
        const cy = this.y;
        // Push player
        const pdx = game.player.x - cx;
        const pdy = game.player.y - cy;
        const pdist = Math.hypot(pdx, pdy);
        if (pdist < radius) {
          const angle = Math.atan2(pdy, pdx);
          const force = (1 - pdist / radius) * 400;
          game.player.vx += Math.cos(angle) * force;
          game.player.vy += Math.sin(angle) * force;
          game.player.takeDamage && game.player.takeDamage(25);
        }
        // Ground crack visual
        for (let i = 0; i < 20; i++) {
          game.particles.spawn(cx + (Math.random() - 0.5) * 200, cy,
            'enemy_death', {
              vx: (Math.random() - 0.5) * 300,
              vy: -Math.random() * 200,
              life: 0.6,
              color: '#aa3300'
            });
        }
      }

      if (this._phaseTimer >= QUAKE_DURATION) {
        this._bossPhase = 'idle';
        this._phaseTimer = 0;
        this._spinAngle = 0;
      }
    } else if (this._bossPhase === 'summon') {
      // Stand still and summon 3 minions
      this.vx *= 0.8;
      this.vy *= 0.8;

      if (this._phaseTimer >= 1.0 && this._actionTimer < 3.0) {
        this._actionTimer = 999; // one-shot
        const spawnPoints = [
          { x: this.x - 200, y: 460 },
          { x: this.x + 200, y: 460 },
          { x: this.x, y: 300 },
        ];
        for (const sp of spawnPoints) {
          game.enemies.spawn('scavenger', sp.x, sp.y);
          game.particles.spawn(sp.x, sp.y, 'enemy_death', {
            vx: 0, vy: -50,
            life: 0.5,
            color: '#ff6600'
          });
        }
      }

      if (this._phaseTimer >= SUMMON_COOLDOWN) {
        this._bossPhase = 'idle';
        this._phaseTimer = 0;
        this._actionTimer = 0;
      }
    }
  };

  enemy._bossRender = function(ctx) {
    // Phase indicator above boss HP bar
    if (this._showPhaseLabel) {
      ctx.fillStyle = '#ff6600';
      ctx.font = 'bold 11px Courier New';
      ctx.textAlign = 'center';
      const labels = { idle: '⚔ 待机', spin: '🔄 旋转冲锋', quake: '💥 地震', summon: '👥 召唤' };
      ctx.fillText(labels[this._bossPhase] || '', this.x, this.y - this.size / 2 - 25);
      ctx.textAlign = 'left';
    }
  };

  // Expose phase label in render
  enemy._showPhaseLabel = true;
}

/**
 * Boss 2: 基地指挥官 (Base Commander) — Ch5
 * Abilities: Summon Turrets | EMP (block dodge 5s) | Tactical Retreat
 */
export function applyBaseCommanderBehavior(enemy, game) {
  enemy._bossPhase = 'idle';
  enemy._phaseTimer = 0;
  enemy._actionTimer = 0;
  enemy._summonedTurrets = [];
  enemy._isRetreating = false;
  enemy._retreatPos = { x: 0, y: 0 };
  enemy._turretCooldown = 0;
  enemy._empCooldown = 0;
  enemy._originalX = enemy.x;
  enemy._empActive = false;

  const IDLE_DURATION = 2.0;
  const TURRET_COOLDOWN = 10.0;
  const EMP_COOLDOWN = 15.0;
  const RETREAT_DURATION = 2.5;

  // Give player EMP debuff flag if in range
  function applyEMP(game) {
    if (!game.player._empDisabled) {
      game.player._empDisabled = true;
      game.player._empTimer = 5.0;
      // Visual flash on player
      for (let i = 0; i < 15; i++) {
        game.particles.spawn(
          game.player.x + (Math.random() - 0.5) * 40,
          game.player.y + (Math.random() - 0.5) * 40,
          'enemy_death',
          { vx: (Math.random() - 0.5) * 100, vy: -Math.random() * 80, life: 0.5, color: '#00ff00' }
        );
      }
    }
  }

  enemy._bossUpdate = function(dt, game) {
    this._phaseTimer += dt;
    this._turretCooldown += dt;
    this._empCooldown += dt;

    const distToPlayer = Math.hypot(game.player.x - this.x, game.player.y - this.y);

    // EMP effect on player (runs every frame while active)
    if (game.player._empDisabled) {
      game.player._empTimer -= dt;
      if (game.player._empTimer <= 0) {
        game.player._empDisabled = false;
        game.player._empTimer = 0;
      }
      // During EMP: disable dash
      game.player.canDash = false;
    } else {
      game.player.canDash = true;
    }

    if (this._bossPhase === 'idle') {
      // Slowly approach player
      if (distToPlayer > 100) {
        const angle = Math.atan2(game.player.y - this.y, game.player.x - this.x);
        this.vx = Math.cos(angle) * this.speed * 0.35;
        this.vy = Math.sin(angle) * this.speed * 0.35;
      } else {
        this.vx *= 0.85;
        this.vy *= 0.85;
      }

      // Trigger special actions
      if (this._phaseTimer >= IDLE_DURATION) {
        this._phaseTimer = 0;
        const roll = Math.random();

        if (this._turretCooldown >= TURRET_COOLDOWN && roll < 0.4) {
          this._bossPhase = 'turret';
          this._turretCooldown = 0;
        } else if (this._empCooldown >= EMP_COOLDOWN && roll < 0.7) {
          this._bossPhase = 'emp';
        } else {
          this._bossPhase = 'retreat';
        }
      }
    } else if (this._bossPhase === 'turret') {
      this.vx *= 0.7;
      this.vy *= 0.7;

      if (this._phaseTimer >= 0.5 && this._actionTimer === 0) {
        this._actionTimer = 1;
        // Summon 2 turrets
        const positions = [
          { x: this.x - 250, y: 460 },
          { x: this.x + 250, y: 460 },
        ];
        for (const pos of positions) {
          const turret = game.enemies.spawn('patroller', pos.x, pos.y);
          if (turret) {
            turret.hp = 80;
            turret.maxHp = 80;
            turret.speed = 0;
            turret._isTurret = true;
            turret.color = '#44ff00';
          }
          this._summonedTurrets.push(pos);
          game.particles.spawn(pos.x, pos.y, 'enemy_death', {
            vx: 0, vy: -60, life: 0.5, color: '#44ff00'
          });
        }
      }

      if (this._phaseTimer >= 3.0) {
        this._bossPhase = 'idle';
        this._phaseTimer = 0;
        this._actionTimer = 0;
      }
    } else if (this._bossPhase === 'emp') {
      // EMP blast — ranged AOE
      this.vx *= 0.5;
      this.vy *= 0.5;

      if (this._phaseTimer >= 0.8 && !this._empFired) {
        this._empFired = true;
        applyEMP(game);

        // Visual EMP wave
        const cx = this.x;
        const cy = this.y;
        for (let i = 0; i < 30; i++) {
          const angle = (i / 30) * Math.PI * 2;
          game.particles.spawn(cx, cy, 'enemy_death', {
            vx: Math.cos(angle) * 200,
            vy: Math.sin(angle) * 200,
            life: 0.7,
            color: '#00ff00'
          });
        }
      }

      if (this._phaseTimer >= 2.5) {
        this._bossPhase = 'idle';
        this._phaseTimer = 0;
        this._actionTimer = 0;
        this._empFired = false;
        this._empCooldown = 0;
      }
    } else if (this._bossPhase === 'retreat') {
      // Teleport to a safe platform and regenerate
      if (this._phaseTimer <= 0.1) {
        this._retreatPos = { x: 500 + Math.random() * 400, y: 380 };
        // Teleport particles at origin
        for (let i = 0; i < 20; i++) {
          game.particles.spawn(this.x, this.y, 'enemy_death', {
            vx: (Math.random() - 0.5) * 150,
            vy: (Math.random() - 0.5) * 150,
            life: 0.5,
            color: '#4444ff'
          });
        }
        this.x = this._retreatPos.x;
        this.y = this._retreatPos.y;
        // Particles at destination
        for (let i = 0; i < 20; i++) {
          game.particles.spawn(this.x, this.y, 'enemy_death', {
            vx: (Math.random() - 0.5) * 150,
            vy: (Math.random() - 0.5) * 150,
            life: 0.5,
            color: '#4444ff'
          });
        }
      }

      // Regenerate slowly while retreating
      if (this.hp < this.maxHp) {
        this.hp = Math.min(this.maxHp, this.hp + 30 * game.deltaTime);
      }

      if (this._phaseTimer >= RETREAT_DURATION) {
        this._bossPhase = 'idle';
        this._phaseTimer = 0;
      }
    }
  };

  enemy._bossRender = function(ctx) {
    if (this._showPhaseLabel) {
      ctx.fillStyle = '#44ff00';
      ctx.font = 'bold 11px Courier New';
      ctx.textAlign = 'center';
      const labels = { idle: '⚔ 待机', turret: '🗼 召唤炮台', emp: '⚡ 电磁脉冲', retreat: '💨 战术撤退' };
      ctx.fillText(labels[this._bossPhase] || '', this.x, this.y - this.size / 2 - 25);
      ctx.textAlign = 'left';
    }
    // EMP active indicator on player
    if (this._empActive && this._empTimer > 0) {
      ctx.fillStyle = 'rgba(0,255,0,0.15)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };

  enemy._showPhaseLabel = true;
  enemy._empActive = false;
  enemy._empTimer = 0;
}

/**
 * Boss 3: 核心意志 (Core Will) — Ch6
 * Abilities: 3-Phase Loop — Melee → Ranged → Berserk
 * Phase 1 (Melee): High-speed chase, heavy melee attacks
 * Phase 2 (Ranged): Teleports to center, fires bullet patterns
 * Phase 3 (Berserk): HP < 30%, all attacks enhanced, faster
 */
export function applyCoreWillBehavior(enemy, game) {
  enemy._bossPhase = 'melee';     // melee | ranged | berserk
  enemy._phaseTimer = 0;
  enemy._actionTimer = 0;
  enemy._bossHPThreshold = enemy.maxHp; // Track phase transition
  enemy._berserkTriggered = false;
  enemy._rangedTeleported = false;
  enemy._bulletPattern = 0;

  const MELEE_DURATION = 6.0;
  const RANGED_DURATION = 5.0;
  const PHASE_TRANSITION_HP = 0.3; // 30% HP triggers Berserk

  enemy._bossUpdate = function(dt, game) {
    this._phaseTimer += dt;
    this._actionTimer += dt;

    const distToPlayer = Math.hypot(game.player.x - this.x, game.player.y - this.y);

    // Berserk check: when HP falls below threshold
    if (!this._berserkTriggered && this.hp / this.maxHp <= PHASE_TRANSITION_HP) {
      this._berserkTriggered = true;
      this._bossPhase = 'berserk';
      this._phaseTimer = 0;
      this._actionTimer = 0;
      // Visual burst
      for (let i = 0; i < 30; i++) {
        game.particles.spawn(this.x, this.y, 'enemy_death', {
          vx: (Math.random() - 0.5) * 250,
          vy: (Math.random() - 0.5) * 250,
          life: 0.8,
          color: '#ffd700'
        });
      }
    }

    if (this._bossPhase === 'melee') {
      // Fast chase + melee attack
      const speed = this._berserkTriggered ? this.speed * 1.6 : this.speed;
      if (distToPlayer > 50) {
        const angle = Math.atan2(game.player.y - this.y, game.player.x - this.x);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
      } else {
        // Melee attack burst
        if (this._actionTimer >= 1.2) {
          this._actionTimer = 0;
          const angle = Math.atan2(game.player.y - this.y, game.player.x - this.x);
          game.projectiles.spawnEnemyBullet(
            this.x, this.y,
            Math.cos(angle) * 250, Math.sin(angle) * 250,
            this.damage
          );
          // Close-range impact particles
          for (let i = 0; i < 6; i++) {
            game.particles.spawn(this.x, this.y, 'enemy_death', {
              vx: (Math.random() - 0.5) * 150,
              vy: (Math.random() - 0.5) * 150,
              life: 0.3,
              color: '#ffd700'
            });
          }
        }
        this.vx *= 0.7;
        this.vy *= 0.7;
      }

      if (this._phaseTimer >= MELEE_DURATION) {
        this._bossPhase = 'ranged';
        this._phaseTimer = 0;
        this._actionTimer = 0;
        this._rangedTeleported = false;
      }
    } else if (this._bossPhase === 'ranged') {
      // Teleport to center + fire pattern
      if (!this._rangedTeleported) {
        this._rangedTeleported = true;
        const cx = 1200;
        const cy = 380;
        // Disappear particles
        for (let i = 0; i < 20; i++) {
          game.particles.spawn(this.x, this.y, 'enemy_death', {
            vx: (Math.random() - 0.5) * 200,
            vy: (Math.random() - 0.5) * 200,
            life: 0.5,
            color: '#ffd700'
          });
        }
        this.x = cx;
        this.y = cy;
        // Appear particles
        for (let i = 0; i < 20; i++) {
          game.particles.spawn(cx, cy, 'enemy_death', {
            vx: (Math.random() - 0.5) * 200,
            vy: (Math.random() - 0.5) * 200,
            life: 0.5,
            color: '#ffd700'
          });
        }
      }

      this.vx *= 0.8;
      this.vy *= 0.8;

      // Fire bullet patterns every 0.5s
      if (this._actionTimer >= 0.5) {
        this._actionTimer = 0;
        this._bulletPattern = (this._bulletPattern + 1) % 3;
        const numBullets = this._berserkTriggered ? 8 : 5;
        for (let i = 0; i < numBullets; i++) {
          const angle = (i / numBullets) * Math.PI * 2 + this._bulletPattern * 0.3;
          const spd = this._berserkTriggered ? 220 : 160;
          game.projectiles.spawnEnemyBullet(this.x, this.y,
            Math.cos(angle) * spd, Math.sin(angle) * spd,
            this.damage * 0.7);
        }
      }

      if (this._phaseTimer >= RANGED_DURATION) {
        this._bossPhase = this._berserkTriggered ? 'berserk' : 'melee';
        this._phaseTimer = 0;
        this._actionTimer = 0;
      }
    } else if (this._bossPhase === 'berserk') {
      // Combined melee + ranged, faster, more aggressive
      const berserkSpeed = this.speed * 1.8;

      if (distToPlayer > 80) {
        const angle = Math.atan2(game.player.y - this.y, game.player.x - this.x);
        this.vx = Math.cos(angle) * berserkSpeed;
        this.vy = Math.sin(angle) * berserkSpeed;
      } else {
        // More frequent melee hits
        if (this._actionTimer >= 0.6) {
          this._actionTimer = 0;
          const angle = Math.atan2(game.player.y - this.y, game.player.x - this.x);
          game.projectiles.spawnEnemyBullet(
            this.x, this.y,
            Math.cos(angle) * 300, Math.sin(angle) * 300,
            this.damage
          );
          for (let i = 0; i < 8; i++) {
            game.particles.spawn(this.x, this.y, 'enemy_death', {
              vx: (Math.random() - 0.5) * 200,
              vy: (Math.random() - 0.5) * 200,
              life: 0.3,
              color: '#ff0000'
            });
          }
        }
        this.vx *= 0.7;
        this.vy *= 0.7;
      }

      // Occasionally teleport
      if (this._phaseTimer > 4.0 && Math.random() < 0.01) {
        // Blink teleport
        for (let i = 0; i < 15; i++) {
          game.particles.spawn(this.x, this.y, 'enemy_death', {
            vx: (Math.random() - 0.5) * 150,
            vy: (Math.random() - 0.5) * 150,
            life: 0.3,
            color: '#ff0000'
          });
        }
        this.x = 600 + Math.random() * 1200;
        this.y = 300 + Math.random() * 200;
        for (let i = 0; i < 15; i++) {
          game.particles.spawn(this.x, this.y, 'enemy_death', {
            vx: (Math.random() - 0.5) * 150,
            vy: (Math.random() - 0.5) * 150,
            life: 0.3,
            color: '#ff0000'
          });
        }
        this._phaseTimer = 0;
      }
    }
  };

  enemy._bossRender = function(ctx) {
    if (this._showPhaseLabel) {
      const colors = { melee: '#ffd700', ranged: '#9b59b6', berserk: '#ff0000' };
      const labels = { melee: '⚔ 近战', ranged: '🔮 远程', berserk: '💀 狂暴' };
      ctx.fillStyle = colors[this._bossPhase] || '#ffd700';
      ctx.font = 'bold 11px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(labels[this._bossPhase] || '', this.x, this.y - this.size / 2 - 25);
      ctx.textAlign = 'left';
    }
    // Berserk glow
    if (this._bossPhase === 'berserk') {
      ctx.save();
      ctx.globalAlpha = 0.3 + Math.sin(performance.now() * 0.01) * 0.15;
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size / 2 + 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  enemy._showPhaseLabel = true;
}

/**
 * Attach boss behavior to an enemy based on type.
 * Called by EnemyManager when spawning bosses.
 */
export function attachBossBehavior(enemy, game) {
  switch (enemy.type) {
    case 'boss_ruins_king':
      applyRuinsKingBehavior(enemy, game);
      break;
    case 'boss_base_commander':
      applyBaseCommanderBehavior(enemy, game);
      break;
    case 'boss_core_will':
      applyCoreWillBehavior(enemy, game);
      break;
  }
}

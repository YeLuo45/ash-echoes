export class Particle {
  constructor(x, y, type, options = {}) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    this.life = options.life || 0.5;
    this.maxLife = this.life;
    this.color = options.color || '#ff6b35';
    this.size = options.size || 4;
    this.isDead = false;
    this.rotation = options.rotation || 0;
    this.rotationSpeed = options.rotationSpeed || 0;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.life -= dt;
    this.rotation += this.rotationSpeed * dt;
    if (this.life <= 0) this.isDead = true;
  }

  render(ctx) {
    const alpha = this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.type === 'muzzle_flash') {
      ctx.fillStyle = '#ffdd00';
      ctx.beginPath();
      ctx.arc(0, 0, 8 * alpha, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'hit') {
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(15 * alpha, 0);
        ctx.stroke();
        ctx.rotate(Math.PI / 2);
      }
    } else if (this.type === 'enemy_death') {
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size * alpha, this.size * alpha);
    } else if (this.type === 'dash_trail') {
      ctx.fillStyle = '#00d4ff';
      ctx.beginPath();
      ctx.arc(0, 0, 6 * alpha, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'echo_pulse') {
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 3 * alpha;
      ctx.beginPath();
      ctx.arc(0, 0, 10 * (1 - alpha) + 5, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.type === 'resonance_pickup') {
      ctx.fillStyle = '#7b2cbf';
      ctx.beginPath();
      ctx.arc(0, 0, 5 * alpha, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

export class ParticleManager {
  constructor() {
    this.particles = [];
    this.maxParticles = 500;
  }

  spawn(x, y, type, options = {}) {
    if (this.particles.length >= this.maxParticles) {
      this.particles.shift();
    }
    this.particles.push(new Particle(x, y, type, options));
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(dt);
      if (this.particles[i].isDead) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx) {
    for (const p of this.particles) {
      p.render(ctx);
    }
  }
}

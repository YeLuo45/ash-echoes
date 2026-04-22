export class Projectile {
  constructor(x, y, vx, vy, type, owner) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.type = type;
    this.owner = owner;
    this.damage = 10;
    this.radius = 5;
    this.life = 3.0;
    this.isDead = false;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
    if (this.life <= 0) this.isDead = true;
  }

  render(ctx) {
    ctx.save();
    if (this.type === 'player_bullet') {
      ctx.fillStyle = '#ff9f1c';
      ctx.shadowColor = '#ff6b35';
      ctx.shadowBlur = 8;
    } else if (this.type === 'enemy_bullet') {
      ctx.fillStyle = '#7b2cbf';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 8;
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Trail
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 0.03, this.y - this.vy * 0.03);
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = this.radius * 0.8;
    ctx.stroke();
    ctx.restore();
  }
}

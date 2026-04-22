export class UI {
  constructor(player, enemies) {
    this.player = player;
    this.enemies = enemies;
  }

  render(ctx) {
    // Damage vignette
    if (this.player.invincible && this.player.hp < this.player.maxHp * 0.5) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // Enemy count
    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.fillText(`ENEMIES: ${this.enemies.getCount()}`, 10, 70);

    // Ash count
    ctx.fillStyle = '#ff9f1c';
    ctx.fillText(`ASH: ${this.player.ash}`, 10, 85);

    // Corruption warning
    if (this.player.corruptionLevel > 0) {
      ctx.fillStyle = `rgba(123, 44, 191, ${this.player.corruption / this.player.maxCorruption})`;
      ctx.font = 'bold 14px Courier New';
      ctx.fillText(`⚠ 回响侵蚀 Lv.${this.player.corruptionLevel}`, 10, 105);
    }
  }
}

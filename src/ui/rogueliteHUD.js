import { SeededRandom } from '../core/SeededRandom.js';

export class RogueliteHUD {
  constructor() {
    this.currentWave = 1;
    this.maxWaves = 10;
    this.gold = 0;
    this.entropyCrystals = 0;
  }

  update(wave, gold, crystals) {
    this.currentWave = wave;
    this.gold = gold;
    this.entropyCrystals = crystals;
  }

  render(ctx, isDaily, dailySeed) {
    const cw = ctx.canvas.width;

    // Wave counter
    ctx.fillStyle = '#ff6b35';
    ctx.font = 'bold 14px Courier New';
    ctx.fillText(`WAVE ${this.currentWave}/${this.maxWaves}`, 10, 30);

    // Progress bar
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(10, 38, 120, 8);
    ctx.fillStyle = '#ff6b35';
    ctx.fillRect(10, 38, (this.currentWave / this.maxWaves) * 120, 8);

    // Gold
    ctx.fillStyle = '#ff9f1c';
    ctx.font = '12px Courier New';
    ctx.fillText(`ASH: ${this.gold}`, 10, 65);

    // Entropy crystals (if any)
    if (this.entropyCrystals > 0) {
      ctx.fillStyle = '#9b59b6';
      ctx.fillText(`💎 ${this.entropyCrystals}`, 100, 65);
    }

    // Daily challenge indicator
    if (isDaily) {
      ctx.fillStyle = '#9b59b6';
      ctx.font = 'bold 12px Courier New';
      ctx.fillText('⚡ 每日挑战', cw - 120, 30);
      ctx.font = '10px Courier New';
      ctx.fillStyle = '#888';
      ctx.fillText(`Seed: ${dailySeed}`, cw - 120, 48);
    }

    // Room type indicator (for next room)
    ctx.fillStyle = '#888';
    ctx.font = '11px Courier New';
    ctx.fillText('按 ENTER 进入下一房间', cw / 2 - 80, 30);
  }

  renderEventOverlay(ctx, event) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(200, 200, 560, 140);
    ctx.strokeStyle = '#9b59b6';
    ctx.lineWidth = 2;
    ctx.strokeRect(200, 200, 560, 140);

    ctx.fillStyle = '#9b59b6';
    ctx.font = 'bold 16px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('事件!', 480, 230);

    ctx.fillStyle = '#fff';
    ctx.font = '14px Courier New';
    ctx.fillText(event.desc, 480, 265);

    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.fillText('按 ENTER 继续', 480, 320);
    ctx.textAlign = 'left';
  }

  renderVictory(ctx, waveReached, score) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 36px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('挑战完成!', ctx.canvas.width / 2, 180);

    ctx.font = '18px Courier New';
    ctx.fillStyle = '#fff';
    ctx.fillText(`到达波次: ${waveReached}/10`, ctx.canvas.width / 2, 240);
    ctx.fillText(`得分: ${score}`, ctx.canvas.width / 2, 270);

    ctx.fillStyle = '#9b59b6';
    ctx.fillText('按 ENTER 返回主菜单', ctx.canvas.width / 2, 330);
    ctx.textAlign = 'left';
  }
}

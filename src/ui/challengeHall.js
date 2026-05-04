// ChallengeHall UI — Main menu entry point for hardcore challenge modes
export class ChallengeHall {
  constructor(game) {
    this.game = game;
    this.ctx = game.ctx;
    this.W = game.width;
    this.H = game.height;
  }

  show() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(5, 5, 15, 0.98)';
    ctx.fillRect(0, 0, this.W, this.H);

    // Title
    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 32px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('⚔ 硬核挑战模式 ⚔', this.W / 2, 60);

    ctx.fillStyle = '#666';
    ctx.font = '12px Courier New';
    ctx.fillText('BOSSrush · 竞速 · 受苦 · 无伤', this.W / 2, 85);

    const cards = [
      { id: 'bossrush', label: 'BossRush', sub: '连续Boss战 | 无回复 | 失败重置', color: '#ff4444', x: 60 },
      { id: 'speedrun', label: '竞速模式', sub: '计时通关 | 幽灵旁观 | Top10榜', color: '#ff9f1c', x: 310 },
      { id: 'suffering', label: '受苦难度', sub: 'AI增强 | 地形变化 | 全伤增加', color: '#9b59b6', x: 560 },
      { id: 'nohit', label: '无伤挑战', sub: '单Boss选择 | 无伤检测 | 连续5次称号', color: '#00d4ff', x: 810 },
    ];

    for (const c of cards) {
      ctx.fillStyle = 'rgba(20, 20, 35, 0.95)';
      ctx.fillRect(c.x, 110, 220, 260);
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(c.x, 110, 220, 260);

      ctx.fillStyle = c.color;
      ctx.font = 'bold 40px Courier New';
      ctx.fillText(this._iconFor(c.id), c.x + 110, 175);

      ctx.fillStyle = c.color;
      ctx.font = 'bold 18px Courier New';
      ctx.fillText(c.label, c.x + 110, 215);

      ctx.fillStyle = '#888';
      ctx.font = '11px Courier New';
      const subs = c.sub.split(' | ');
      let sy = 245;
      for (const s of subs) {
        ctx.fillText(s, c.x + 110, sy);
        sy += 18;
      }

      ctx.fillStyle = c.color;
      ctx.font = '12px Courier New';
      ctx.fillText('[点击进入]', c.x + 110, 350);
    }

    ctx.fillStyle = '#444';
    ctx.font = '12px Courier New';
    ctx.fillText('[按 ESC 返回主菜单]', this.W / 2, this.H - 30);
    ctx.textAlign = 'left';

    this._clickHandler(cards);
    this._keyHandler();
  }

  _iconFor(id) {
    return { bossrush: '💀', speedrun: '⏱', suffering: '🔥', nohit: '⚡' }[id] || '?';
  }

  _clickHandler(cards) {
    const handler = (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      for (const c of cards) {
        if (mx >= c.x && mx <= c.x + 220 && my >= 110 && my <= 370) {
          this.game.canvas.removeEventListener('click', handler);
          this.game.challengeManager._enterMode(c.id);
          return;
        }
      }
    };
    this.game.canvas.addEventListener('click', handler);
  }

  _keyHandler() {
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', escHandler);
        this.game.showModeSelect();
      }
    };
    document.addEventListener('keydown', escHandler);
  }
}

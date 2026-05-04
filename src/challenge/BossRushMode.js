// BossRushMode — 连续Boss挑战，无回复，失败重置
import { ENEMY_TEMPLATES } from '../gameplay/enemies.js';

export class BossRushMode {
  constructor(game) {
    this.game = game;
    this.ctx = game.ctx;
    this.W = game.width;
    this.H = game.height;

    // Boss queue (from enemies.js)
    this.bossList = [
      { type: 'boss', name: '回响领主', chapter: 1 },
      { type: 'boss_abyss_lord', name: '深渊领主', chapter: 2 },
      { type: 'boss_eternal_guardian', name: '永恒守护者', chapter: 3 },
    ];

    this.currentBossIndex = 0;
    this.attempts = 0;
    this.maxAttempts = 99;
    this.waveCount = this.bossList.length;

    // State
    this.state = 'select'; // select | playing | victory | defeat
    this.hud = null; // { wave, attempts, bossHp }
    this.ghostPlayer = null; // For ghost replay
  }

  enter() {
    this.state = 'select';
    this.currentBossIndex = 0;
    this.attempts = 0;
    this._renderSelect();
  }

  _renderSelect() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(5, 5, 15, 0.98)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 28px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('💀 BossRush — 连续Boss挑战', this.W / 2, 55);

    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.fillText('连续击败3个Boss，无回复，失败重置从头开始', this.W / 2, 80);

    // Boss list preview
    let bx = 120;
    for (let i = 0; i < this.bossList.length; i++) {
      const b = this.bossList[i];
      const tpl = ENEMY_TEMPLATES[b.type];
      ctx.fillStyle = i === 0 ? 'rgba(255, 68, 68, 0.2)' : 'rgba(30, 30, 50, 0.8)';
      ctx.fillRect(bx, 110, 220, 180);
      ctx.strokeStyle = i === 0 ? '#ff4444' : '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, 110, 220, 180);

      ctx.fillStyle = i === 0 ? '#ff4444' : '#555';
      ctx.font = 'bold 16px Courier New';
      ctx.fillText(`第${i + 1}关`, bx + 110, 140);
      ctx.font = '14px Courier New';
      ctx.fillStyle = i === 0 ? '#fff' : '#666';
      ctx.fillText(b.name, bx + 110, 170);

      ctx.fillStyle = '#888';
      ctx.font = '11px Courier New';
      ctx.fillText(`HP: ${tpl.hp}`, bx + 110, 200);
      ctx.fillText(`伤害: ${tpl.damage}`, bx + 110, 218);
      ctx.fillText(`章节 ${b.chapter}`, bx + 110, 236);

      if (i === 0) {
        ctx.fillStyle = '#ff4444';
        ctx.font = '12px Courier New';
        ctx.fillText('▶ 当前', bx + 110, 275);
      } else {
        ctx.fillStyle = '#444';
        ctx.font = '12px Courier New';
        ctx.fillText('🔒 未解锁', bx + 110, 275);
      }
      bx += 240;
    }

    // Rules
    ctx.fillStyle = '#666';
    ctx.font = '11px Courier New';
    ctx.fillText('规则: 无回复 | 死亡重置进度 | 连续击败全部Boss即通关', this.W / 2, 330);

    // Start button
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(340, 360, 280, 70);
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(340, 360, 280, 70);
    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 18px Courier New';
    ctx.fillText('[ 点击开始挑战 ]', this.W / 2, 402);

    ctx.fillStyle = '#444';
    ctx.font = '12px Courier New';
    ctx.fillText('[按 ESC 返回]', this.W / 2, this.H - 30);
    ctx.textAlign = 'left';

    this._selectClick();
  }

  _selectClick() {
    const handler = (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      // Start button
      if (mx >= 340 && mx <= 620 && my >= 360 && my <= 430) {
        this.game.canvas.removeEventListener('click', handler);
        this._startRush();
        return;
      }

      // ESC
      const escH = (ev) => {
        if (ev.key === 'Escape') {
          document.removeEventListener('keydown', escH);
          this.game.canvas.removeEventListener('click', handler);
          this.game.showChallengeHall();
        }
      };
      document.addEventListener('keydown', escH);
    };
    this.game.canvas.addEventListener('click', handler);
  }

  _startRush() {
    this.state = 'playing';
    this.currentBossIndex = 0;
    this.attempts = 0;
    this._loadBossWave();
  }

  _loadBossWave() {
    const boss = this.bossList[this.currentBossIndex];
    const tpl = ENEMY_TEMPLATES[boss.type];

    // Reset player fully
    this.game.player.init(100, 300);
    this.game.player.maxHp = 100;
    this.game.player.hp = 100;

    // Reset level with just the boss
    const levelData = {
      id: `rush_${this.currentBossIndex}`,
      name: boss.name,
      width: 2400,
      height: 800,
      enemies: [{ type: boss.type, x: 2000, y: 380 }],
      platforms: [
        { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
        { x: 200, y: 380, w: 150, h: 20, type: 'platform' },
        { x: 500, y: 300, w: 200, h: 20, type: 'platform' },
        { x: 800, y: 250, w: 150, h: 20, type: 'platform' },
        { x: 1100, y: 350, w: 180, h: 20, type: 'platform' },
        { x: 1400, y: 280, w: 200, h: 20, type: 'platform' },
        { x: 1700, y: 380, w: 150, h: 20, type: 'platform' },
      ],
      collectibles: [],
      shrines: [{ x: 150, y: 460, active: true }],
      portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
    };

    const chapterData = { theme: 'ruins', bgColor1: '#0a0a0f', bgColor2: '#12121a', accentColor: '#ff4444' };
    this.game.level.initFromData(levelData, chapterData);

    this.hud = {
      wave: this.currentBossIndex + 1,
      totalWaves: this.waveCount,
      attempts: this.attempts,
      bossName: boss.name,
      bossMaxHp: tpl.hp,
      bossCurrentHp: tpl.hp,
    };

    this.game.running = true;
    this.game.lastTime = performance.now();
    this.game.mode = 'bossrush';
    requestAnimationFrame((t) => this._loop(t));
  }

  _loop(timestamp) {
    if (!this.game.running || this.state !== 'playing') return;
    const dt = Math.min((timestamp - this.game.lastTime) / 1000, 0.05);
    this.game.lastTime = timestamp;
    this._update(dt);
    this._render();
    requestAnimationFrame((t) => this._loop(t));
  }

  _update(dt) {
    this.game.player.update(dt);
    this.game.enemies.update(dt);
    this.game.projectiles.update(dt);
    this.game.particles.update(dt);
    this.game.level.update(dt);
    this.game.camera.follow(this.game.player.x, this.game.player.y);

    // Update boss HP for HUD
    const boss = this.game.enemies.enemies.find(e => !e.isDead && e.type === this.bossList[this.currentBossIndex].type);
    if (boss) {
      this.hud.bossCurrentHp = Math.max(0, boss.hp);
    }

    // Check win
    if (this.game.enemies.getCount() === 0) {
      this._onBossDefeated();
      return;
    }

    // Check death
    if (this.game.player.isDead) {
      this._onDeath();
    }
  }

  _render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);

    ctx.save();
    const cam = this.game.camera;
    ctx.translate(-cam.x, -cam.y);

    this.game.level.renderBackground(ctx);
    this.game.level.render(ctx);
    this.game.enemies.render(ctx);
    this.game.player.render(ctx);
    this.game.projectiles.render(ctx);
    this.game.particles.render(ctx);

    ctx.restore();

    this._renderHUD();
  }

  _renderHUD() {
    const ctx = this.ctx;
    const h = this.hud;
    if (!h) return;

    // Boss HP bar (top center)
    const barW = 400;
    const barH = 20;
    const barX = (this.W - barW) / 2;
    const barY = 15;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    const hpPct = h.bossMaxHp > 0 ? h.bossCurrentHp / h.bossMaxHp : 0;
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(barX, barY, barW * hpPct, barH);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(`${h.bossName} — ${Math.ceil(h.bossCurrentHp)} / ${h.bossMaxHp}`, this.W / 2, barY + 15);

    // Wave info (top left)
    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 14px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(`BOSS ${h.wave}/${h.totalWaves}`, 15, 30);

    ctx.fillStyle = '#888';
    ctx.font = '11px Courier New';
    ctx.fillText(`尝试次数: ${h.attempts}`, 15, 50);

    // No healing reminder
    ctx.fillStyle = '#9b59b6';
    ctx.font = '11px Courier New';
    ctx.fillText('⚠ 无回复模式', 15, 70);

    ctx.textAlign = 'left';
  }

  _onBossDefeated() {
    this.game.running = false;
    this.currentBossIndex++;

    if (this.currentBossIndex >= this.bossList.length) {
      // All bosses defeated!
      this._renderVictory();
    } else {
      // Next boss
      this._showBossIntro();
    }
  }

  _showBossIntro() {
    const ctx = this.ctx;
    const boss = this.bossList[this.currentBossIndex];
    const tpl = ENEMY_TEMPLATES[boss.type];

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 28px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(`第${this.currentBossIndex + 1}关`, this.W / 2, this.H / 2 - 60);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Courier New';
    ctx.fillText(boss.name, this.W / 2, this.H / 2);

    ctx.fillStyle = '#888';
    ctx.font = '14px Courier New';
    ctx.fillText(`HP: ${tpl.hp}  伤害: ${tpl.damage}`, this.W / 2, this.H / 2 + 35);

    ctx.fillStyle = '#ff4444';
    ctx.font = '14px Courier New';
    ctx.fillText('按 ENTER 继续', this.W / 2, this.H / 2 + 80);
    ctx.textAlign = 'left';

    const handler = (e) => {
      if (e.key === 'Enter') {
        document.removeEventListener('keydown', handler);
        this._loadBossWave();
      }
    };
    document.addEventListener('keydown', handler);
  }

  _onDeath() {
    this.game.running = false;
    this.attempts++;
    this.hud.attempts = this.attempts;
    this._renderDefeat();
  }

  _renderDefeat() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 32px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('挑战失败', this.W / 2, this.H / 2 - 60);

    ctx.fillStyle = '#888';
    ctx.font = '14px Courier New';
    ctx.fillText(`在 "${this.hud.bossName}" 倒下`, this.W / 2, this.H / 2 - 20);
    ctx.fillText(`总尝试次数: ${this.attempts}`, this.W / 2, this.H / 2 + 10);

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(320, this.H / 2 + 40, 320, 60);
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(320, this.H / 2 + 40, 320, 60);
    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 16px Courier New';
    ctx.fillText('[ 点击重试 — 从第1关开始 ]', this.W / 2, this.H / 2 + 78);

    ctx.fillStyle = '#444';
    ctx.font = '12px Courier New';
    ctx.fillText('[按 ESC 返回挑战选择]', this.W / 2, this.H / 2 + 130);
    ctx.textAlign = 'left';

    const handler = (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (mx >= 320 && mx <= 640 && my >= this.H / 2 + 40 && my <= this.H / 2 + 100) {
        document.removeEventListener('click', handler);
        this._startRush();
      }

      if (e.key === 'Escape') {
        document.removeEventListener('click', handler);
        this.game.showChallengeHall();
      }
    };
    this.game.canvas.addEventListener('click', handler);
  }

  _renderVictory() {
    const ctx = this.ctx;
    this.state = 'victory';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 40px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 BOSSRUSH 通关!', this.W / 2, this.H / 2 - 80);

    ctx.fillStyle = '#fff';
    ctx.font = '18px Courier New';
    ctx.fillText('你击败了所有Boss!', this.W / 2, this.H / 2 - 30);

    ctx.fillStyle = '#ff9f1c';
    ctx.font = '16px Courier New';
    ctx.fillText(`总尝试次数: ${this.attempts}`, this.W / 2, this.H / 2 + 10);

    ctx.fillStyle = '#888';
    ctx.font = '14px Courier New';
    ctx.fillText('按 ENTER 返回挑战大厅', this.W / 2, this.H / 2 + 60);
    ctx.textAlign = 'left';

    // Save record
    this._saveRecord();

    const handler = (e) => {
      if (e.key === 'Enter') {
        document.removeEventListener('keydown', handler);
        this.game.showChallengeHall();
      }
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', handler);
        this.game.showChallengeHall();
      }
    };
    document.addEventListener('keydown', handler);
  }

  _saveRecord() {
    const record = {
      attempts: this.attempts,
      timestamp: Date.now(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem('ash_challenge_rush') || '[]');
      existing.push(record);
      existing.sort((a, b) => a.attempts - b.attempts);
      localStorage.setItem('ash_challenge_rush', JSON.stringify(existing.slice(0, 10)));
    } catch (e) { /* ignore */ }
  }

  onDeath() { this._onDeath(); }
  onComplete() { this._renderVictory(); }
}

// NoHitMode — 无伤挑战，单Boss选择，无伤检测，连续5次称号
import { ENEMY_TEMPLATES } from '../gameplay/enemies.js';

export class NoHitMode {
  constructor(game) {
    this.game = game;
    this.ctx = game.ctx;
    this.W = game.width;
    this.H = game.height;

    // Bosses available for no-hit
    this.bossOptions = [
      { type: 'boss', name: '回响领主', chapter: 1, template: ENEMY_TEMPLATES.boss },
      { type: 'boss_abyss_lord', name: '深渊领主', chapter: 2, template: ENEMY_TEMPLATES.boss_abyss_lord },
      { type: 'boss_eternal_guardian', name: '永恒守护者', chapter: 3, template: ENEMY_TEMPLATES.boss_eternal_guardian },
    ];

    this.selectedBossIndex = 0;
    this.state = 'select'; // select | playing | victory | defeat | complete
    this.consecutiveWins = 0; // consecutive no-hit wins
    this.currentWinStreak = 0;
    this.wins = this._loadWins();
    this.totalAttempts = 0;

    // No-hit tracking
    this.wasHitThisRun = false;
    this.timer = 0;
    this.phase = 1; // Phase within boss fight
    this.hud = null;
  }

  enter() {
    this.state = 'select';
    this._renderSelect();
  }

  _loadWins() {
    try {
      return JSON.parse(localStorage.getItem('ash_challenge_nohit') || '{"wins":0,"streak":0}');
    } catch (e) { return { wins: 0, streak: 0 }; }
  }

  _saveWins() {
    try {
      localStorage.setItem('ash_challenge_nohit', JSON.stringify({
        wins: this.wins.wins,
        streak: this.wins.streak,
      }));
    } catch (e) { /* ignore */ }
  }

  _renderSelect() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(5, 5, 15, 0.98)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 28px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ 无伤挑战 — 零伤害通关', this.W / 2, 55);

    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.fillText('选择Boss，被击中则挑战失败，连续5次无伤通关获得称号', this.W / 2, 80);

    // Stats
    ctx.fillStyle = '#555';
    ctx.font = '12px Courier New';
    ctx.fillText(`无伤胜利: ${this.wins.wins} 次 | 当前连胜: ${this.wins.streak}`, this.W / 2, 105);

    // Title ranks
    const ranks = [
      { threshold: 5, label: '无伤大师', color: '#ffd700' },
      { threshold: 10, label: '完美猎人', color: '#00d4ff' },
      { threshold: 20, label: '回响克星', color: '#ff4444' },
    ];
    let rx = 200;
    for (const r of ranks) {
      const achieved = this.wins.wins >= r.threshold;
      ctx.fillStyle = achieved ? r.color : '#333';
      ctx.font = '12px Courier New';
      ctx.fillText(`[${r.label}]`, rx, 130);
      rx += 120;
    }

    // Boss selection
    const cardW = 280;
    let bx = (this.W - (cardW * 3 + 40)) / 2;
    const by = 150;

    for (let i = 0; i < this.bossOptions.length; i++) {
      const b = this.bossOptions[i];
      const isSelected = this.selectedBossIndex === i;

      ctx.fillStyle = isSelected ? 'rgba(0, 212, 255, 0.12)' : 'rgba(20, 20, 35, 0.95)';
      ctx.fillRect(bx + i * (cardW + 20), by, cardW, 200);
      ctx.strokeStyle = isSelected ? '#00d4ff' : '#333';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.strokeRect(bx + i * (cardW + 20), by, cardW, 200);

      ctx.fillStyle = isSelected ? '#00d4ff' : '#888';
      ctx.font = 'bold 16px Courier New';
      ctx.fillText(b.name, bx + i * (cardW + 20) + cardW / 2, by + 35);

      ctx.fillStyle = '#555';
      ctx.font = '11px Courier New';
      ctx.fillText(`章节 ${b.chapter}`, bx + i * (cardW + 20) + cardW / 2, by + 60);

      ctx.fillStyle = '#888';
      ctx.fillText(`HP: ${b.template.hp}`, bx + i * (cardW + 20) + cardW / 2, by + 85);
      ctx.fillText(`伤害: ${b.template.damage}`, bx + i * (cardW + 20) + cardW / 2, by + 103);
      ctx.fillText(`攻击范围: ${b.template.attackRange}`, bx + i * (cardW + 20) + cardW / 2, by + 121);

      if (isSelected) {
        ctx.fillStyle = '#00d4ff';
        ctx.font = '12px Courier New';
        ctx.fillText('▶ 已选择', bx + i * (cardW + 20) + cardW / 2, by + 175);
      }
    }

    // No-hit rules reminder
    ctx.fillStyle = '#ff4444';
    ctx.font = '11px Courier New';
    ctx.fillText('⚠ 规则: 被击中任何一次即失败 | Dash可躲避 | 无回复', this.W / 2, 385);

    // Start button
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(340, 405, 320, 65);
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(340, 405, 320, 65);
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 18px Courier New';
    ctx.fillText('[ 开始无伤挑战 ]', this.W / 2, 447);

    ctx.fillStyle = '#444';
    ctx.font = '12px Courier New';
    ctx.fillText('[按 ESC 返回]', this.W / 2, this.H - 25);
    ctx.textAlign = 'left';

    this._selectClick();
  }

  _selectClick() {
    const handler = (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const cardW = 280;
      let bx = (this.W - (cardW * 3 + 40)) / 2;
      const by = 150;

      for (let i = 0; i < 3; i++) {
        if (mx >= bx + i * (cardW + 20) && mx <= bx + i * (cardW + 20) + cardW && my >= by && my <= by + 200) {
          this.selectedBossIndex = i;
          this._renderSelect();
          return;
        }
      }

      if (mx >= 340 && mx <= 660 && my >= 405 && my <= 470) {
        this.game.canvas.removeEventListener('click', handler);
        this._startChallenge();
        return;
      }

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

  _startChallenge() {
    this.state = 'playing';
    this.wasHitThisRun = false;
    this.timer = 0;
    this.totalAttempts++;

    const boss = this.bossOptions[this.selectedBossIndex];
    const tpl = boss.template;

    // Full reset player
    this.game.player.init(100, 300);
    this.game.player.maxHp = 100;
    this.game.player.hp = 100;
    this.game.player.invincible = false;

    // Level setup
    const levelData = {
      id: `nohit_${this.selectedBossIndex}`,
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

    const chapterData = {
      theme: 'ruins',
      bgColor1: '#0a0a1f',
      bgColor2: '#0a0a2f',
      accentColor: '#00d4ff',
    };

    this.game.level.initFromData(levelData, chapterData);

    this.hud = {
      bossName: boss.name,
      bossMaxHp: tpl.hp,
      bossCurrentHp: tpl.hp,
      wasHit: false,
    };

    this.game.running = true;
    this.game.lastTime = performance.now();
    this.game.mode = 'nohit';
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
    this.timer += dt;

    this.game.player.update(dt);
    this.game.enemies.update(dt);
    this.game.projectiles.update(dt);
    this.game.particles.update(dt);
    this.game.level.update(dt);
    this.game.camera.follow(this.game.player.x, this.game.player.y);

    // Track no-hit: check if player took damage this frame
    if (this.game.player.hp < this.game.player.maxHp && !this.wasHitThisRun) {
      // Player took damage - but check if it's the first frame
      if (this.timer > 0.1) {
        this.wasHitThisRun = true;
        this.hud.wasHit = true;
      }
    }

    // Update boss HP
    const boss = this.game.enemies.enemies.find(e => !e.isDead);
    if (boss) {
      this.hud.bossCurrentHp = Math.max(0, boss.hp);
    }

    // Check win
    if (this.game.enemies.getCount() === 0) {
      this._onBossDefeated();
      return;
    }

    // Check death (failure)
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

    // Boss HP bar
    const barW = 400;
    const barH = 20;
    const barX = (this.W - barW) / 2;
    const barY = 15;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    const hpPct = h.bossMaxHp > 0 ? h.bossCurrentHp / h.bossMaxHp : 0;
    ctx.fillStyle = '#00d4ff';
    ctx.fillRect(barX, barY, barW * hpPct, barH);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(`${h.bossName} — ${Math.ceil(h.bossCurrentHp)} / ${h.bossMaxHp}`, this.W / 2, barY + 15);

    // Timer
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 16px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(`⏱ ${this._fmtTime(this.timer)}`, 15, 30);

    // No-hit status
    if (!h.wasHit) {
      ctx.fillStyle = '#00d4ff';
      ctx.font = 'bold 14px Courier New';
      ctx.fillText('⚡ 无伤进行中', 15, 55);
    } else {
      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 14px Courier New';
      ctx.fillText('✗ 已受伤!', 15, 55);
    }

    // Streak
    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.fillText(`连胜: ${this.wins.streak} | 胜利: ${this.wins.wins}`, 15, 80);

    ctx.textAlign = 'left';
  }

  _fmtTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  }

  _onBossDefeated() {
    this.game.running = false;

    if (!this.wasHitThisRun) {
      // SUCCESS - no hit!
      this.currentWinStreak++;
      this.wins.streak++;
      this.wins.wins++;
      this._saveWins();

      // Check for title unlock
      if (this.wins.streak === 5) {
        this._renderTitleUnlock();
      } else {
        this._renderVictory();
      }
    } else {
      // Hit but still won
      this.currentWinStreak = 0;
      this.wins.streak = 0;
      this._saveWins();
      this._renderDefeat();
    }
  }

  _renderVictory() {
    const ctx = this.ctx;
    this.state = 'victory';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 40px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ 无伤胜利!', this.W / 2, this.H / 2 - 80);

    ctx.fillStyle = '#fff';
    ctx.font = '18px Courier New';
    ctx.fillText(`Boss: ${this.hud.bossName}`, this.W / 2, this.H / 2 - 30);
    ctx.fillText(`用时: ${this._fmtTime(this.timer)}`, this.W / 2, this.H / 2 + 5);

    ctx.fillStyle = '#ffd700';
    ctx.font = '16px Courier New';
    ctx.fillText(`当前连胜: ${this.wins.streak} / 5`, this.W / 2, this.H / 2 + 45);
    if (this.wins.streak < 5) {
      ctx.fillStyle = '#888';
      ctx.font = '12px Courier New';
      ctx.fillText(`再赢 ${5 - this.wins.streak} 次即可获得「无伤大师」称号!`, this.W / 2, this.H / 2 + 75);
    }

    ctx.fillStyle = '#888';
    ctx.font = '14px Courier New';
    ctx.fillText('按 ENTER 继续挑战 | 按 ESC 返回', this.W / 2, this.H / 2 + 120);
    ctx.textAlign = 'left';

    const handler = (e) => {
      if (e.key === 'Enter') {
        document.removeEventListener('keydown', handler);
        this._renderSelect();
      }
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', handler);
        this.game.showChallengeHall();
      }
    };
    document.addEventListener('keydown', handler);
  }

  _renderTitleUnlock() {
    const ctx = this.ctx;
    this.state = 'complete';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 36px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 称号解锁!', this.W / 2, this.H / 2 - 100);

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 48px Courier New';
    ctx.fillText('「无伤大师」', this.W / 2, this.H / 2 - 30);

    ctx.fillStyle = '#00d4ff';
    ctx.font = '16px Courier New';
    ctx.fillText(`连续 ${this.wins.streak} 次无伤胜利!`, this.W / 2, this.H / 2 + 20);

    ctx.fillStyle = '#fff';
    ctx.font = '14px Courier New';
    ctx.fillText(`Boss: ${this.hud.bossName} | 用时: ${this._fmtTime(this.timer)}`, this.W / 2, this.H / 2 + 60);

    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.fillText('称号已永久记录!', this.W / 2, this.H / 2 + 90);

    ctx.fillStyle = '#888';
    ctx.font = '14px Courier New';
    ctx.fillText('按 ENTER 继续 | 按 ESC 返回', this.W / 2, this.H / 2 + 130);
    ctx.textAlign = 'left';

    const handler = (e) => {
      if (e.key === 'Enter') {
        document.removeEventListener('keydown', handler);
        this._renderSelect();
      }
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', handler);
        this.game.showChallengeHall();
      }
    };
    document.addEventListener('keydown', handler);
  }

  _onDeath() {
    this.game.running = false;
    this.currentWinStreak = 0;
    this.wins.streak = 0;
    this._saveWins();
    this._renderDefeat();
  }

  _renderDefeat() {
    const ctx = this.ctx;
    this.state = 'defeat';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 36px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('✗ 挑战失败', this.W / 2, this.H / 2 - 70);

    ctx.fillStyle = '#888';
    ctx.font = '14px Courier New';
    ctx.fillText(`Boss: ${this.hud.bossName}`, this.W / 2, this.H / 2 - 25);
    ctx.fillText(`坚持时间: ${this._fmtTime(this.timer)}`, this.W / 2, this.H / 2 + 5);

    if (this.wasHitThisRun) {
      ctx.fillStyle = '#ff4444';
      ctx.font = '14px Courier New';
      ctx.fillText('你被击中了!', this.W / 2, this.H / 2 + 35);
    } else {
      ctx.fillStyle = '#ff4444';
      ctx.font = '14px Courier New';
      ctx.fillText('你倒下了...', this.W / 2, this.H / 2 + 35);
    }

    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.fillText(`总无伤胜利: ${this.wins.wins} | 连胜已重置`, this.W / 2, this.H / 2 + 65);

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(320, this.H / 2 + 85, 320, 60);
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(320, this.H / 2 + 85, 320, 60);
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 16px Courier New';
    ctx.fillText('[ 点击重试 ]', this.W / 2, this.H / 2 + 123);

    ctx.fillStyle = '#444';
    ctx.font = '12px Courier New';
    ctx.fillText('[按 ESC 返回挑战选择]', this.W / 2, this.H / 2 + 155);
    ctx.textAlign = 'left';

    const handler = (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (mx >= 320 && mx <= 640 && my >= this.H / 2 + 85 && my <= this.H / 2 + 145) {
        document.removeEventListener('click', handler);
        this._renderSelect();
      }
      if (e.key === 'Escape') {
        document.removeEventListener('click', handler);
        this.game.showChallengeHall();
      }
    };
    this.game.canvas.addEventListener('click', handler);
  }

  onDeath() { if (this.state === 'playing') this._onDeath(); }
  onComplete() { if (this.state === 'playing') this._onBossDefeated(); }
}

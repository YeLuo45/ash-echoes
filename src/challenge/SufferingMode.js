// SufferingMode — AI增强参数+地形变化+伤害调整+敌人数量增加
import { ENEMY_TEMPLATES } from '../gameplay/enemies.js';

export class SufferingMode {
  constructor(game) {
    this.game = game;
    this.ctx = game.ctx;
    this.W = game.width;
    this.H = game.height;

    this.difficultyLevels = [
      { label: '地狱', color: '#ff2222', hpMult: 2.5, dmgMult: 2.0, speedMult: 1.5, enemyCountMult: 2.5, terrainVariant: 1 },
      { label: '噩梦', color: '#9b59b6', hpMult: 2.0, dmgMult: 1.7, speedMult: 1.35, enemyCountMult: 2.0, terrainVariant: 0 },
      { label: '困难', color: '#ff9f1c', hpMult: 1.5, dmgMult: 1.4, speedMult: 1.2, enemyCountMult: 1.5, terrainVariant: 0 },
    ];
    this.selectedDifficulty = 1; // default: 噩梦

    this.state = 'select'; // select | playing | victory | defeat
    this.timer = 0;
    this.terrainOffset = 0;
    this.terrainTimer = 0;
    this.originalPlatforms = [];
    this.hud = null;
  }

  enter() {
    this.state = 'select';
    this._renderSelect();
  }

  _renderSelect() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(5, 5, 15, 0.98)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#9b59b6';
    ctx.font = 'bold 28px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('🔥 受苦难度 — 极限挑战', this.W / 2, 55);

    ctx.fillStyle = '#666';
    ctx.font = '12px Courier New';
    ctx.fillText('AI增强 | 地形变化 | 全伤增加 | 敌人数量翻倍', this.W / 2, 80);

    // Difficulty cards
    const cardW = 260;
    let bx = (this.W - (cardW * 3 + 40)) / 2;
    const by = 110;

    for (let i = 0; i < this.difficultyLevels.length; i++) {
      const d = this.difficultyLevels[i];
      const isSelected = this.selectedDifficulty === i;

      ctx.fillStyle = isSelected ? `${d.color}22` : 'rgba(20, 20, 35, 0.95)';
      ctx.fillRect(bx + i * (cardW + 20), by, cardW, 220);
      ctx.strokeStyle = isSelected ? d.color : '#333';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.strokeRect(bx + i * (cardW + 20), by, cardW, 220);

      ctx.fillStyle = d.color;
      ctx.font = 'bold 22px Courier New';
      ctx.fillText(d.label, bx + i * (cardW + 20) + cardW / 2, by + 40);

      ctx.fillStyle = isSelected ? '#fff' : '#888';
      ctx.font = '11px Courier New';
      ctx.fillText(`HP倍率: ×${d.hpMult}`, bx + i * (cardW + 20) + cardW / 2, by + 75);
      ctx.fillText(`伤害倍率: ×${d.dmgMult}`, bx + i * (cardW + 20) + cardW / 2, by + 95);
      ctx.fillText(`速度倍率: ×${d.speedMult}`, bx + i * (cardW + 20) + cardW / 2, by + 115);
      ctx.fillText(`敌人数量: ×${d.enemyCountMult}`, bx + i * (cardW + 20) + cardW / 2, by + 135);
      ctx.fillText(`地形变化: ${d.terrainVariant ? 'ON' : 'OFF'}`, bx + i * (cardW + 20) + cardW / 2, by + 155);

      if (isSelected) {
        ctx.fillStyle = d.color;
        ctx.font = '12px Courier New';
        ctx.fillText('▶ 已选择', bx + i * (cardW + 20) + cardW / 2, by + 200);
      }
    }

    // Modifier list
    ctx.fillStyle = '#555';
    ctx.font = '11px Courier New';
    ctx.fillText('效果: 敌人AI增强 | 地形随机位移 | 伤害×1.5 | 敌人攻击频率×1.3', this.W / 2, 360);
    ctx.fillText('玩家: HP/护甲无效化 | 受到的伤害×2 | 陷阱地形出现', this.W / 2, 380);

    // Start button
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(340, 400, 280, 65);
    ctx.strokeStyle = this.difficultyLevels[this.selectedDifficulty].color;
    ctx.lineWidth = 2;
    ctx.strokeRect(340, 400, 280, 65);
    ctx.fillStyle = this.difficultyLevels[this.selectedDifficulty].color;
    ctx.font = 'bold 18px Courier New';
    ctx.fillText('[ 开始受苦 ]', this.W / 2, 442);

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

      // Difficulty selection
      const cardW = 260;
      let bx = (this.W - (cardW * 3 + 40)) / 2;
      const by = 110;

      for (let i = 0; i < 3; i++) {
        if (mx >= bx + i * (cardW + 20) && mx <= bx + i * (cardW + 20) + cardW && my >= by && my <= by + 220) {
          this.selectedDifficulty = i;
          this._renderSelect();
          return;
        }
      }

      // Start button
      if (mx >= 340 && mx <= 620 && my >= 400 && my <= 465) {
        this.game.canvas.removeEventListener('click', handler);
        this._startRun();
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

  _startRun() {
    this.state = 'playing';
    this.timer = 0;
    this.terrainTimer = 0;
    this.terrainOffset = 0;

    const d = this.difficultyLevels[this.selectedDifficulty];

    // Generate suffering level
    const levelData = this._generateSufferingLevel(d);

    this.originalPlatforms = [...levelData.platforms];

    const chapterData = {
      theme: 'roguelite',
      bgColor1: '#1a0a1a',
      bgColor2: '#2a0a2a',
      accentColor: d.color,
    };

    this.game.level.initFromData(levelData, chapterData);

    // Apply suffering modifiers to enemies
    for (const enemy of this.game.enemies.enemies) {
      enemy.maxHp *= d.hpMult;
      enemy.hp = enemy.maxHp;
      enemy.damage *= d.dmgMult;
      enemy.speed *= d.speedMult;
      enemy.attackCooldown *= 0.77; // Faster attacks
    }

    // Player takes more damage
    this.game.player.init(100, 300);
    this.game.player.maxHp = 100;
    this.game.player.hp = 100;

    this.hud = { difficulty: d.label, color: d.color };

    this.game.running = true;
    this.game.lastTime = performance.now();
    this.game.mode = 'suffering';
    requestAnimationFrame((t) => this._loop(t));
  }

  _generateSufferingLevel(d) {
    // Generate a difficult level with many enemies
    const platforms = [
      { x: 0, y: 480, w: 2400, h: 40, type: 'ground' },
      { x: 200, y: 380, w: 150, h: 20, type: 'platform' },
      { x: 450, y: 320, w: 120, h: 20, type: 'platform' },
      { x: 700, y: 280, w: 180, h: 20, type: 'platform' },
      { x: 950, y: 380, w: 100, h: 20, type: 'platform' },
      { x: 1100, y: 300, w: 140, h: 20, type: 'platform' },
      { x: 1350, y: 250, w: 160, h: 20, type: 'platform' },
      { x: 1550, y: 350, w: 120, h: 20, type: 'platform' },
      { x: 1750, y: 280, w: 200, h: 20, type: 'platform' },
      { x: 2000, y: 350, w: 150, h: 20, type: 'platform' },
    ];

    // Spawn many enemies
    const enemyTypes = ['scavenger', 'patroller', 'ranged', 'elite'];
    const enemies = [];

    const count = Math.floor(15 * d.enemyCountMult);
    const bossCount = Math.floor(2 * d.enemyCountMult / 2);

    for (let i = 0; i < count; i++) {
      const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      const x = 200 + Math.random() * 1800;
      const y = 300 + Math.random() * 150;
      enemies.push({ type, x, y });
    }

    // Add bosses
    for (let i = 0; i < bossCount; i++) {
      const bossType = i === 0 ? 'boss' : 'elite';
      enemies.push({ type: bossType, x: 1500 + i * 200, y: 380 });
    }

    return {
      id: 'suffering',
      name: '受苦试炼',
      width: 2400,
      height: 800,
      enemies,
      platforms,
      collectibles: [],
      shrines: [{ x: 150, y: 460, active: true }],
      portal: { x: 2280, y: 380, w: 50, h: 100, active: false },
    };
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
    this.terrainTimer += dt;

    // Terrain changes every 15 seconds
    const d = this.difficultyLevels[this.selectedDifficulty];
    if (d.terrainVariant && this.terrainTimer > 15) {
      this.terrainTimer = 0;
      this._applyTerrainChange();
    }

    this.game.player.update(dt);
    this.game.enemies.update(dt);
    this.game.projectiles.update(dt);
    this.game.particles.update(dt);
    this.game.level.update(dt);
    this.game.camera.follow(this.game.player.x, this.game.player.y);

    // Check win
    if (this.game.enemies.getCount() === 0) {
      this._onVictory();
      return;
    }

    // Check death
    if (this.game.player.isDead) {
      this._onDeath();
    }
  }

  _applyTerrainChange() {
    // Randomly shift platforms
    const level = this.game.level;
    for (const plat of level.platforms) {
      if (plat.type === 'ground') continue;
      plat.x += (Math.random() - 0.5) * 80;
      plat.x = Math.max(0, Math.min(this.game.level.width - plat.w, plat.x));
      plat.y += (Math.random() - 0.5) * 40;
      plat.y = Math.max(150, Math.min(450, plat.y));
    }
    this.terrainOffset++;

    // Visual flash
    this.game.particles.spawn(960, 270, 'echo_pulse', { vx: 0, vy: 0, life: 0.5 });
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
    const d = this.difficultyLevels[this.selectedDifficulty];

    // Difficulty label
    ctx.fillStyle = d.color;
    ctx.font = 'bold 14px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(`🔥 ${d.label}模式`, 15, 25);

    // Timer
    ctx.fillStyle = d.color;
    ctx.font = 'bold 20px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(this._fmtTime(this.timer), this.W / 2, 30);

    // Terrain change warning
    if (this.terrainOffset > 0) {
      ctx.fillStyle = '#ff4444';
      ctx.font = '11px Courier New';
      ctx.fillText(`⚠ 地形已变化 ${this.terrainOffset} 次`, this.W / 2, 50);
    }

    // Enemy count
    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(`敌人: ${this.game.enemies.getCount()}`, 15, 50);

    // Warning: player takes 2x damage
    ctx.fillStyle = '#ff4444';
    ctx.font = '11px Courier New';
    ctx.fillText('⚠ 受伤×2', 15, 70);

    ctx.textAlign = 'left';
  }

  _fmtTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  _onDeath() {
    this.game.running = false;
    this.state = 'defeat';
    this._saveRecord();
    this._renderDefeat();
  }

  _onVictory() {
    this.game.running = false;
    this.state = 'victory';
    this._saveRecord();
    this._renderVictory();
  }

  _saveRecord() {
    const d = this.difficultyLevels[this.selectedDifficulty];
    try {
      const key = 'ash_challenge_suffering';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({
        difficulty: d.label,
        time: this.timer,
        terrainChanges: this.terrainOffset,
        timestamp: Date.now(),
      });
      existing.sort((a, b) => b.time - a.time);
      localStorage.setItem(key, JSON.stringify(existing.slice(0, 10)));
    } catch (e) { /* ignore */ }
  }

  _renderDefeat() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#9b59b6';
    ctx.font = 'bold 36px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('💀 挑战失败', this.W / 2, this.H / 2 - 60);

    ctx.fillStyle = '#888';
    ctx.font = '14px Courier New';
    ctx.fillText(`难度: ${this.difficultyLevels[this.selectedDifficulty].label}`, this.W / 2, this.H / 2 - 20);
    ctx.fillText(`存活时间: ${this._fmtTime(this.timer)}`, this.W / 2, this.H / 2 + 5);
    ctx.fillText(`地形变化: ${this.terrainOffset} 次`, this.W / 2, this.H / 2 + 30);

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(320, this.H / 2 + 60, 320, 60);
    ctx.strokeStyle = '#9b59b6';
    ctx.lineWidth = 2;
    ctx.strokeRect(320, this.H / 2 + 60, 320, 60);
    ctx.fillStyle = '#9b59b6';
    ctx.font = 'bold 16px Courier New';
    ctx.fillText('[ 点击重试 ]', this.W / 2, this.H / 2 + 98);

    ctx.fillStyle = '#444';
    ctx.font = '12px Courier New';
    ctx.fillText('[按 ESC 返回]', this.W / 2, this.H / 2 + 130);
    ctx.textAlign = 'left';

    const handler = (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (mx >= 320 && mx <= 640 && my >= this.H / 2 + 60 && my <= this.H / 2 + 120) {
        document.removeEventListener('click', handler);
        this._startRun();
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#9b59b6';
    ctx.font = 'bold 36px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 受苦通关!', this.W / 2, this.H / 2 - 60);

    ctx.fillStyle = '#fff';
    ctx.font = '16px Courier New';
    ctx.fillText(`难度: ${this.difficultyLevels[this.selectedDifficulty].label}`, this.W / 2, this.H / 2 - 15);
    ctx.fillText(`用时: ${this._fmtTime(this.timer)}`, this.W / 2, this.H / 2 + 15);
    ctx.fillText(`地形变化次数: ${this.terrainOffset}`, this.W / 2, this.H / 2 + 40);

    ctx.fillStyle = '#888';
    ctx.font = '14px Courier New';
    ctx.fillText('按 ENTER 返回挑战大厅', this.W / 2, this.H / 2 + 90);
    ctx.textAlign = 'left';

    const handler = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        document.removeEventListener('keydown', handler);
        this.game.showChallengeHall();
      }
    };
    document.addEventListener('keydown', handler);
  }

  onDeath() { if (this.state === 'playing') this._onDeath(); }
  onComplete() { if (this.state === 'playing') this._onVictory(); }
}

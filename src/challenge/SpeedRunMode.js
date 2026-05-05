// SpeedRunMode — 竞速计时，章节选择，计时通关，幽灵旁观，Top10排行榜
import { CHAPTER1, CHAPTER2, CHAPTER3 } from '../story/chapters.js';

export class SpeedRunMode {
  constructor(game) {
    this.game = game;
    this.ctx = game.ctx;
    this.W = game.width;
    this.H = game.height;

    this.chapters = [
      { data: CHAPTER1, name: '第1章: 回响废墟' },
      { data: CHAPTER2, name: '第2章: 回响深渊' },
      { data: CHAPTER3, name: '第3章: 永恒回廊' },
    ];

    this.selectedChapter = 0;
    this.state = 'select'; // select | countdown | playing | complete | failed
    this.timer = 0; // seconds
    this.bestTimes = this._loadBestTimes();
    this.ghostData = null; // Best run ghost replay
    this.ghostFrames = [];
    this.isGhostMode = false;
    this.hud = null;
  }

  enter() {
    this.state = 'select';
    this._renderSelect();
  }

  _loadBestTimes() {
    try {
      return JSON.parse(localStorage.getItem('ash_challenge_speed') || '{}');
    } catch (e) { return {}; }
  }

  _renderSelect() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(5, 5, 15, 0.98)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#ff9f1c';
    ctx.font = 'bold 28px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('⏱ 竞速模式 — 计时通关', this.W / 2, 55);

    ctx.fillStyle = '#666';
    ctx.font = '12px Courier New';
    ctx.fillText('选择章节，极限速度通关，幽灵旁观，Top10记录', this.W / 2, 80);

    // Chapter selection
    const cardW = 280;
    let bx = (this.W - (cardW * 3 + 40)) / 2;
    const by = 110;

    for (let i = 0; i < 3; i++) {
      const ch = this.chapters[i];
      const best = this.bestTimes[i];
      const isSelected = this.selectedChapter === i;

      ctx.fillStyle = isSelected ? 'rgba(255, 159, 28, 0.15)' : 'rgba(20, 20, 35, 0.95)';
      ctx.fillRect(bx + i * (cardW + 20), by, cardW, 200);
      ctx.strokeStyle = isSelected ? '#ff9f1c' : '#333';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.strokeRect(bx + i * (cardW + 20), by, cardW, 200);

      ctx.fillStyle = isSelected ? '#ff9f1c' : '#888';
      ctx.font = 'bold 15px Courier New';
      ctx.fillText(ch.name, bx + i * (cardW + 20) + cardW / 2, by + 30);

      ctx.fillStyle = '#555';
      ctx.font = '12px Courier New';
      ctx.fillText(`关卡: ${ch.data.levels?.length || 0}`, bx + i * (cardW + 20) + cardW / 2, by + 60);

      if (best) {
        ctx.fillStyle = '#ff9f1c';
        ctx.font = '14px Courier New';
        ctx.fillText(`最佳: ${this._fmtTime(best.time)}`, bx + i * (cardW + 20) + cardW / 2, by + 100);
        ctx.fillStyle = '#888';
        ctx.font = '11px Courier New';
        ctx.fillText(`记录于 ${new Date(best.timestamp).toLocaleDateString()}`, bx + i * (cardW + 20) + cardW / 2, by + 120);
      } else {
        ctx.fillStyle = '#444';
        ctx.font = '12px Courier New';
        ctx.fillText('暂无记录', bx + i * (cardW + 20) + cardW / 2, by + 100);
      }

      // Top10 preview
      ctx.fillStyle = '#555';
      ctx.font = '10px Courier New';
      ctx.fillText('Top10见排行榜 [T]', bx + i * (cardW + 20) + cardW / 2, by + 160);
    }

    // Chapter nav arrows
    ctx.fillStyle = this.selectedChapter > 0 ? '#ff9f1c' : '#333';
    ctx.font = '20px Courier New';
    ctx.fillText('◀', bx - 15, by + 100);
    ctx.fillStyle = this.selectedChapter < 2 ? '#ff9f1c' : '#333';
    ctx.fillText('▶', bx + 3 * (cardW + 20) + 5, by + 100);

    // Start button
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(320, 340, 320, 65);
    ctx.strokeStyle = '#ff9f1c';
    ctx.lineWidth = 2;
    ctx.strokeRect(320, 340, 320, 65);
    ctx.fillStyle = '#ff9f1c';
    ctx.font = 'bold 18px Courier New';
    ctx.fillText('[ 开始计时挑战 ]', this.W / 2, 382);

    // Ghost toggle
    const ghostOn = this.ghostData !== null;
    ctx.fillStyle = ghostOn ? 'rgba(0, 212, 255, 0.2)' : 'rgba(30, 30, 50, 0.8)';
    ctx.fillRect(320, 415, 320, 45);
    ctx.strokeStyle = ghostOn ? '#00d4ff' : '#333';
    ctx.lineWidth = 1;
    ctx.strokeRect(320, 415, 320, 45);
    ctx.fillStyle = ghostOn ? '#00d4ff' : '#555';
    ctx.font = '12px Courier New';
    ctx.fillText(ghostOn ? '👻 幽灵旁观: ON' : '👻 幽灵旁观: OFF', this.W / 2, 444);

    ctx.fillStyle = '#444';
    ctx.font = '12px Courier New';
    ctx.fillText('[按 ESC 返回] | [T 键查看Top10]', this.W / 2, this.H - 25);
    ctx.textAlign = 'left';

    this._selectClick();
  }

  _selectClick() {
    const handler = (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      // Start button
      if (mx >= 320 && mx <= 640 && my >= 340 && my <= 405) {
        this.game.canvas.removeEventListener('click', handler);
        this._startRun();
        return;
      }

      // Ghost toggle
      if (mx >= 320 && mx <= 640 && my >= 415 && my <= 460) {
        this._toggleGhost();
        return;
      }

      // Arrow clicks (chapter nav)
      const cardW = 280;
      const bx = (this.W - (cardW * 3 + 40)) / 2;
      const by = 110;

      if (mx >= bx - 30 && mx <= bx - 5 && my >= by && my <= by + 200) {
        if (this.selectedChapter > 0) {
          this.selectedChapter--;
          this._loadGhostForChapter();
          this._renderSelect();
        }
      }
      if (mx >= bx + 3 * (cardW + 20) && mx <= bx + 3 * (cardW + 20) + 30 && my >= by && my <= by + 200) {
        if (this.selectedChapter < 2) {
          this.selectedChapter++;
          this._loadGhostForChapter();
          this._renderSelect();
        }
      }
    };

    const keyHandler = (e) => {
      if (e.key === 't' || e.key === 'T') {
        document.removeEventListener('keydown', keyHandler);
        this.game.canvas.removeEventListener('click', handler);
        this._showTop10();
      }
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', keyHandler);
        this.game.canvas.removeEventListener('click', handler);
        this.game.showChallengeHall();
      }
    };

    this.game.canvas.addEventListener('click', handler);
    document.addEventListener('keydown', keyHandler);
  }

  _loadGhostForChapter() {
    try {
      const key = `ash_challenge_speed_ch${this.selectedChapter}_ghost`;
      this.ghostData = JSON.parse(localStorage.getItem(key) || 'null');
    } catch (e) { this.ghostData = null; }
  }

  _toggleGhost() {
    if (this.ghostData) {
      this.ghostData = null;
    } else {
      this._loadGhostForChapter();
    }
    this._renderSelect();
  }

  _startRun() {
    this.state = 'countdown';
    this._renderCountdown();
  }

  _renderCountdown() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#ff9f1c';
    ctx.font = 'bold 60px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('3', this.W / 2, this.H / 2);
    ctx.textAlign = 'left';

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, this.W, this.H);
        ctx.fillStyle = '#ff9f1c';
        ctx.font = 'bold 60px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(String(count), this.W / 2, this.H / 2);
        ctx.textAlign = 'left';
      } else {
        clearInterval(interval);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, this.W, this.H);
        ctx.fillStyle = '#00d4ff';
        ctx.font = 'bold 40px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('GO!', this.W / 2, this.H / 2);
        ctx.textAlign = 'left';
        setTimeout(() => this._beginRun(), 500);
      }
    }, 800);
  }

  _beginRun() {
    this.state = 'playing';
    this.timer = 0;
    this.ghostFrames = [];

    const ch = this.chapters[this.selectedChapter];
    this.game.currentChapter = ch.data.id;
    this.game.currentLevelIndex = 0;

    this._loadLevel(0);
    this.game.running = true;
    this.game.lastTime = performance.now();
    this.game.mode = 'speedrun';
    requestAnimationFrame((t) => this._loop(t));
  }

  _loadLevel(levelIndex) {
    const ch = this.chapters[this.selectedChapter];
    const levelData = ch.data.levels[levelIndex];
    if (!levelData) {
      this._onChapterComplete();
      return;
    }
    this.game.currentLevelIndex = levelIndex;
    this.game.level.initFromData(levelData, ch.data);
    this.game.player.init(100, 300);
    this.game.enemies.enemies = [];
    this.game.particles.clear();
    this.game.projectiles.clear();

    this.hud = {
      chapter: ch.data.id,
      levelIndex,
      totalLevels: ch.data.levels.length,
      levelName: levelData.name,
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

    // Record ghost frame
    this.ghostFrames.push({
      x: this.game.player.x,
      y: this.game.player.y,
      t: this.timer,
    });

    this.game.player.update(dt);
    this.game.enemies.update(dt);
    this.game.projectiles.update(dt);
    this.game.particles.update(dt);
    this.game.level.update(dt);
    this.game.camera.follow(this.game.player.x, this.game.player.y);

    // Check level complete
    if (this.game.enemies.getCount() === 0 && this.game.level.portal?.active) {
      this._onLevelComplete();
      return;
    }

    // Check death
    if (this.game.player.isDead) {
      this._onDeath();
    }

    // Update ghost
    if (this.ghostData) {
      this.ghostData.currentFrame = this.ghostData.frames.findIndex(
        f => Math.abs(f.t - this.timer) < 0.05
      );
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

    // Ghost rendering
    if (this.ghostData && this.ghostData.frames.length > 0) {
      const frame = this.ghostData.frames.find(
        f => Math.abs(f.t - this.timer) < 0.05
      );
      if (frame) {
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = '#00d4ff';
        ctx.fillRect(frame.x, frame.y, this.game.player.width, this.game.player.height);
        ctx.globalAlpha = 1;
      }
    }

    this.game.enemies.render(ctx);
    this.game.player.render(ctx);
    this.game.projectiles.render(ctx);
    this.game.particles.render(ctx);

    ctx.restore();

    this._renderHUD();
  }

  _renderHUD() {
    const ctx = this.ctx;

    // Timer (top center)
    ctx.fillStyle = '#ff9f1c';
    ctx.font = 'bold 24px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(this._fmtTime(this.timer), this.W / 2, 35);

    // Level progress (top left)
    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.hud?.levelName || ''} (${(this.hud?.levelIndex || 0) + 1}/${this.hud?.totalLevels || 0})`, 15, 25);

    // Ghost indicator
    if (this.ghostData) {
      ctx.fillStyle = '#00d4ff';
      ctx.font = '11px Courier New';
      ctx.fillText('👻 幽灵旁观中', 15, 45);
    }

    ctx.textAlign = 'left';
  }

  _fmtTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  }

  _onLevelComplete() {
    const ch = this.chapters[this.selectedChapter];
    const nextIndex = this.game.currentLevelIndex + 1;

    if (nextIndex >= ch.data.levels.length) {
      this._onChapterComplete();
    } else {
      this.game.running = false;
      this._loadLevel(nextIndex);
      this.game.running = true;
      this.game.lastTime = performance.now();
    }
  }

  _onChapterComplete() {
    this.game.running = false;
    this.state = 'complete';
    this._saveRecord();
    this._renderComplete();
  }

  _saveRecord() {
    const chId = this.selectedChapter;
    const time = this.timer;
    const record = { time, timestamp: Date.now() };

    try {
      // Save best time
      const existing = JSON.parse(localStorage.getItem('ash_challenge_speed') || '{}');
      if (!existing[chId] || time < existing[chId].time) {
        existing[chId] = record;
        localStorage.setItem('ash_challenge_speed', JSON.stringify(existing));
      }

      // Save ghost data
      const ghostKey = `ash_challenge_speed_ch${chId}_ghost`;
      localStorage.setItem(ghostKey, JSON.stringify({ frames: this.ghostFrames, time }));

      // Top10
      const topKey = `ash_challenge_speed_top_${chId}`;
      const top = JSON.parse(localStorage.getItem(topKey) || '[]');
      top.push({ time, timestamp: Date.now() });
      top.sort((a, b) => a.time - b.time);
      localStorage.setItem(topKey, JSON.stringify(top.slice(0, 10)));
    } catch (e) { /* ignore */ }
  }

  _renderComplete() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#ff9f1c';
    ctx.font = 'bold 36px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('⏱ 竞速完成!', this.W / 2, this.H / 2 - 80);

    ctx.fillStyle = '#fff';
    ctx.font = '22px Courier New';
    ctx.fillText(`章节: ${this.chapters[this.selectedChapter].name}`, this.W / 2, this.H / 2 - 35);

    ctx.fillStyle = '#ff9f1c';
    ctx.font = 'bold 32px Courier New';
    ctx.fillText(`时间: ${this._fmtTime(this.timer)}`, this.W / 2, this.H / 2 + 15);

    const best = this.bestTimes[this.selectedChapter];
    if (best) {
      ctx.fillStyle = '#00d4ff';
      ctx.font = '16px Courier New';
      const diff = this.timer - best.time;
      ctx.fillText(`最佳: ${this._fmtTime(best.time)} | 差: ${diff >= 0 ? '+' : ''}${this._fmtTime(Math.abs(diff))}`, this.W / 2, this.H / 2 + 55);
    } else {
      ctx.fillStyle = '#00d4ff';
      ctx.font = '16px Courier New';
      ctx.fillText('新纪录!', this.W / 2, this.H / 2 + 55);
    }

    ctx.fillStyle = '#888';
    ctx.font = '14px Courier New';
    ctx.fillText('按 ENTER 返回 | 按 T 查看Top10', this.W / 2, this.H / 2 + 100);
    ctx.textAlign = 'left';

    const handler = (e) => {
      if (e.key === 'Enter') {
        document.removeEventListener('keydown', handler);
        this.enter();
      }
      if (e.key === 't' || e.key === 'T') {
        document.removeEventListener('keydown', handler);
        this._showTop10FromResult();
      }
    };
    document.addEventListener('keydown', handler);
  }

  _onDeath() {
    this.game.running = false;
    this.state = 'failed';
    this._renderFailed();
  }

  _renderFailed() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 32px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('挑战失败', this.W / 2, this.H / 2 - 50);

    ctx.fillStyle = '#888';
    ctx.font = '14px Courier New';
    ctx.fillText(`存活时间: ${this._fmtTime(this.timer)}`, this.W / 2, this.H / 2);

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(320, this.H / 2 + 30, 320, 60);
    ctx.strokeStyle = '#ff9f1c';
    ctx.lineWidth = 2;
    ctx.strokeRect(320, this.H / 2 + 30, 320, 60);
    ctx.fillStyle = '#ff9f1c';
    ctx.font = 'bold 16px Courier New';
    ctx.fillText('[ 点击重试 ]', this.W / 2, this.H / 2 + 68);

    ctx.fillStyle = '#444';
    ctx.font = '12px Courier New';
    ctx.fillText('[按 ESC 返回挑战选择]', this.W / 2, this.H / 2 + 110);
    ctx.textAlign = 'left';

    const handler = (e) => {
      const rect = this.game.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (mx >= 320 && mx <= 640 && my >= this.H / 2 + 30 && my <= this.H / 2 + 90) {
        document.removeEventListener('click', handler);
        this._startRun();
      }
      if (e.key === 'Escape') {
        document.removeEventListener('click', handler);
        this.enter();
      }
    };
    this.game.canvas.addEventListener('click', handler);
  }

  _showTop10() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(5, 5, 15, 0.98)';
    ctx.fillRect(0, 0, this.W, this.H);

    ctx.fillStyle = '#ff9f1c';
    ctx.font = 'bold 24px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 Top10 排行榜', this.W / 2, 50);

    const chNames = ['第1章', '第2章', '第3章'];
    let ty = 90;
    for (let c = 0; c < 3; c++) {
      const topKey = `ash_challenge_speed_top_${c}`;
      let top = [];
      try { top = JSON.parse(localStorage.getItem(topKey) || '[]'); } catch (e) { }

      ctx.fillStyle = '#888';
      ctx.font = 'bold 14px Courier New';
      ctx.fillText(chNames[c], this.W / 2, ty);

      ctx.fillStyle = '#555';
      ctx.font = '11px Courier New';
      if (top.length === 0) {
        ctx.fillText('暂无记录', this.W / 2, ty + 20);
      } else {
        for (let i = 0; i < top.length; i++) {
          const r = top[i];
          ctx.fillStyle = i === 0 ? '#ffd700' : i < 3 ? '#c0c0c0' : '#888';
          ctx.fillText(`#${i + 1}  ${this._fmtTime(r.time)}`, this.W / 2, ty + 20 + i * 18);
        }
      }
      ty += 25 + Math.max(top.length, 1) * 18 + 15;
    }

    ctx.fillStyle = '#444';
    ctx.font = '12px Courier New';
    ctx.fillText('[按 ESC 返回]', this.W / 2, this.H - 25);
    ctx.textAlign = 'left';

    const escH = (e) => {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', escH);
        this.enter();
      }
    };
    document.addEventListener('keydown', escH);
  }

  _showTop10FromResult() {
    this._showTop10();
  }

  onDeath() { if (this.state === 'playing') this._onDeath(); }
  onComplete(r) { this._onChapterComplete(); }
}

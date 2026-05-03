import { InputManager } from './InputManager.js';
import { Player } from '../gameplay/Player.js';
import { EnemyManager } from '../gameplay/EnemyManager.js';
import { ProjectileManager } from '../gameplay/ProjectileManager.js';
import { ParticleManager } from '../utils/ParticleManager.js';
import { Level } from '../gameplay/Level.js';
import { UI } from '../ui/UI.js';
import { Camera } from './Camera.js';
import { SaveManager } from './SaveManager.js';
import { SeededRandom } from './SeededRandom.js';
import { WeaponSwitch } from '../ui/weaponSwitch.js';
import { RogueliteHUD } from '../ui/rogueliteHUD.js';
import { Shop } from '../roguelite/shop.js';
import { PermanentUnlockManager } from '../roguelite/permanentUnlocks.js';
import { generateRooms } from '../roguelite/roomGenerator.js';
import { CHAPTER1, CHAPTER2, CHAPTER3, ALL_CHAPTERS } from '../story/chapters.js';
import { ENEMY_TEMPLATES } from '../gameplay/enemies.js';
import { WEAPONS } from '../gameplay/weapons.js';
import { PASSIVE_SKILLS, applyPassiveEffect } from '../gameplay/passives.js';

export class GameV2 {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = canvas.width;
    this.height = canvas.height;
    this.running = false;
    this.lastTime = 0;
    this.deltaTime = 0;
    this.maxDelta = 0.05;

    this.input = new InputManager();
    this.camera = new Camera(this.width, this.height);
    this.particles = new ParticleManager();
    this.projectiles = new ProjectileManager();
    this.enemies = new EnemyManager(this.projectiles, this.particles);
    this.player = new Player(this.input, this.projectiles, this.particles, this.enemies);
    this.level = new Level(this.enemies, this.player);
    this.ui = new UI(this.player, this.enemies);
    this.saveManager = new SaveManager();
    this.weaponSwitch = new WeaponSwitch(this.player);
    this.shop = new Shop();
    this.rogueliteHUD = new RogueliteHUD();
    this.permanentUnlocks = new PermanentUnlockManager(this.saveManager);

    // Game mode
    this.mode = 'menu'; // menu, classic, roguelite
    this.currentChapter = 1;
    this.currentLevelIndex = 0;

    // Roguelite state
    this.roguelite = {
      rooms: [],
      currentRoomIndex: 0,
      seed: 0,
      isDaily: false,
      wave: 1,
      score: 0,
      gold: 0,
      inShop: false,
      inEvent: false,
      currentEvent: null,
      bossDefeated: false,
    };

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => this._onKeyDown(e));
    window.addEventListener('keyup', (e) => this.input.keyup(e));
  }

  _onKeyDown(e) {
    const key = e.key.toLowerCase();

    // Q = weapon switch
    if (key === 'q' && this.running && this.mode === 'classic') {
      const newWeapon = this.weaponSwitch.switchWeapon();
      if (newWeapon) {
        // Visual feedback
        this.particles.spawn(
          this.player.x + this.player.width / 2,
          this.player.y + this.player.height / 2,
          'weapon_switch',
          { life: 0.3 }
        );
      }
    }

    // Shop buying (1-9)
    if (this.shop.isOpen && this.shop.items.length > 0) {
      const num = parseInt(key);
      if (num >= 1 && num <= this.shop.items.length) {
        this.shop.buy(this.shop.items[num - 1]);
      }
      if (key === 'escape') {
        this.shop.close();
        this.roguelite.inShop = false;
      }
    }

    // Roguelite event/room advance
    if (this.running && this.mode === 'roguelite') {
      if (key === 'enter' || key === ' ') {
        if (this.roguelite.inEvent) {
          this._advanceFromEvent();
        } else if (this.roguelite.rooms.length === 0) {
          this._startRogueliteRun();
        } else if (this.enemies.getCount() === 0 && !this.roguelite.inShop) {
          this._advanceRoom();
        }
      }
    }
  }

  showModeSelect() {
    this.mode = 'menu';
    this._renderMenu();
  }

  _renderMenu() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(10, 10, 20, 0.97)';
    ctx.fillRect(0, 0, this.width, this.height);

    // Title
    ctx.fillStyle = '#ff6b35';
    ctx.font = 'bold 36px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('残响纪元', this.width / 2, 80);
    ctx.font = '16px Courier New';
    ctx.fillStyle = '#7b2cbf';
    ctx.fillText('ASH ECHOES V2', this.width / 2, 110);

    // Classic mode
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(100, 160, 340, 200);
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 160, 340, 200);
    ctx.fillStyle = '#ff6b35';
    ctx.font = 'bold 16px Courier New';
    ctx.fillText('经典章节', 270, 195);
    ctx.font = '12px Courier New';
    ctx.fillStyle = '#888';
    ctx.fillText('第1-3章 + Boss战', 270, 220);
    ctx.fillText('新武器 + 被动技能', 270, 238);
    ctx.fillStyle = '#00d4ff';
    ctx.font = '14px Courier New';
    ctx.fillText('[点击开始经典模式]', 270, 280);

    // Roguelite mode
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(520, 160, 340, 200);
    ctx.strokeStyle = '#9b59b6';
    ctx.lineWidth = 2;
    ctx.strokeRect(520, 160, 340, 200);
    ctx.fillStyle = '#9b59b6';
    ctx.font = 'bold 16px Courier New';
    ctx.fillText('Roguelite冒险', 690, 195);
    ctx.font = '12px Courier New';
    ctx.fillStyle = '#888';
    ctx.fillText('无限关卡 10波次', 690, 220);
    ctx.fillText('永久解锁 + 每日挑战', 690, 238);
    ctx.fillStyle = '#9b59b6';
    ctx.font = '14px Courier New';
    ctx.fillText('[点击开始Roguelite]', 690, 280);

    // Daily challenge
    const todaySeed = SeededRandom.todaySeed();
    ctx.fillStyle = '#9b59b6';
    ctx.font = '11px Courier New';
    ctx.fillText(`每日Seed: ${todaySeed}`, this.width / 2, 400);
    ctx.fillStyle = '#666';
    ctx.fillText('每日挑战使用当日seed，排行榜可复现', this.width / 2, 420);

    // Permanent unlocks status
    const unlocks = this.permanentUnlocks.unlocks;
    ctx.fillStyle = '#555';
    ctx.font = '11px Courier New';
    ctx.fillText(`💎 熵结晶: ${unlocks.entropyCrystals || 0}`, this.width / 2, 450);

    // Click handling
    this._menuClickHandler();

    ctx.textAlign = 'left';
  }

  _menuClickHandler() {
    const handler = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      // Classic
      if (mx >= 100 && mx <= 440 && my >= 160 && my <= 360) {
        this.canvas.removeEventListener('click', handler);
        this._startClassicMode();
      }
      // Roguelite
      if (mx >= 520 && mx <= 860 && my >= 160 && my <= 360) {
        this.canvas.removeEventListener('click', handler);
        this._showRogueliteSubMenu();
      }
    };
    this.canvas.addEventListener('click', handler);
  }

  _showRogueliteSubMenu() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(10, 10, 20, 0.97)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#9b59b6';
    ctx.font = 'bold 24px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('Roguelite 冒险', this.width / 2, 80);

    // Normal run
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(200, 140, 560, 80);
    ctx.strokeStyle = '#9b59b6';
    ctx.strokeRect(200, 140, 560, 80);
    ctx.fillStyle = '#fff';
    ctx.font = '16px Courier New';
    ctx.fillText('普通Roguelite (随机Seed)', 480, 175);
    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.fillText('从零开始，积累永久解锁', 480, 198);

    // Daily challenge
    const todaySeed = SeededRandom.todaySeed();
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(200, 240, 560, 80);
    ctx.strokeStyle = '#ff6b35';
    ctx.strokeRect(200, 240, 560, 80);
    ctx.fillStyle = '#ff6b35';
    ctx.font = '16px Courier New';
    ctx.fillText('⚡ 每日挑战', 480, 275);
    ctx.fillStyle = '#888';
    ctx.font = '12px Courier New';
    ctx.fillText(`Seed: ${todaySeed} | 排行榜可复现`, 480, 298);

    // Permanent unlocks shop
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(200, 340, 560, 120);
    ctx.strokeStyle = '#00d4ff';
    ctx.strokeRect(200, 340, 560, 120);
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 14px Courier New';
    ctx.fillText('永久解锁 (熵结晶)', 480, 370);
    ctx.font = '12px Courier New';
    ctx.fillStyle = '#888';
    const unlocks = this.permanentUnlocks.unlocks;
    ctx.fillText(`可用熵结晶: ${unlocks.entropyCrystals || 0}`, 480, 392);
    ctx.fillText('[点击武器/技能解锁]', 480, 412);

    // Back
    ctx.fillStyle = '#555';
    ctx.font = '12px Courier New';
    ctx.fillText('[按 ESC 返回]', this.width / 2, 490);

    this._rogueliteMenuClick(todaySeed);

    ctx.textAlign = 'left';
  }

  _rogueliteMenuClick(dailySeed) {
    const handler = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (mx >= 200 && mx <= 760 && my >= 140 && my <= 220) {
        // Normal roguelite
        this.canvas.removeEventListener('click', handler);
        this._startRoguelite(false, Math.floor(Math.random() * 1000000));
      } else if (mx >= 200 && mx <= 760 && my >= 240 && my <= 320) {
        // Daily challenge
        this.canvas.removeEventListener('click', handler);
        this._startRoguelite(true, dailySeed);
      } else if (mx >= 200 && mx <= 760 && my >= 340 && my <= 460) {
        // Permanent unlocks
        this.canvas.removeEventListener('click', handler);
        this._showPermanentUnlocks();
      } else {
        const escHandler = (ev) => {
          if (ev.key === 'Escape') {
            document.removeEventListener('keydown', escHandler);
            this.canvas.removeEventListener('click', handler);
            this._renderMenu();
          }
        };
        document.addEventListener('keydown', escHandler);
      }
    };
    this.canvas.addEventListener('click', handler);
  }

  _showPermanentUnlocks() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(10, 10, 20, 0.97)';
    ctx.fillRect(0, 0, this.width, this.height);

    const unlocks = this.permanentUnlocks.unlocks;
    const crystals = unlocks.entropyCrystals || 0;

    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 20px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('永久解锁', this.width / 2, 50);
    ctx.fillStyle = '#9b59b6';
    ctx.fillText(`💎 ${crystals}`, this.width / 2, 80);

    // Weapons
    ctx.fillStyle = '#ff6b35';
    ctx.font = 'bold 14px Courier New';
    ctx.fillText('武器', 200, 120);
    let wy = 140;
    for (const [id, info] of Object.entries({ pistol: { cost: 0 }, echo_blade: { cost: 80 }, scatter_gun: { cost: 60 }, resonance_cannon: { cost: 100 } })) {
      const owned = (unlocks.unlockedWeapons || ['pistol']).includes(id);
      const w = WEAPONS[id];
      ctx.fillStyle = owned ? '#0a0' : '#888';
      ctx.font = '12px Courier New';
      ctx.fillText(`${w?.name || id}: ${owned ? '已拥有' : info.cost + ' 💎'}`, 100, wy);
      wy += 20;
    }

    // Passives
    ctx.fillStyle = '#9b59b6';
    ctx.font = 'bold 14px Courier New';
    ctx.fillText('被动技能', 500, 120);
    let py = 140;
    for (const [id, info] of Object.entries({ resonance_boost: { cost: 40 }, vital_strike: { cost: 50 }, echo_mastery: { cost: 45 }, rapid_fire: { cost: 40 }, dash_master: { cost: 55 }, corruption_shield: { cost: 50 } })) {
      const owned = (unlocks.unlockedPassives || []).includes(id);
      const p = PASSIVE_SKILLS[id];
      ctx.fillStyle = owned ? '#0a0' : '#888';
      ctx.font = '12px Courier New';
      ctx.fillText(`${p?.name || id}: ${owned ? '已拥有' : info.cost + ' 💎'}`, 400, py);
      py += 20;
    }

    ctx.fillStyle = '#555';
    ctx.font = '12px Courier New';
    ctx.fillText('[按 ESC 返回]', this.width / 2, this.height - 30);
    ctx.textAlign = 'left';

    const escHandler = (e) => {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', escHandler);
        this._showRogueliteSubMenu();
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  _startClassicMode() {
    this.mode = 'classic';
    const progress = this.saveManager.loadClassicProgress();
    if (progress?.chapters?.[1]?.lastLevel > 0) {
      // Has progress - show chapter select
      this._showChapterSelect();
    } else {
      // Fresh start
      this.currentChapter = 1;
      this.currentLevelIndex = 0;
      this._loadChapter(1);
    }
  }

  _showChapterSelect() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(10, 10, 20, 0.97)';
    ctx.fillRect(0, 0, this.width, this.height);

    const progress = this.saveManager.loadClassicProgress();

    ctx.fillStyle = '#ff6b35';
    ctx.font = 'bold 24px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('章节选择', this.width / 2, 50);

    let bx = 80;
    for (const chapter of [CHAPTER1, CHAPTER2, CHAPTER3]) {
      const chProgress = progress?.chapters?.[chapter.id];
      const unlocked = !chProgress || chapter.id === 1 || (progress.chapters[chapter.id - 1]?.lastLevel > 0);

      ctx.fillStyle = unlocked ? '#1a1a2e' : '#0a0a0f';
      ctx.fillRect(bx, 90, 240, 180);
      ctx.strokeStyle = unlocked ? chapter.accentColor : '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, 90, 240, 180);

      ctx.fillStyle = unlocked ? chapter.accentColor : '#555';
      ctx.font = 'bold 16px Courier New';
      ctx.fillText(`第${chapter.id}章`, bx + 120, 125);
      ctx.font = '20px Courier New';
      ctx.fillText(chapter.name, bx + 120, 155);

      ctx.font = '12px Courier New';
      ctx.fillStyle = '#888';
      ctx.fillText(`关卡: ${chapter.levels?.length || 0}`, bx + 120, 185);

      if (chProgress) {
        ctx.fillStyle = '#ff9f1c';
        ctx.fillText(`进度: ${chProgress.lastLevel}/${chapter.levels?.length || 0}`, bx + 120, 210);
      } else if (unlocked) {
        ctx.fillStyle = '#00d4ff';
        ctx.fillText('未挑战', bx + 120, 210);
      } else {
        ctx.fillStyle = '#666';
        ctx.fillText('未解锁', bx + 120, 210);
      }

      if (!unlocked) {
        ctx.fillStyle = '#444';
        ctx.fillText('[需要先完成上一章]', bx + 120, 250);
      }

      bx += 270;
    }

    ctx.fillStyle = '#555';
    ctx.font = '12px Courier New';
    ctx.fillText('[点击章节开始] | [按 ESC 返回]', this.width / 2, 310);
    ctx.textAlign = 'left';

    const handler = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let bx = 80;
      for (const chapter of [CHAPTER1, CHAPTER2, CHAPTER3]) {
        if (mx >= bx && mx <= bx + 240 && my >= 90 && my <= 270) {
          const unlocked = !progress?.chapters?.[chapter.id - 1]?.lastLevel && chapter.id > 1;
          if (!unlocked) {
            this.canvas.removeEventListener('click', handler);
            this.currentChapter = chapter.id;
            this.currentLevelIndex = progress?.chapters?.[chapter.id]?.lastLevel || 0;
            this._loadChapter(chapter.id);
            return;
          }
        }
        bx += 270;
      }

      const escH = (ev) => {
        if (ev.key === 'Escape') {
          document.removeEventListener('keydown', escH);
          this.canvas.removeEventListener('click', handler);
          this._renderMenu();
        }
      };
      document.addEventListener('keydown', escH);
    };
    this.canvas.addEventListener('click', handler);
  }

  _loadChapter(chapterNum) {
    const chapterData = chapterNum === 1 ? CHAPTER1 : chapterNum === 2 ? CHAPTER2 : CHAPTER3;
    const levelData = chapterData.levels[this.currentLevelIndex];
    if (!levelData) {
      // Chapter complete
      this._onChapterComplete();
      return;
    }

    this.currentChapter = chapterNum;
    this.level.initFromData(levelData, chapterData);
    this._initPlayerAndStart();
  }

  _initPlayerAndStart() {
    this.player.init(100, 300);
    this.weaponSwitch.setSlots('pistol', null);

    // Apply unlocked weapons
    const progress = this.saveManager.loadClassicProgress();
    if (progress?.unlockedWeapons?.includes('echo_blade')) {
      this.weaponSwitch.setSlots('pistol', 'echo_blade');
    }

    // Apply unlocked passives
    if (progress?.unlockedPassives?.length > 0) {
      // First passive is auto-equipped for classic
      applyPassiveEffect(progress.unlockedPassives[0], this.player);
    }

    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  _startRoguelite(isDaily, seed) {
    this.mode = 'roguelite';
    this.roguelite = {
      rooms: [],
      currentRoomIndex: 0,
      seed,
      isDaily,
      wave: 1,
      score: 0,
      gold: 0,
      inShop: false,
      inEvent: false,
      currentEvent: null,
      bossDefeated: false,
    };

    // Apply permanent unlocks to player
    const unlocks = this.permanentUnlocks.getUnlockedWeapons();
    const passiveUnlock = this.permanentUnlocks.getUnlockedPassives();
    const bonusEnergy = this.permanentUnlocks.getBonusStartingEnergy() * 10;

    this.player = new Player(this.input, this.projectiles, this.particles, this.enemies);
    this.weaponSwitch = new WeaponSwitch(this.player);

    // Set dual weapons
    if (unlocks.includes('echo_blade')) {
      this.weaponSwitch.setSlots('pistol', 'echo_blade');
    } else {
      this.weaponSwitch.setSlots('pistol', null);
    }

    // Apply starting bonus
    if (bonusEnergy > 0) {
      this.player.maxResonance += bonusEnergy;
    }

    // Apply starting passives
    for (const pid of passiveUnlock.slice(0, 1)) {
      applyPassiveEffect(pid, this.player);
    }

    this.level = new Level(this.enemies, this.player);
    this._startRogueliteRun();
  }

  _startRogueliteRun() {
    const { seed, isDaily } = this.roguelite;

    // Generate 10 rooms
    this.roguelite.rooms = generateRooms(seed);
    this.roguelite.currentRoomIndex = 0;
    this.roguelite.wave = 1;
    this.roguelite.inShop = false;
    this.roguelite.inEvent = false;

    this._loadRoom(0);
    this.rogueliteHUD.update(this.roguelite.wave, this.roguelite.gold, this.permanentUnlocks.getEntropyCrystals());

    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  _loadRoom(index) {
    const room = this.roguelite.rooms[index];
    if (!room) return;

    this.level.initFromRogueliteRoom(room);
    this.player.init(100, 300);
    this.enemies.enemies = [];
    this.particles.clear();
    this.projectiles.clear();

    if (room.type === 'shop') {
      this.roguelite.inShop = true;
      this.shop.open(room.shopItems, this.player, this.saveManager);
    }
  }

  _advanceRoom() {
    if (this.roguelite.inShop) {
      this.shop.close();
      this.roguelite.inShop = false;
    }

    const nextIndex = this.roguelite.currentRoomIndex + 1;
    if (nextIndex >= this.roguelite.rooms.length) {
      // Run complete!
      this._onRogueliteComplete();
      return;
    }

    this.roguelite.currentRoomIndex = nextIndex;
    this.roguelite.wave = nextIndex + 1;
    this.rogueliteHUD.update(this.roguelite.wave, this.roguelite.gold, this.permanentUnlocks.getEntropyCrystals());
    this._loadRoom(nextIndex);
  }

  _advanceFromEvent() {
    if (this.roguelite.currentEvent?.effect === 'bonus_loot') {
      // Collect event loot
      for (const c of this.roguelite.currentEvent.collectibles || []) {
        this.player.addResonance(15);
        this.player.addAsh(5);
      }
    } else if (this.roguelite.currentEvent?.effect === 'corruption_up') {
      this.player.corruption += 20;
    } else if (this.roguelite.currentEvent?.effect === 'full_heal') {
      this.player.hp = this.player.maxHp;
    }

    this.roguelite.inEvent = false;
    this.roguelite.currentEvent = null;
    this._advanceRoom();
  }

  _onRogueliteComplete() {
    this.running = false;

    const { isDaily, seed, wave, score } = this.roguelite;

    // Award entropy crystals
    const reward = this.permanentUnlocks.onRunComplete(wave, score);
    this.rogueliteHUD.update(wave, this.roguelite.gold, this.permanentUnlocks.getEntropyCrystals());

    if (isDaily) {
      this.saveManager.saveDailyScore(seed, score);
    }

    // Show victory screen
    this._renderRogueliteVictory(wave, score);
  }

  _renderRogueliteVictory(wave, score) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 36px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('挑战完成!', this.width / 2, 160);

    ctx.font = '18px Courier New';
    ctx.fillStyle = '#fff';
    ctx.fillText(`到达波次: ${wave}/10`, this.width / 2, 220);
    ctx.fillText(`得分: ${score}`, this.width / 2, 250);

    const reward = this.permanentUnlocks.onRunComplete(wave, score);
    ctx.fillStyle = '#9b59b6';
    ctx.fillText(`+${reward} 熵结晶`, this.width / 2, 290);

    if (this.roguelite.isDaily) {
      ctx.fillStyle = '#ff6b35';
      ctx.font = '14px Courier New';
      ctx.fillText('已记录每日挑战成绩!', this.width / 2, 330);
    }

    ctx.fillStyle = '#888';
    ctx.font = '14px Courier New';
    ctx.fillText('按 ENTER 返回主菜单', this.width / 2, 380);
    ctx.textAlign = 'left';

    const handler = (e) => {
      if (e.key === 'Enter') {
        document.removeEventListener('keydown', handler);
        this.showModeSelect();
      }
    };
    document.addEventListener('keydown', handler);
  }

  _onChapterComplete() {
    this.running = false;
    const ctx = this.ctx;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#ff6b35';
    ctx.font = 'bold 30px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(`第${this.currentChapter}章 完成!`, this.width / 2, 180);

    // Unlock echo_blade after chapter 2
    if (this.currentChapter === 2) {
      const progress = this.saveManager.loadClassicProgress();
      if (!progress?.unlockedWeapons?.includes('echo_blade')) {
        this.saveManager.saveClassicProgress(this.currentChapter, 0, ['pistol'], ['echo_blade']);
      }
      ctx.fillStyle = '#00d4ff';
      ctx.font = '16px Courier New';
      ctx.fillText('解锁新武器: 回响双刃!', this.width / 2, 230);
    }

    ctx.fillStyle = '#888';
    ctx.font = '14px Courier New';
    ctx.fillText('按 ENTER 继续', this.width / 2, 300);

    const handler = (e) => {
      if (e.key === 'Enter') {
        document.removeEventListener('keydown', handler);
        if (this.currentChapter < 3) {
          this.currentChapter++;
          this.currentLevelIndex = 0;
          this._loadChapter(this.currentChapter);
        } else {
          this.showModeSelect();
        }
      }
    };
    document.addEventListener('keydown', handler);
  }

  start() {
    this.showModeSelect();
  }

  stop() {
    this.running = false;
  }

  loop(timestamp) {
    if (!this.running) return;

    this.deltaTime = Math.min((timestamp - this.lastTime) / 1000, this.maxDelta);
    this.lastTime = timestamp;

    this.update(this.deltaTime);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    this.input.update();

    if (this.roguelite.inShop) {
      // In shop, only render
      return;
    }

    if (this.roguelite.inEvent) {
      // Waiting for player to advance event
      return;
    }

    this.player.update(dt);
    this.enemies.update(dt);
    this.projectiles.update(dt);
    this.particles.update(dt);
    this.level.update(dt);
    this.camera.follow(this.player.x, this.player.y);

    // Roguelite gold tracking
    if (this.mode === 'roguelite') {
      this.roguelite.gold = this.player.ash;
      this.rogueliteHUD.update(this.roguelite.wave, this.roguelite.gold, this.permanentUnlocks.getEntropyCrystals());
    }

    if (this.player.isDead) {
      this.stop();
      this._onDeath();
    }

    // Check level complete (classic)
    if (this.mode === 'classic' && this.enemies.getCount() === 0 && this.level.portal?.active) {
      this._onLevelComplete();
    }
  }

  _onLevelComplete() {
    this.running = false;

    // Save progress
    const nextLevel = this.currentLevelIndex + 1;
    const chapterData = this.currentChapter === 1 ? CHAPTER1 : this.currentChapter === 2 ? CHAPTER2 : CHAPTER3;
    const isLastLevel = nextLevel >= chapterData.levels.length;

    if (isLastLevel) {
      // Chapter complete
      const progress = this.saveManager.loadClassicProgress();
      const currentProgress = progress || {};
      if (!currentProgress.chapters) currentProgress.chapters = {};
      if (!currentProgress.chapters[this.currentChapter]) {
        currentProgress.chapters[this.currentChapter] = {};
      }
      currentProgress.chapters[this.currentChapter].lastLevel = nextLevel;
      currentProgress.chapters[this.currentChapter].complete = true;

      // Unlock echo_blade after chapter 2
      if (this.currentChapter === 2) {
        if (!currentProgress.unlockedWeapons) currentProgress.unlockedWeapons = ['pistol'];
        if (!currentProgress.unlockedWeapons.includes('echo_blade')) {
          currentProgress.unlockedWeapons.push('echo_blade');
        }
      }

      this.saveManager.saveClassicProgress(this.currentChapter, nextLevel, currentProgress.unlockedWeapons, currentProgress.unlockedPassives);

      // Chapter complete screen
      const ctx = this.ctx;
      ctx.fillStyle = 'rgba(0,0,0,0.92)';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#ff6b35';
      ctx.font = 'bold 32px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(`第${this.currentChapter}章 完成!`, this.width / 2, 180);
      if (this.currentChapter === 2) {
        ctx.fillStyle = '#00d4ff';
        ctx.font = '16px Courier New';
        ctx.fillText('解锁新武器: 回响双刃!', this.width / 2, 230);
      }
      ctx.fillStyle = '#888';
      ctx.font = '14px Courier New';
      ctx.fillText('按 ENTER 继续', this.width / 2, 300);

      const handler = (e) => {
        if (e.key === 'Enter') {
          document.removeEventListener('keydown', handler);
          if (this.currentChapter < 3) {
            this.currentChapter++;
            this.currentLevelIndex = 0;
            this._loadChapter(this.currentChapter);
          } else {
            this.showModeSelect();
          }
        }
      };
      document.addEventListener('keydown', handler);
    } else {
      // Save and advance to next level
      const progress = this.saveManager.loadClassicProgress();
      this.saveManager.saveClassicProgress(this.currentChapter, nextLevel, progress?.unlockedWeapons, progress?.unlockedPassives);

      this.currentLevelIndex = nextLevel;
      this._loadChapter(this.currentChapter);
    }
  }

  _onDeath() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0,0,0,0.92)';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#7b2cbf';
    ctx.font = 'bold 32px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('回响侵蚀', this.width / 2, 180);
    ctx.fillStyle = '#888';
    ctx.font = '14px Courier New';
    ctx.fillText('你已被回响吞噬...', this.width / 2, 230);
    ctx.fillText('按 ENTER 返回主菜单', this.width / 2, 300);

    const handler = (e) => {
      if (e.key === 'Enter') {
        document.removeEventListener('keydown', handler);
        this.showModeSelect();
      }
    };
    document.addEventListener('keydown', handler);
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.save();
    const cam = this.camera;
    ctx.translate(-cam.x, -cam.y);

    this.level.renderBackground(ctx);
    this.level.render(ctx);
    this.enemies.render(ctx);
    this.player.render(ctx);
    this.projectiles.render(ctx);
    this.particles.render(ctx);

    ctx.restore();

    this.ui.render(ctx);

    // Weapon switch UI (classic mode)
    if (this.mode === 'classic') {
      this.weaponSwitch.render(ctx);
    }

    // Roguelite HUD
    if (this.mode === 'roguelite') {
      this.rogueliteHUD.render(ctx, this.roguelite.isDaily, this.roguelite.seed);
    }

    // Shop overlay
    if (this.shop.isOpen) {
      this.shop.render(ctx);
    }

    // Event overlay
    if (this.roguelite.inEvent && this.roguelite.currentEvent) {
      this.rogueliteHUD.renderEventOverlay(ctx, this.roguelite.currentEvent);
    }
  }
}

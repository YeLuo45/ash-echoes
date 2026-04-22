import { InputManager } from './InputManager.js';
import { Player } from '../gameplay/Player.js';
import { EnemyManager } from '../gameplay/EnemyManager.js';
import { ProjectileManager } from '../gameplay/ProjectileManager.js';
import { ParticleManager } from '../utils/ParticleManager.js';
import { Level } from '../gameplay/Level.js';
import { UI } from '../ui/UI.js';
import { Camera } from './Camera.js';

export class Game {
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

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => this.input.keydown(e));
    window.addEventListener('keyup', (e) => this.input.keyup(e));
  }

  start() {
    this.running = true;
    this.player.init(100, 300);
    this.level.init();
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
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
    this.player.update(dt);
    this.enemies.update(dt);
    this.projectiles.update(dt);
    this.particles.update(dt);
    this.level.update(dt);
    this.camera.follow(this.player.x, this.player.y);

    if (this.player.isDead) {
      this.stop();
      document.getElementById('game-over-screen').style.display = 'flex';
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.save();
    const cam = this.camera;
    ctx.translate(-cam.x, -cam.y);

    // Background layers (parallax)
    this.level.renderBackground(ctx);

    // Game entities
    this.level.render(ctx);
    this.enemies.render(ctx);
    this.player.render(ctx);
    this.projectiles.render(ctx);
    this.particles.render(ctx);

    ctx.restore();

    // UI (screen-space)
    this.ui.render(ctx);
  }
}
